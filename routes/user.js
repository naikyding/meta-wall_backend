const { Router } = require('express')
const { isAuth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const { checkToken, register } = require('../controller/user')

const router = Router()

// Token 驗證
router.get('/check_token', isAuth, apiCatch(checkToken))

// 註冊
router.post('/register', apiCatch(register))

module.exports = router
