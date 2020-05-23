/**
 * 1.页面加载的时候
 *    1.从缓存中获取购物车数据  渲染到页面  数据  checked=true
 * 2.微信支付
 *    1.哪些人  哪些账号可以实现微信支付
 *        1.企业账号
 *        2.企业账号后台中，给开发者添加白名单
 *          1.一个appid可以绑定多个开发者
 *          2.开发者可以公用appid和权限
 * 3.支付按钮
 *    1.判断缓存有没有token
 *    2.没有的话跳转到授权页面，进行获取token
 *    3.有token 进行下一步
 *    4.创建订单。获取到订单编号 
 *    5.已经完成微信支付
 *    6.手动删除缓存中已经被选中的商品
 *    7.删除后的购物车数据重新填充到缓存中
 *    8.在跳转页面
 * 
 */
import {
  requestPayment
} from '../../utils/asnycWx'
import {
  baseUrl
} from '../../network/config'
Page({

  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onLoad: function (options) {},
  onShow: function () {
    // 获取缓存中的地址
    const address = wx.getStorageSync('address')
    // 获取缓存中购物车的数据
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({
      address
    })
    // 总价格和总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })

    // 5.6 把购物车数据重新设置到data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  // 点击支付结算
  handleOrderPay(){
    // 获取token
    const token = wx.getStorageSync('token')
    // 判断有没有token
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return 
    }
    // 创建订单
    // 准备请求头参数
    const header = { Authorization : token }
    // 准备请求体
    // 订单总价格
    const order_price = this.data.totalPrice
    // 收货地址
    const consignee_addr = this.data.address.all
    let cart = this.data.cart
    // 订单数组
    let goods = []
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderPrice =  {order_price,consignee_addr,goods}
    // 发送请求
    wx.request({
      url: baseUrl + '/my/orders/create',
      method:'POST',
      data:orderPrice,
      header:header,
      success:res=>{
        const {order_number} = res
        // 发起预支付请求
        wx.request({
          url: baseUrl + '/my/orders/req_unifiedorder',
          method:"POST",
          header,
          data:{order_number},
          success:res1=>{
            const {pay} = res1
            // 发起微信支付
            requestPayment(pay).then(res2=>{
              // 查询后台订单状态
              wx.request({
                url: baseUrl + '/my/orders/chkOrder',
                method:"POST",
                header,
                data:{order_number},
                success:(res3=>{
                  wx.showToast({
                    title: '支付成功',
                  })
                  // 手动删除缓存中已经支付的商品
                  let newCart = wx.getStorageSync('cart')
                  newCart = newCart.filter(v=>!v.checked)
                  wx.setStorageSync('cart', newCart)
                  // 跳转到订单页面
                  wx.navigateTo({
                    url: '/pages/order/order',
                  })
                }),
                fail:(err3)=>{
                  wx.showToast({
                    title: '支付失败',
                  })
                }
              })
            }).catch(err=>{
              console.log()
            })
          }
        })
      }
    })

  }

})