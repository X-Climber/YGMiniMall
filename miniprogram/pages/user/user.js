// pages/user/user.js
Page({
  data: {
    userInfo: {}
  },
  onShow(){
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo
    })
  }


})