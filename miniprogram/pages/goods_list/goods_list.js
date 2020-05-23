import {
  getGoodsList
} from '../../network/goods_list'
const TOP_DISTINCT = 1000
/*
 1.用户上滑，页面触底，开始加载下一页数据
   1.找到滚动条触底事件
   2.判断还有没有下一条数据
      1.获取到总页数  只有总条数
          总页数 = Math.ceil(总条数 / 页容量 pagesize)
      2.获取到当前页码  pagenum
      3.判断当前页面是否大于等于总页数
        表示没有下一条
   3.假如没有下一条数据，弹出提示
   4.有下一条数据，加载下一条数据
      1.当前的页码 ++
      2.重新发送请求
      3.数据请求回来，对data中的数据进行拼接，不替换
2.下拉刷新页面
  1.触发下拉刷新事件
  2.重置数据数组
  3.重置页码，设置为1  
  4.重新发送请求
  5.数据请求回来后，关闭下拉刷新窗口    
*/
Page({
  data: {
    tabs: [{
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: [],
    showBackTop: false
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this._getGoodsList();

  },
  // 上拉事件，页面触底
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '数据加载完毕',
        icon: 'success',
        duration: 2000
      })
    } else {
      this.QueryParams.pagenum++;
      this._getGoodsList()
    }

  },
  // 回到顶部
  onPageScroll(options) {
    const scrollTop = options.scrollTop;
    const flag1 = scrollTop >= TOP_DISTINCT;
    if (flag1 != this.data.showBackTop) {
      this.setData({
        showBackTop: flag1
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    //2 重置页码，设置为1  
    this.QueryParams.pagenum = 1
    // 3发送请求
    this._getGoodsList()
  },

  // 网络请求数据事件
  _getGoodsList() {
    wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/goods/search?cid=' + this.QueryParams.cid,
      success: (res => {
        const goodsList = res.data.message.goods
        // 获取总条数
        const total = res.data.message.total
        // 计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
        this.setData({
          goodsList: [...this.data.goodsList, ...goodsList]
        })
      })
    })



    // getGoodsList().then(res =>{
    //   console.log(res);
    //   const goodsList = res.data.message.goods
    //   // 获取总条数
    //   const total =  res.data.message.total
    //   // 计算总页数
    //   this.totalPages = Math.ceil( total / this.QueryParams.pagesize)
    //   this.setData({
    //     goodsList : [...this.data.goodsList,...goodsList]
    //   })
    // })
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },


  // 自定义点击事件
  handleTabItemChange(e) {
    // 1.获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2.修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 3.赋值到data中
    this.setData({
      tabs
    })
  }


})