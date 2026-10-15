import Taro from '@tarojs/taro'
import { handleLocalApi, notifyDataUpdated } from '@/services/local-storage-backend'

/**
 * 网络请求模块
 * 封装 Taro.request、Taro.uploadFile、Taro.downloadFile，自动添加项目域名前缀
 * 在无后端服务部署（如 GitHub Pages 静态演示或离线环境）时，自动降级至客户端持久化本地存储，保证正常存取成功币与交互体验。
 */
export namespace Network {
    const isMockRequired = (url: string): boolean => {
        // 当未配置后端服务器地址时，所有 /api/ 请求走本地持久化存储
        const hasProjectDomain = typeof PROJECT_DOMAIN !== 'undefined' && Boolean(PROJECT_DOMAIN) && PROJECT_DOMAIN.trim() !== ''
        return !hasProjectDomain && url.startsWith('/api/')
    }

    const createUrl = (url: string): string => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url
        }
        return `${PROJECT_DOMAIN}${url}`
    }

    export const request: typeof Taro.request = ((option: any) => {
        const url = option.url || ''
        const method = String(option.method || 'GET').toUpperCase()

        // 静态部署/未配置后端时直接走本地存储引擎
        if (isMockRequired(url)) {
            const promise = handleLocalApi(option) as any
            promise.abort = () => {}
            return promise
        }

        const task = Taro.request({
            ...option,
            url: createUrl(url),
        }) as any

        // 若远程请求 404 或网络异常，自动平滑降级至本地存储
        const wrappedPromise = task
            .then((res: any) => {
                if (res.statusCode >= 400 && url.startsWith('/api/')) {
                    console.warn(`[Network] Remote ${url} returned ${res.statusCode}, falling back to local storage`)
                    return handleLocalApi(option)
                }
                if (['POST', 'PUT', 'DELETE'].includes(method) && res.statusCode < 400) {
                    notifyDataUpdated()
                }
                return res
            })
            .catch((err: any) => {
                if (url.startsWith('/api/')) {
                    console.warn(`[Network] Request ${url} failed, falling back to local storage`, err)
                    return handleLocalApi(option)
                }
                throw err
            })

        wrappedPromise.abort = () => {
            if (task && typeof task.abort === 'function') {
                task.abort()
            }
        }

        return wrappedPromise as any
    }) as any

    export const uploadFile: typeof Taro.uploadFile = option => {
        return Taro.uploadFile({
            ...option,
            url: createUrl(option.url),
        })
    }

    export const downloadFile: typeof Taro.downloadFile = option => {
        return Taro.downloadFile({
            ...option,
            url: createUrl(option.url),
        })
    }
}
