//云函数入口文件
const cloud = require("wx-server-sdk")
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.ocr.idcard({
      type: 'photo',
      img: {
        contentType: 'image/' + event.imgType,
        value: Buffer.from(event.imgArrayBuffer)
      }
    })
    return result;
  } catch (err) {
    console.log('云函数报错', err)
    return err
  }

}