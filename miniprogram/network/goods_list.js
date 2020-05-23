import request from './network'
// 分类页面数据
export function getGoodsList() {
  return request({
    url: '/goods/search'
  })
}