export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '心理工具箱' })
  : { navigationBarTitleText: '心理工具箱' }
