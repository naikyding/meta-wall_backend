const mongoose = require('mongoose')
const { apiCatch } = require('../utils/errorHandle')

const dbUrl = process.env.DB_URL
  .replace('<password>', process.env.DB_PWD)

const metaWallConnect = apiCatch(async () => {
  await mongoose.connect(dbUrl)
  console.log('------------------ meta-wall DB connect ------------------')
})

module.exports = metaWallConnect
