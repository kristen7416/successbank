# 地球Online成功银行 - 游戏风格设计指南

## 品牌定位
- **应用定位**：全球首款"成功银行"概念配得感提升工具
- **设计风格**：RPG游戏风、暗色主题、霓虹高亮、像素元素
- **目标用户**：需要提升配得感与自信心的用户
- **核心理念**：存下每一次微小成功，兑换属于你的人生奖励

## 配色方案

### 主色调（暗色游戏风格）
- **主背景**：`bg-gray-900` / `bg-slate-900`（深空黑）
- **卡片背景**：`bg-gray-800` / `bg-slate-800`（暗灰）
- **主色（霓虹蓝）**：`bg-cyan-500` `text-cyan-400` `border-cyan-500`（科技感）
- **辅色（霓虹紫）**：`bg-violet-500` `text-violet-400` `border-violet-500`（魔法感）

### 辅助色
- **金币黄**：`bg-yellow-400` `text-yellow-300`（金币/奖励）
- **生命绿**：`bg-emerald-500` `text-emerald-400`（成功/完成）
- **危险红**：`bg-red-500` `text-red-400`（挑战/困难）
- **经验橙**：`bg-orange-500` `text-orange-400`（经验/升级）

### 中性色
- **暗背景**：`bg-gray-900`
- **卡片背景**：`bg-gray-800`
- **文字主色**：`text-gray-100`
- **文字辅色**：`text-gray-400`
- **边框**：`border-gray-700`

### 语义色
- **成功**：`bg-emerald-500` `text-emerald-400`
- **警告**：`bg-yellow-500` `text-yellow-400`
- **错误**：`bg-red-500` `text-red-400`
- **稀有**：`bg-violet-500` `text-violet-400`
- **史诗**：`bg-cyan-500` `text-cyan-400`

## 字体规范
- **大标题**：`text-2xl font-bold text-gray-100`
- **页面标题**：`text-xl font-bold text-gray-100`
- **模块标题**：`text-lg font-semibold text-gray-100`
- **正文**：`text-sm text-gray-300`
- **辅助文字**：`text-xs text-gray-500`
- **数字强调**：`text-3xl font-bold text-cyan-400`
- **金币数字**：`text-yellow-300 font-bold`

## 间距系统
- **页面边距**：`px-4`
- **卡片内边距**：`p-4`
- **模块间距**：`gap-3` / `gap-4`
- **列表项间距**：`gap-2`

## 组件使用原则
- 按钮、输入框、弹窗、Tabs、Toast、Card 等通用 UI 组件优先使用 `@/components/ui/*`
- 页面先拆分 UI 单元，再将每个单元映射到组件库组件
- 禁止用 View/Text 手搓按钮、输入框、卡片、标签、弹层等通用 UI
- 游戏特色元素（HP条、经验条、星级评价、状态标记等）可用 View/Text 实现

## 容器样式
- **卡片**：`rounded-xl bg-gray-800 border border-gray-700`（暗色边框卡片）
- **标签胶囊**：`rounded-full bg-gray-700 text-gray-300 px-3 py-1 text-xs border border-gray-600`
- **选中状态**：`border-cyan-500 bg-cyan-500/10 text-cyan-400`
- **稀有边框**：`border-violet-500/50 bg-violet-500/10`
- **金色边框**：`border-yellow-500/50 bg-yellow-500/10`

## 游戏化UI元素
- **HP/经验条**：底部色条 + 百分比（emerald-500/cyan-500）
- **星级**：用 ★/☆ 表示难度等级
- **金币图标**：黄色圆点或 Coins 图标
- **锁图标**：Lock 图标 + 暗灰背景
- **完成标记**：Check 图标 + emerald 绿
- **等级徽章**：圆形图标 + 边框颜色区分品质

## 导航结构

### TabBar 配置（5个标签）
| 标签 | 页面路径 | 图标 | 含义 |
|------|---------|------|------|
| 主城 | pages/index/index | House | 游戏主界面 |
| 金库 | pages/deposit/index | CirclePlus | 存入成功 |
| 远征 | pages/tasks/index | Target | 21天冒险 |
| 技能 | pages/toolbox/index | Wrench | 技能树 |
| 角色 | pages/profile/index | User | 角色面板 |

## 小程序约束
- 图片/视频资源通过 TOS 对象存储管理
- TabBar 图标使用本地 PNG（81x81）
- 所有垂直排列 Text 添加 `block` 类
- Input/Textarea 用 View 包裹，样式放外层
- Fixed+Flex 布局使用 inline style
