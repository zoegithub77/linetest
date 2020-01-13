require('dotenv').config()
const linebot = require('linebot')
const rp = require('request-promise')

const callAPI = async (name) => {
  let data = ''
  try {
    const str = await rp('http://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx')
    let json = JSON.parse(str)
    json = json.filter((j) => {
      return j.Name === name
    })
    if (json.length === 0) data = '找不到資料'
    else data = json[0].PicURL
  } catch (error) {
    data = '發生錯誤'
  }
  return data
}

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// eslint-disable-next-line no-unused-expressions
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    callAPI(usermsg).then(result => {
      if (result.substr(0, 5) === 'https') {
        event.reply({
          type: 'image',
          originalContentUrl: result,
          previewImageUrl: result
        })
      } else event.reply(result)
    }).catch(() => {
      event.reply('發生錯誤')
    })
  }
})
