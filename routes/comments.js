const { Router } = require('express')
const { comments } = require('../controller/comments')
const { apiCatch } = require('../utils/errorHandle')
const { auth } = require('../utils/auth')
const router = Router()

router.post('/', auth, apiCatch(comments))

module.exports = router
