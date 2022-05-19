const { Router } = require('express')
const router = Router()
const { apiCatch } = require('../utils/errorHandle')
const { getPostsList } = require('../controller/posts')
const { auth } = require('../utils/auth')

router.get('/', auth, apiCatch(getPostsList))

module.exports = router
