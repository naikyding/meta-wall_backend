const { Router } = require('express')
const { checkToken } = require('../controller/user')
const { isAuth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')

const router = Router()

// Token 驗證
router.get('/check_token', isAuth, apiCatch(checkToken))

module.exports = router
