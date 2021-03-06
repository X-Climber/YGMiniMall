/**
 * 1.页面被打开的时候 onShow
 *    1.获取到url上的参数type
 *    2.根据type  去发送请求，获取数据
 *    3.渲染页面
 * 2.点击不同的标题，重新发送请求获取数据，渲染页面
 */
import {
  baseUrl
} from '../../network/config'
Page({
  data: {
    orders: [{
      order_id:1,
      order_num:111,
      order_price:100,
      order_time:(new Date()).toLocaleString()
    },{
      order_id:2,
      order_num:222,
      order_price:200,
      order_time:(new Date()).toLocaleString()
    },{
      order_id:3,
      order_num:333,
      order_price:300,
      order_time:(new Date()).toLocaleString()
    }],
    tabs: [{
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ]
  },

  onShow(options) {
    const token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return
    }
    const header = {
      Authorization: token
    }
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    const {
      type
    } = currentPage.options
    this.changeTitleByIndex(type - 1)
    this.getOrder(type, header)

  },
  // 获取订单列表
  getOrder(type, header) {
    wx.request({
      url: baseUrl + '/my/orders/all',
      header,
      data: {
        type
      },
      success: res => {
        this.setData({
          orders: res.orders
        })
      }

    })
    console.log(this.data.orders)
  },

  // 根据标题索引激活选中 标题数组
  changeTitleByIndex(index) {
    // 2.修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

  // 自定义点击事件
  handleTabItemChange(e) {
    // 1.获取被点击的标题索引
    const {
      index
    } = e.detail;
    this.changeTitleByIndex(index)

    const token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return
    }
    const header = {
      Authorization: token
    }
    this.getOrder(index + 1,header)
  }

})