# 地球Online成功银行 - 设计指南

## 品牌定位
- **应用定位**：全球首款"成功银行"概念配得感提升工具
- **设计风格**：温暖、治愈、明亮、简约
- **目标用户**：需要提升配得感与自信心的用户
- **核心理念**：存下每一次微小成功，兑换属于你的人生奖励

## 配色方案

### 主色调
- **主色（淡蓝-信任）**：`bg-sky-100` `text-sky-600` `bg-sky-500`（平静、信任）
- **辅色（淡黄-温暖）**：`bg-amber-100` `text-amber-600` `bg-amber-400`（温暖、希望）

### 辅助色
- **成长绿**：`bg-emerald-100` `text-emerald-600` `bg-emerald-500`（成长、进步）
- **创造紫**：`bg-violet-100` `text-violet-600` `bg-violet-500`（创造力、灵感）
- **鼓舞橙**：`bg-orange-100` `text-orange-600` `bg-orange-500`（鼓舞、热情）

### 中性色
- **背景**：`bg-gray-50` / `bg-white`
- **文字主色**：`text-gray-800`
- **文字辅色**：`text-gray-500`
- **分割线**：`border-gray-100`

### 语义色
- **成功**：`bg-emerald-500` `text-emerald-50`
- **警告**：`bg-amber-400` `text-amber-50`
- **错误**：`bg-rose-500` `text-rose-50`

## 字体规范
- **大标题**：`text-2xl font-bold`
- **页面标题**：`text-xl font-semibold`
- **模块标题**：`text-lg font-semibold`
- **正文**：`text-sm`
- **辅助文字**：`text-xs text-gray-400`
- **数字强调**：`text-3xl font-bold text-sky-600`

## 间距系统
- **页面边距**：`px-4`
- **卡片内边距**：`p-4`
- **模块间距**：`gap-3` / `gap-4`
- **列表项间距**：`gap-2`

## 组件使用原则
- 按钮、输入框、弹窗、Tabs、Toast、Card 等通用 UI 组件优先使用 `@/components/ui/*`
- 页面先拆分 UI 单元，再将每个单元映射到组件库组件
- 禁止用 View/Text 手搓按钮、输入框、卡片、标签、弹层等通用 UI

## 容器样式
- **卡片**：`rounded-2xl bg-white shadow-sm` 或 `bg-sky-50/50 rounded-2xl`
- **标签胶囊**：`rounded-full bg-sky-100 text-sky-700 px-3 py-1 text-xs`
- **模块分组**：`rounded-2xl p-4 bg-white`

## 导航结构

### TabBar 配置（5个标签）
| 标签 | 页面路径 | 图标 | 含义 |
|------|---------|------|------|
| 首页 | pages/index/index | House | 成功账户概览 |
| 存款 | pages/deposit/index | PlusCircle | 存入成功 |
| 任务 | pages/tasks/index | Target | 21天计划 |
| 工具箱 | pages/toolbox/index | Wrench | 心理工具 |
| 我的 | pages/profile/index | User | 个人中心 |

### 页面跳转规范
- TabBar 页面间跳转：`Taro.switchTab()`
- 非 TabBar 页面：`Taro.navigateTo()`

## 小程序约束
- 图片/视频资源通过 TOS 对象存储管理，代码中使用 URL 引用
- TabBar 图标使用本地 PNG（81x81）
- 所有垂直排列 Text 添加 `block` 类
- Input/Textarea 用 View 包裹，样式放外层
- Fixed+Flex 布局使用 inline style
