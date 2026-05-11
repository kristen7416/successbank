export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/deposit/index',
    'pages/tasks/index',
    'pages/toolbox/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#0f172a',
    navigationBarTitleText: '地球Online',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#64748b',
    selectedColor: '#06b6d4',
    backgroundColor: '#0f172a',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '主城',
        iconPath: './assets/tabbar/house.png',
        selectedIconPath: './assets/tabbar/house-active.png'
      },
      {
        pagePath: 'pages/deposit/index',
        text: '金库',
        iconPath: './assets/tabbar/circle-plus.png',
        selectedIconPath: './assets/tabbar/circle-plus-active.png'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '远征',
        iconPath: './assets/tabbar/target.png',
        selectedIconPath: './assets/tabbar/target-active.png'
      },
      {
        pagePath: 'pages/toolbox/index',
        text: '技能',
        iconPath: './assets/tabbar/wrench.png',
        selectedIconPath: './assets/tabbar/wrench-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '角色',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
