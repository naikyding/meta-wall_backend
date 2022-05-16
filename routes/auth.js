const { Router } = require('express')
const { isAuth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const { checkToken, register, login } = require('../controller/auth')

const router = Router()

// Token 驗證
router.get('/check_token', isAuth, apiCatch(checkToken))

// 註冊
router.post('/register', apiCatch(register))

// 登入
router.post('/login', apiCatch(login))

module.exports = router
