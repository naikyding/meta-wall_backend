const { Router } = require('express')
const { auth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const {
  checkToken, register, login, forgotPassword, resetPassword,
  authGoogle
} = require('../controller/auth')
const passport = require('passport')
const router = Router()

router.get('/check_token', auth, apiCatch(checkToken))

router.post('/register', apiCatch(register))

router.post('/login', apiCatch(login))

router.post('/forgot-password', apiCatch(forgotPassword))

router.patch('/reset_password', apiCatch(resetPassword))

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.APP_DOMAIN}login` }),
  apiCatch(authGoogle)
)

module.exports = router
