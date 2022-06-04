const { Router } = require('express')
const { auth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const {
  checkToken, register, login, forgotPassword, resetPassword,
  authGoogle
} = require('../controller/auth')

const router = Router()

router.get('/check_token', auth, apiCatch(checkToken))

router.post('/register', apiCatch(register))

router.post('/login', apiCatch(login))

router.post('/forgot-password', apiCatch(forgotPassword))

router.patch('/reset_password', apiCatch(resetPassword))

router.get('/google', apiCatch(authGoogle))
router.get('/google/callback', async (req, res, next) => {

})

module.exports = router
