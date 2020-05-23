import {
  baseUrl
} from '../../network/config'
import {
  login
} from '../../utils/asnycWx'
Page({
  bindGetUserInfo(e) {
    // 获取用户信息
    const {
      encryptedData,
      rawData,
      iv,
      signature
    } = e.detail
    // 获取小程序登录成功后的token 值
    login().then(res => {
      const {
        code
      } = res
      
       const loginParams = {encryptedData,rawData,iv,signature,code}
      //  console.log(loginParams)
      //  发送请求 获取用户的token
      wx.request({
        url: baseUrl + '/users/wxlogin',
        data:loginParams,
        method: "POST",
        success: (res1 => {
          const {token} = res1
          wx.getStorageSync('token')
          wx.navigateBack({
            delta:1
          })
        })
      })

    }).catch(err => {
      console(err)
    })
  }
})