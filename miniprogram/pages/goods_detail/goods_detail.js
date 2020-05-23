import {baseUrl} from '../../network/config'
Page({
  data: {
    goodsObj:{}
  },
  GoodsInfo:{},
  onLoad: function (options) {
    const {goods_id} = options;
    this._getGoodsDetail(goods_id)

  },
  // 发送请求获取商品数据
  _getGoodsDetail(goods_id){
    wx.request({
      url: baseUrl + '/goods/detail?goods_id='+goods_id,
      success:(res =>{
        console.log(res)
        const goodsObj = res.data.message;
        this.GoodsInfo = goodsObj
        this.setData({
          goodsObj:{
            goods_name:goodsObj.goods_name,
            goods_price:goodsObj.goods_price,
            goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,".jpg"),
            pics:goodsObj.pics
          }
        })
      })
    })
  },
  // 点击图片预览
  handlePreviewImage(e){
    console.log(e)
    const current = e.currentTarget.dataset.url
    const urls = this.GoodsInfo.pics.map(v =>v.pics_mid)
    wx.previewImage({
      urls,
      current
    })
  },
  // 点击加入购物车
  handleCartAdd(){
    // 1.先获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || []
    // 2.判断商品对象是否存在购物车数组中
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    if(index === -1){
      // 3不存在，第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    }else{
      // 4存在，执行num++
      cart[index].num++
    }
    // 把购物车重新添加到缓存中
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入成功',
      // 防止用户手抖
      mask:true,
      icon:'success'
    })
  }



})