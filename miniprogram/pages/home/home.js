import {
  getSwiperList,
  getNavigationList,
  getFloorList
} from '../../network/home'
Page({
  data: {
    // 轮播图数组
    swiperList : [],
    // 导航数组
    recommends:[],
    // 楼层数据
    floorList : []
  },
  onLoad:function(opt){
    this._getSwiperList()
    this._getNavigationList()
    this._getFloorList()
  },
  // ------- 网络请求函数----------
  // 轮播图数据
  _getSwiperList(){
    getSwiperList().then(res =>{    
      const swiperList = res.data.message 
      console.log(swiperList);   
      this.setData({
        swiperList
      })
    })      
  },
  // 导航数据
  _getNavigationList(){
    getNavigationList().then(res =>{
      const recommends = res.data.message
      
      this.setData({
        recommends
      })
    })
  },
  // 楼层数据
  _getFloorList(){
    getFloorList().then(res =>{
      const floorList = res.data.message
      console.log(floorList);
      this.setData({
        floorList
      })
    })
  }

 
})