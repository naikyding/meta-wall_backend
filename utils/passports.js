const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const User = require('../model/user')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  const resData = await User.find
  done(null, profile)
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return cb(err, user)
  // })
}
))

module.exports = passport
