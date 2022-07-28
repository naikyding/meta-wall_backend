const hmacSHA256 = require('crypto-js/hmac-sha256')
const Base64 = require('crypto-js/enc-base64')
const axios = require('axios')

// LINE PAY 支付
const linePay = async(req, res) => {
  const lineId = process.env.LINE_PAY_CHANEL_ID
  const lineSecret = process.env.LINE_PAY_CHANEL_SECRET_KEY
  const timestamp = new Date().getTime()
  const uri = '/v3/payments/request'

  const body = req.body
  body.orderId = timestamp
  body.redirectUrls = {
    confirmUrl: 'https://www.google.com',
    cancelUrl: 'https://www.yahoo.com'
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

  res.send(data)
}

module.exports = {
  linePay
}
