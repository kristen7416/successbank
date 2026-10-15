import fs from 'node:fs';
import path from 'node:path';

import tailwindcss from '@tailwindcss/postcss';
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite';
import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import type { PluginItem } from '@tarojs/taro/types/compile/config/project';
import dotenv from 'dotenv';
import devConfig from './dev';
import prodConfig from './prod';
import pkg from '../package.json';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const generateTTProjectConfig = (outputRoot: string) => {
  const config = {
    miniprogramRoot: './',
    projectname: 'coze-mini-program',
    appid: process.env.TARO_APP_TT_APPID || '',
    compileType: 'miniprogram',
    setting: {
      urlCheck: false,
      es6: false,
      postcss: false,
      minified: true,
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
    },
    packOptions: { ignore: [{ type: 'folder', value: './assets' }] },
  };
  const outputDir = path.resolve(__dirname, '..', outputRoot);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(
    path.resolve(outputDir, 'project.config.json'),
    JSON.stringify(config, null, 2),
  );

  // 修复抖音小程序 tabBar iconPath：移除 "./" 前缀
  const appJsonPath = path.resolve(outputDir, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    try {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
      if (appJson.tabBar?.list) {
        appJson.tabBar.list = appJson.tabBar.list.map((item: Record<string, string>) => {
          const fixed: Record<string, string> = {};
          for (const [key, value] of Object.entries(item)) {
            fixed[key] = typeof value === 'string' && value.startsWith('./')
              ? value.replace(/^\.\//, '')
              : value;
          }
          return fixed;
        });
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
      }
    } catch {
      // app.json 可能尚不存在，跳过
    }
  }
};

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, _env) => {
  const outputRootMap: Record<string, string> = {
    weapp: 'dist',
    tt: 'dist-tt',
    h5: 'dist-web',
  };
  const defaultOutputRoot = outputRootMap[process.env.TARO_ENV || ''] || 'dist';
  const outputRoot = process.env.OUTPUT_ROOT?.trim() || defaultOutputRoot;
  const isH5 = process.env.TARO_ENV === 'h5';

  const buildMiniCIPluginConfig = () => {
    const hasWeappConfig = !!process.env.TARO_APP_WEAPP_APPID;
    const hasTTConfig = !!process.env.TARO_APP_TT_EMAIL;
    if (!hasWeappConfig && !hasTTConfig) {
      return [];
    }
    const miniCIConfig: Record<string, any> = {
      version: pkg.version,
      desc: pkg.description,
    };
    if (hasWeappConfig) {
      miniCIConfig.weapp = {
        appid: process.env.TARO_APP_WEAPP_APPID,
        privateKeyPath: 'key/private.appid.key',
      };
    }
    if (hasTTConfig) {
      miniCIConfig.tt = {
        email: process.env.TARO_APP_TT_EMAIL,
        password: process.env.TARO_APP_TT_PASSWORD,
        setting: {
          skipDomainCheck: true,
        },
      };
    }
    return [['@tarojs/plugin-mini-ci', miniCIConfig]] as PluginItem[];
  };

  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'coze-mini-program',
    date: '2026-1-13',
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot,
    plugins: ['@tarojs/plugin-generator', ...buildMiniCIPluginConfig()],
    defineConstants: {
      PROJECT_DOMAIN: JSON.stringify(
        process.env.PROJECT_DOMAIN ||
          process.env.COZE_PROJECT_DOMAIN_DEFAULT ||
          '',
      ),
      TARO_ENV: JSON.stringify(process.env.TARO_ENV),
    },
    copy: {
      patterns: [],
      options: {},
    },
    ...(process.env.TARO_ENV === 'tt' && {
      tt: {
        appid: process.env.TARO_APP_TT_APPID,
        projectName: 'coze-mini-program',
      },
    }),
    jsMinimizer: 'esbuild',
    framework: 'react',
    compiler: {
      type: 'vite',
      vitePlugins: [
        {
          name: 'postcss-config-loader-plugin',
          config(config) {
            // 通过 postcss 配置注册 tailwindcss 插件
            if (typeof config.css?.postcss === 'object') {
              config.css?.postcss.plugins?.unshift(tailwindcss());
            }
          },
        },
        {
          name: 'hmr-config-plugin',
          config() {
            if (!process.env.PROJECT_DOMAIN) {
              return;
            }
            return {
              server: {
                hmr: {
                  overlay: true,
                  path: '/hot/vite-hmr',
                  port: 6000,
                  clientPort: 443,
                  timeout: 30000,
                },
              },
            };
          },
        },
        ...(isH5
          ? [
              {
                name: 'fix-h5-tabbar-paths',
                enforce: 'post' as const,
                generateBundle(_options: any, bundle: Record<string, any>) {
                  for (const [fileName, chunk] of Object.entries(bundle)) {
                    if (fileName.endsWith('.js') && chunk.type === 'chunk' && typeof chunk.code === 'string') {
                      if (chunk.code.includes('/static/images/')) {
                        chunk.code = chunk.code.replace(/['"]\/static\/images\//g, '"./static/images/');
                      }
                    }
                  }
                },
                closeBundle() {
                  const outDir = path.resolve(__dirname, '..', outputRoot);
                  const jsDir = path.resolve(outDir, 'js');
                  if (fs.existsSync(jsDir)) {
                    for (const file of fs.readdirSync(jsDir)) {
                      if (file.endsWith('.js')) {
                        const fp = path.join(jsDir, file);
                        let content = fs.readFileSync(fp, 'utf-8');
                        if (content.includes('static/images/')) {
                          content = content.replace(/(\.\.\/|\/|\.\/)static\/images\//g, './static/images/');
                          fs.writeFileSync(fp, content, 'utf-8');
                        }
                      }
                    }
                  }
                  const htmlPath = path.resolve(outDir, 'index.html');
                  if (fs.existsSync(htmlPath)) {
                    let html = fs.readFileSync(htmlPath, 'utf-8');
                    html = html.replace('<title>coze-mini-program</title>', '<title>成功银行 - 正向习惯与成就激励应用</title>');
                    fs.writeFileSync(htmlPath, html, 'utf-8');
                  }
                },
              },
            ]
          : [
              UnifiedViteWeappTailwindcssPlugin({
                rem2rpx: true,
                cssEntries: [path.resolve(__dirname, '../src/app.css')],
              }),
            ]),
        ...(process.env.TARO_ENV === 'weapp'
          ? [
              {
                name: 'fix-weapp-tabbar-paths',
                closeBundle() {
                  const outDir = path.resolve(__dirname, '..', outputRoot);
                  const appJsonPath = path.resolve(outDir, 'app.json');
                  if (fs.existsSync(appJsonPath)) {
                    try {
                      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
                      if (appJson.tabBar?.list) {
                        appJson.tabBar.list = appJson.tabBar.list.map((item: Record<string, string>) => {
                          const fixed: Record<string, string> = {};
                          for (const [key, value] of Object.entries(item)) {
                            fixed[key] = typeof value === 'string' && value.startsWith('./')
                              ? value.replace(/^\.\//, '')
                              : value;
                          }
                          return fixed;
                        });
                        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
                      }
                    } catch {}
                  }
                },
              },
            ]
          : []),
        ...(process.env.TARO_ENV === 'tt'
          ? [
              {
                name: 'generate-tt-project-config',
                closeBundle() {
                  generateTTProjectConfig(outputRoot);
                },
              },
            ]
          : []),
      ],
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    h5: {
      publicPath: './',
      staticDirectory: 'static',
      router: {
        mode: 'hash',
      },
      devServer: {
        port: 5000,
        host: '0.0.0.0',
        open: false,
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
          },
        },
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        pxtransform: {
          enable: true,
          config: {
            platform: 'h5',
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    rn: {
      appName: 'coze-mini-program',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };

  process.env.BROWSERSLIST_ENV = process.env.NODE_ENV;

  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
