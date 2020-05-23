import request from './network'

// 轮播图数据
export function getSwiperList(){
  return request({
    url : '/home/swiperdata'
  })
}
// 导航数据
export function getNavigationList(){
  return request({
    url : '/home/catitems'
  })
}
// 楼层数据
export function getFloorList(){
  return request({
    url : '/home/floordata'
  })
}