const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
// const User = require('../model/user')

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  // console.log(User)
  console.log(profile)
  return done(null, profile)
}
))

module.exports = passport
