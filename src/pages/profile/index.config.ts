export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的' })
  : { navigationBarTitleText: '我的' }
