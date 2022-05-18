const { Router } = require('express')
const router = Router()
const { apiCatch } = require('../utils/errorHandle')
const { getPostsList } = require('../controller/posts')

router.get('/', apiCatch(getPostsList))

module.exports = router
