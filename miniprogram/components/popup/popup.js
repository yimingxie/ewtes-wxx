// components/popup/popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '弹窗标题'
    },
    content: {
      type: String,
      value: '弹窗内容'
    },
    confirmtitle: {
      type: String,
      value: '确认'
    },
    canceltitle: {
      type: String,
      value: '取消'
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    popShow: false

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 展示弹框
    showPopup() {
      this.setData({
        popShow: true
      })
    },

    // 隐藏弹框
    hidePopup() {
      this.setData({
        popShow: false
      })
    },

    // 确认（传给父组件处理，用bind:confirm接收）
    confirmPopup() {
      this.triggerEvent("confirm")
    },

    // 取消（传给父组件处理，用bind:cancel接收）
    cancelPopup() {
      this.triggerEvent("cancel")
    },
    

  }
})
