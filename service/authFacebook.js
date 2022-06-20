const https = require('https')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const uploadImg = require('../utils/uploadImageToImgur')

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  profileFields: ['id', 'emails', 'displayName', 'photos'],
  callbackURL: `${process.env.NODE_ENV === 'dev'
    ? 'http://localhost:3000'
    : process.env.NODE_APP_DOMAIN}/auth/facebook/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName } = profile
    const email = profile.emails[0].value
    let avatar = ''
    let userData = {}

    const userIncludes = await User.findOne({
      email
    })

    if (userIncludes) {
      done(null, userIncludes)
    } else {
      await https.get(profile._json.picture.data.url, (res) => {
        const chunks = []
        let size = 0
        res.on('data', chunk => {
          size += chunk.length
          chunks.push(chunk)
        })
        res.on('end', async () => {
          const imgBuf = Buffer.concat(chunks, size)
          const { data: { link } } = await uploadImg(imgBuf)
          avatar = link

          userData = await User.create({
            nickname: displayName,
            email,
            avatar,
            facebookId: id,
            password: bcrypt.hashSync(id)
          })

          done(null, userData)
        })
      })
    }
  } catch (error) {
    done(error)
  }
}
))

module.exports = passport
