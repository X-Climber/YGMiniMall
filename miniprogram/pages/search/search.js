/**
 * 1.输入框绑定，值改变事件，input事件
 *    1.获取到输入框的值
 *    2.合法性判断
 *    3.校验通过，把输入框的值返回到后台
 *    4.返回的数据打印到后台上
 * 2.防抖(防止抖动)
 *    1.一般用于输入框，防止重复输入，重复发送请求
 *    2.定义全局的定时器
 */

import {
  baseUrl
} from '../../network/config'
Page({
  data: {
    goods: [],
    // 按钮的显示隐藏
    isFoucs: false,
    inpValue : ""
  },
  TimeId: -1,
  // 输入框的值改变事件
  handleInput(e) {
    // 获取输入框的值
    const {
      value
    } = e.detail
    // 检查合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFoucs: false
      })
      return
    }
    this.setData({
      isFoucs: true
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000)

  },
  qsearch(query) {
    wx.request({
      url: baseUrl + '/goods/qsearch',
      data: {
        query
      },
      success: res => {
        this.setData({
          goods: res.data.message
        })
      }
    })
  },
  // 清除按钮
  handleClear() {
    this.setData({
      goods: [],
      isFoucs: false,
      inpValue:""
    })
  }
})