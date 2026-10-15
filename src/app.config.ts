export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/deposit/index',
    'pages/tasks/index',
    'pages/toolbox/index',
    'pages/profile/index',
    'pages/garden/index'
  ],
  lazyCodeLoading: 'requiredComponents',
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fffbeb',
    navigationBarTitleText: '成功银行',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#2dd4bf',
    backgroundColor: '#fffbeb',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/deposit/index',
        text: '存款',
        iconPath: './assets/tabbar/circle-plus.png',
        selectedIconPath: './assets/tabbar/circle-plus-active.png'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '任务',
        iconPath: './assets/tabbar/target.png',
        selectedIconPath: './assets/tabbar/target-active.png'
      },
      {
        pagePath: 'pages/toolbox/index',
        text: '工具箱',
        iconPath: './assets/tabbar/wrench.png',
        selectedIconPath: './assets/tabbar/wrench-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
