const { Router } = require('express')
const { auth } = require('../utils/auth')
const { apiCatch } = require('../utils/errorHandle')
const {
  userBaseInfo, updateUserBaseInfo, updatePassword,
  userFollows, unUserFollows
} = require('../controller/user')
const postFiles = require('../utils/formFiles')

const router = Router()

// 取得使用者基本資料
router.get('/', auth, apiCatch(userBaseInfo))

// 修改使用者基本資料
router.patch('/', auth, postFiles, apiCatch(updateUserBaseInfo))

// 修改使用者密碼
router.patch('/update_password', auth, apiCatch(updatePassword))

router.post('/:userId/follows', auth, apiCatch(userFollows))
router.delete('/:userId/follows', auth, apiCatch(unUserFollows))

module.exports = router
