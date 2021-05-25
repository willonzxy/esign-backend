const dayjs = require('dayjs')

console.log(dayjs('2021-11-20').locale('zh-cn').format(`YYYY年M月D日`))