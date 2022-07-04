const { Router } = require('express')
const router = Router()
const { auth } = require('../../utils/auth')
const { toggleLikes, userLikes } = require('../../controller/likes')
const { apiCatch } = require('../../utils/errorHandle')

router.post('/', auth, apiCatch(toggleLikes))
router.get('/', auth, apiCatch(userLikes))

module.exports = router
