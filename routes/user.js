const { Router } = require('express')
const { userBaseInfo, updateUserBaseInfo } = require('../controller/user')
const { auth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const { passFileToBodyByFormData } = require('../utils/formDataHandle')

const router = Router()

// 取得使用者基本資料
router.get('/', auth, apiCatch(userBaseInfo))

// 修改使用者基本資料
router.patch('/', auth, apiCatch(passFileToBodyByFormData('avatar')), apiCatch(updateUserBaseInfo))

module.exports = router
