# 畅通码开发版v1.0.5

## 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)




## 小程序弹窗组件

## 使用方法
### 引入组件相关文件
![Image text](https://github.com/yueqianjmy/small-toast/blob/master/img/menu.jpg)
### 在使用弹窗的页面引入组件
`<toast id="toast" params="{{params}}"></toast>`
### 在app.wxss中全局引入组件样式
`@import '/components/toast/toast.wxss'`
### js中相关
#### data中添加params对象
```
data: {
  params: {
    success: 'success',
    context: '弹窗',
    time: ''
  }
}
```
#### onLoad中获取组件引用
`this.toast = this.selectComponent("#toast")`
#### 调用组件显示弹窗的方法
`this.toast.showToast()`
### API
params参数 | 类型 | 默认值 | 说明
---- | ---- | ---- | ----
success | String | ---- | 'success'为成功弹窗，'warning'为警告弹窗，为空时不显示图标
context | String | ---- | 弹窗内容
time | String | 2000 | 弹窗显示时间
## 组件截图
![Image text](https://github.com/yueqianjmy/small-toast/blob/master/img/%E6%88%AA%E5%9B%BE.jpg)

