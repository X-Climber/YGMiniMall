export const getSetting = ()=>{
  return new Promise((resolve,reject) =>{
    wx.getSetting({
      success: (res) => {
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}

export const chooseAddress = ()=>{
  return new Promise((resolve,reject) =>{
    wx.chooseAddress({
      success: (res) => {
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}

export const openSetting = ()=>{
  return new Promise((resolve,reject) =>{
    wx.openSetting({
      success: (res) => {
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}

/**
 * 授权权限
 */

export const login = ()=>{
  return new Promise((resolve,reject) =>{
    wx.login({
      timeout:10000,
      success: (res) => {
        resolve(res);      
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}

/**
 * promise 形式的微信支付
 */
export const requestPayment = (pay)=>{
  return new Promise((resolve,reject) =>{  
    wx.requestPayment({
      ...pay,
      success:(res)=>{
        resolve(res); 
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}

