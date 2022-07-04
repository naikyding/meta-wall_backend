const { Router } = require('express')
const { apiCatch } = require('../../utils/errorHandle')
const { auth } = require('../../utils/auth')
const router = Router()
const { comments, getComments } = require('../../controller/comments')

router.post('/', auth, apiCatch(comments))
router.get('/:postId', auth, apiCatch(getComments))

module.exports = router
