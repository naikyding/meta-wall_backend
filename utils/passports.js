const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const User = require('../model/user')
const bcrypt = require('bcryptjs')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  callbackURL: `${process.env.NODE_ENV === 'dev'
    ? 'http://localhost:3000'
    : process.env.NODE_APP_DOMAIN}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let userData = {}
    const googleIdHash = bcrypt.hashSync(profile.id)
    const filterUserData = await User.findOne({ email: profile.emails[0].value })
    if (!filterUserData) {
      userData = await User.create({
        nickname: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        password: googleIdHash,
        googleId: googleIdHash
      })
    } else {
      userData = filterUserData
    }

    done(null, userData)
  } catch (error) {
    done(error)
  }
}
))

module.exports = passport
