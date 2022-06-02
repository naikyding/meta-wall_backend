const { Router } = require('express')
const { auth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const { checkToken, register, login, forgotPassword, resetPassword } = require('../controller/auth')

const router = Router()

// Token 驗證
router.get('/check_token', auth, apiCatch(checkToken))

// 註冊
router.post('/register', apiCatch(register))

// 登入
router.post('/login', apiCatch(login))

// forgot password
router.post('/forgot-password', apiCatch(forgotPassword))

router.patch('/reset_password', apiCatch(resetPassword))

module.exports = router
