const { Router } = require('express')
const { auth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const { passFileToBodyByFormData } = require('../utils/formDataHandle')
const { userBaseInfo, updateUserBaseInfo, updatePassword } = require('../controller/user')

const router = Router()

// 取得使用者基本資料
router.get('/', auth, apiCatch(userBaseInfo))

// 修改使用者基本資料
router.patch('/', auth, apiCatch(passFileToBodyByFormData('avatar')), apiCatch(updateUserBaseInfo))

// 修改使用者密碼
router.patch('/update_password', auth, apiCatch(updatePassword))

module.exports = router
