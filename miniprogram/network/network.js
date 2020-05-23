let ajaxTime = 0
import {
  baseUrl
} from './config'


export default function (opt) {
  
  ajaxTime++
  // 显示加载中
  wx.showLoading({
    title: '加载中',
    mask: true
  })

  return new Promise((resolve, reject) => {
    
    wx.request({
      url: baseUrl + opt.url,
      method: opt.method || 'get',
      data: opt.data || {},
      success: resolve,
      file: reject,
      complete: () => {
        ajaxTime--
        if (ajaxTime === 0) {
          // 关闭图标
          wx.hideLoading()
        }

      }
    })
  })
}