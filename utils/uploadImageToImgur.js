const { ImgurClient } = require('imgur')

const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESCH_TOKEN
})

const uploadImg = async (imgBuffer, next) => {
  const response = await client.upload({
    album: process.env.IMGUR_ALBUM,
    image: imgBuffer,
    type: 'stream'
  })
  return response
}

module.exports = uploadImg
