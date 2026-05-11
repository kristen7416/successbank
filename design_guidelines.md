# 地球Online成功银行 - 设计指南（治愈卡通游戏风格）

## 品牌定位
- **应用定位**：全球首款"成功银行"概念配得感提升工具
- **设计风格**：治愈卡通游戏风——像动物森友会一样温暖可爱，圆润饱满、色彩鲜明、充满童趣
- **目标用户**：需要提升配得感与自信心的用户
- **核心理念**：存下每一次微小成功，兑换属于你的人生奖励

## 配色方案

### 主色调（饱和度更高的糖果色）
- **主色（薄荷绿-治愈）**：`bg-teal-400` `text-teal-600` `bg-teal-500`（活力、治愈）
- **辅色（柠檬黄-快乐）**：`bg-yellow-300` `text-yellow-700` `bg-yellow-400`（快乐、温暖）

### 辅助色（糖果色系）
- **草莓粉**：`bg-pink-300` `text-pink-700` `bg-pink-400`（爱、温暖）
- **蓝莓紫**：`bg-purple-300` `text-purple-700` `bg-purple-400`（创造力、魔法）
- **橘子橙**：`bg-orange-300` `text-orange-700` `bg-orange-400`（能量、热情）

### 中性色（温暖中性调）
- **背景**：`bg-amber-50` / `bg-orange-50`（温暖米色，非冷灰）
- **文字主色**：`text-stone-800`（暖灰黑）
- **文字辅色**：`text-stone-500`
- **分割线**：`border-amber-200`

### 语义色
- **成功**：`bg-emerald-400` `text-white`
- **警告**：`bg-yellow-400` `text-yellow-900`
- **错误**：`bg-rose-400` `text-white`

## 字体规范
- **大标题**：`text-2xl font-bold`（粗圆，有力）
- **页面标题**：`text-xl font-bold`
- **模块标题**：`text-base font-bold`
- **正文**：`text-sm`
- **辅助文字**：`text-xs text-stone-400`
- **数字强调**：`text-3xl font-black text-teal-500`（数字要又大又醒目）

## 间距系统
- **页面边距**：`px-4`
- **卡片内边距**：`p-4`
- **模块间距**：`gap-3` / `gap-4`
- **列表项间距**：`gap-3`

## 组件使用原则
- 按钮、输入框、弹窗、Tabs、Toast、Card 等通用 UI 组件优先使用 `@/components/ui/*`
- 页面先拆分 UI 单元，再将每个单元映射到组件库组件
- 禁止用 View/Text 手搓按钮、输入框、卡片、标签、弹层等通用 UI

## 容器样式（卡通游戏风格）
- **卡片**：`rounded-2xl bg-white border-2 border-amber-200 shadow-md`（粗边框+圆角=卡通感）
- **顶部区域**：`bg-gradient-to-b from-teal-400 to-teal-500 rounded-b-[2rem]`（圆弧底部）
- **标签胶囊**：`rounded-full px-3 py-1.5 text-xs font-bold`（加粗字重+饱满内边距）
- **游戏按钮**：`rounded-xl font-bold border-2 border-b-4`（底部粗边=3D按钮感）
- **成就卡片**：`rounded-2xl border-2 border-yellow-300 bg-gradient-to-b from-white to-amber-50`
- **图标底座**：`w-10 h-10 rounded-xl bg-teal-100`（统一方块圆角底座）

## 游戏化元素
- **成功币图标**：用 Star 图标 + 黄色背景，代表金币
- **等级徽章**：`rounded-full border-2 border-yellow-400 bg-yellow-100`
- **进度条**：使用 `h-3 rounded-full`（更粗更醒目）
- **任务打卡**：完成时用 ✓ 圆形绿色标记
- **勋章**：用 `border-2 border-dashed` 虚线框表示未解锁，实线+渐变表示已解锁

## 导航结构

### TabBar 配置（5个标签）
| 标签 | 页面路径 | 图标 | 含义 |
|------|---------|------|------|
| 首页 | pages/index/index | House | 成功账户概览 |
| 存款 | pages/deposit/index | PlusCircle | 存入成功 |
| 任务 | pages/tasks/index | Target | 21天计划 |
| 工具箱 | pages/toolbox/index | Wrench | 心理工具 |
| 我的 | pages/profile/index | User | 个人中心 |

### TabBar 配色
- 未选中：`#94a3b8`
- 选中：`#2dd4bf`（teal-400）
- 背景：`#fffbeb`（amber-50 暖白）

### 页面跳转规范
- TabBar 页面间跳转：`Taro.switchTab()`
- 非 TabBar 页面：`Taro.navigateTo()`

## 小程序约束
- 图片/视频资源通过 TOS 对象存储管理，代码中使用 URL 引用
- TabBar 图标使用本地 PNG（81x81）
- 所有垂直排列 Text 添加 `block` 类
- Input/Textarea 用 View 包裹，样式放外层
- Fixed+Flex 布局使用 inline style
