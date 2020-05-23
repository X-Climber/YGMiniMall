/*
1.调用小程序内置  api 获取用户的收货地址 wx.chooseAddress({})

2.获取用户对小程序所授予获取地址的权限状态 scope
  1.假设用户点击获取收货地址的权限框  确定  authSetting.scope.address
    scope 的值为true    直接调用 获取收货地址
  2.假设用户重来没有调用过 收获地址的 api
    scope 的值为 undefined   直接调用 获取收货地址
  3.假设用户点击获取收货地址的权限框  取消
    scope 的值为 false
    1.用户自己打开授权设置页面 用户重新获取地址权限
    2.获取收货地址

3.onShow
  0.商品详情页面，点击加入购物车的时候，手动添加属性
    num = 1
    checked =true
  1.获取缓存中的购物车数组 
  2.把购物车数据填充到data中
4.全选的实现，数据展示
  1.onShow 获取缓存购物车的数组
  2.根据购物车中的商品数据，所有商品都被选中，checked= true 全选就被选中
5.总价格和总数量
  1.商品都需要被选中，才能计算
  2.获取购物车数组
  3.遍历
  4.判断商品是否被选中
  5.总价格 += 商品单价 * 商品数量
    总数量 += 商品数量
  6.将计算后的数值设置到data中   
6.商品的选中
  1.绑定change事件
  2.获取到被修改的商品对象
  3.商品对象的选中状态 取反
  4.重新填充到data和缓存中  
  5.重新计算全选，总价格，总数量 
7.全选和反选
  1.全选复选框绑定事件 change
  2.获取data中的全选变量 allchecked
  3.直接取反  allchecked=!allchecked
  4.遍历 购物车数组，让里面商品的状态跟着 allchecked的改变而改变
  5.把购物车数组 和 allchecked重新设置到data中  把购物车重新设置到缓存中
8.商品数量的编辑功能
  1."+"和"-"按钮绑定同一个事件，区分的关键，在于自定义属性 
  2.传递被点击的商品id  goods_id
  3.获取data中的购物车数组，来获取需要被修改的商品对象
  4.当商品数量是1，用户点击-
    弹窗提示用户是否删除
    1 确定 直接删除
    2 取消 什么都不做
  5.直接修改商品中的数量 num
  6.把cart数组重新设置到data和缓存中
9.点击结算
  1.判断有没有地址信息
  2.判断用户有没有选中商品
  3.经过判断，跳转到支付页面  
  
*/
import {
  getSetting,
  chooseAddress,
  openSetting
} from '../../utils/asnycWx'
Page({

  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onLoad: function (options) {},
  onShow: function () {
    // 获取缓存中的地址
    const address = wx.getStorageSync('address')
    // 获取缓存中购物车的数据
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      address
    })
    this.setCart(cart)
  },
  // 点击收货地址
  handleChooseAddress() {
    getSetting().then(res => {
      const scopeAddress = res.authSetting["scope.address"];
      if (scopeAddress === false) {
        openSetting().then(res2 => {
          chooseAddress().then(res3 => {})
          .catch(err3=>{
            console.log(err3)
          })
        }).catch(err=>{
          console.log(err2)
        })
      }
      chooseAddress().then(res1 => {
        const address = res1
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
        wx.setStorageSync('address', address)
      }).catch(err1=>{
        console.log(err1)
      })

    }).catch(err=>{
      console.log(err)
    })


  },
  // 商品的选中
  handleItemChange(e) {
    // 1.获取被修改状态的id
    const goods_id = e.currentTarget.dataset.id
    // 2.获取购物车数组
    const {
      cart
    } = this.data
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)

  },

  // 商品的全选功能
  handleItemAllCheck() {
    let {
      cart,
      allChecked
    } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    this.setCart(cart)
  },
  // 商品数量
  handleItemNumEdit(e) {
    // 获取传递过来的参数
    let {
      opration,
      id
    } = e.currentTarget.dataset
    // 获取购物车数组
    let {
      cart
    } = this.data
    // 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id)

    // 判断数量是否为1
    if (cart[index].num === 1 && opration === -1) {
      wx.showModal({
        title: '提示',
        content: '您是否要删除该商品',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1)
            this.setCart(cart)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      // 进行数量修改
      cart[index].num += opration
      // 设置到data和缓存中
      this.setCart(cart)
    }


  },

  // 设置购物车状态同时重新计算底部工具栏的数据
  setCart(cart) {
    // 7重新计算全选，总价，总数量
    let allChecked = true
    // 总价格和总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length != 0 ? allChecked : false

    // 5.6 把购物车数据重新设置到data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart)
  },

  // 点击结算
  handlePay() {
    const {
      address,
      totalNum
    } = this.data
    // 判断收货地址
    if (!address.userName) {
      wx.showToast({
        title: '您还没有选择收货地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 判断有没有选购商品
    if (totalNum === 0) {
      wx.showToast({
        title: '您还没有选择商品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  }


})