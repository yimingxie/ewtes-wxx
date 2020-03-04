const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 格式化时间戳
 * @param {number} timestamp 时间戳
 * @return {string} "2019-04-16 15:50:30" "19-04-16"
 */
const formatTimestamp = timestamp => {
  // str.slice(-2) 从字符串的倒数第二个字符开始截取 "abcd" -> "cd"
  if (typeof timestamp == 'string') return timestamp

  var dateObj = new Date(timestamp)
  var year = dateObj.getFullYear(),
    month = ("0" + (dateObj.getMonth() + 1)).slice(-2),
    date = ("0" + dateObj.getDate()).slice(-2),
    hour = ("0" + dateObj.getHours()).slice(-2),
    minute = ("0" + dateObj.getMinutes()).slice(-2),
    second = ("0" + dateObj.getSeconds()).slice(-2);

  // var result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  var result = year.substring(2, 4) + '-' + month + '-' + date
  return result;
}

module.exports = {
  formatTime: formatTime
}
