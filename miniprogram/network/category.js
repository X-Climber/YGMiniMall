import request from './network'

// 分类页面数据
export function getCategoryList(){
  return request({
    url: '/categories'
  })
}