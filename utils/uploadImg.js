const axios = require('axios')
const options = {
  headers: {
    Authorization: `Client-ID ${process.env.IMGUR_CLIENT}`
  }
}
const uploadImgToImgUr = async (imgFileBuffer, next) =>
  await axios.post(process.env.IMGUR_API, imgFileBuffer, options)

module.exports = uploadImgToImgUr
