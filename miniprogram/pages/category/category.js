import {
  getCategoryList
} from '../../network/category'
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧数据
    rightContent: [],
    // 被点击的索引
    currentIndex: 0,
    // 右侧内容的滚动条
    scrollTop : 0
  },
  Cates: [],
  onLoad: function (options) {
    /*
    1.先判断本地存储中有没有旧数据
    本地存储{time:Date.now(),data:[]}
    2.没有旧数据，直接发送请求
    3.有旧数据，而且旧数据没有过期，就用本地存储中的旧数据
    */
    // 1.获取存储的数据进行判断
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      this._getCategoryList()
    } else {
      // 有旧的数据，定义过期时间
      if (Date.now() - Cates.time > 5 * 60 * 1000) {
        // 重新发起请求
        this._getCategoryList()
      } else {
        // 使用旧的数据
        this.Cates = Cates.data;
        // 构造出左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        // 构造右侧数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }




  },
  // 获取分类数据
  _getCategoryList() {
    getCategoryList().then(res => {
      this.Cates = res.data.message

      // 存储数据
      wx.setStorageSync('cates', {
        time: Date.now(),
        data: this.Cates
      })
      // 构造出左侧大菜单数据
      let leftMenuList = this.Cates.map(v => v.cat_name)
      // 构造右侧数据
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },
  // 点击左侧菜单栏
  handleItemTap(e) {
    let index = e.currentTarget.dataset.index
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop : 0
    })

  }


})