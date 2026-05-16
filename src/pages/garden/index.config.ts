export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '成功花园' })
  : { navigationBarTitleText: '成功花园' }
