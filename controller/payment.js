const hmacSHA256 = require('crypto-js/hmac-sha256')
const Base64 = require('crypto-js/enc-base64')
const axios = require('axios')
const { ApiError } = require('../utils/errorHandle')

// LINE PAY 支付
const linePay = async(req, res, next) => {
  const timestamp = new Date().getTime()

  const {
    LINE_PAY_CHANEL_ID: lineId,
    LINE_PAY_CHANEL_SECRET_KEY: lineSecret,
    LINE_PAY_API_URI: uri,
    APP_DOMAIN: webAppUrl
  } = process.env

  const body = req.body
  body.orderId = timestamp
  body.redirectUrls = {
    confirmUrl: webAppUrl,
    cancelUrl: webAppUrl
  }
  const bodyString = JSON.stringify(body)

  // Signature = Base64(HMAC-SHA256(Your ChannelSecret, (Your ChannelSecret + URI + RequestBody + nonce)))
  const signature = Base64.stringify(hmacSHA256(lineSecret + uri + bodyString + timestamp, lineSecret))

  const { data } = await axios.post(`${process.env.LINE_PAY_API_URL + uri}`, body, {
    headers: {
      'Content-Type': 'application/json',
      'X-LINE-ChannelId': lineId,
      'X-LINE-Authorization-Nonce': timestamp,
      'X-LINE-Authorization': signature
    }
  })

  if (data.returnCode !== '0000') return next(ApiError.badRequest(500, '發生錯誤，請重試'))

  res.send(data)
}

module.exports = {
  linePay
}
