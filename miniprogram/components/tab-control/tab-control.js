// components/tab-control/tab-control.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCurrentIndex(e){
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('tabsItemChange',{index})
      
    }
  }
})
