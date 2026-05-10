export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '21天计划' })
  : { navigationBarTitleText: '21天计划' }
