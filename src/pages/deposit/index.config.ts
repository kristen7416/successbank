export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '成功银行' })
  : { navigationBarTitleText: '成功银行' }
