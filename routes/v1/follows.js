const { Router } = require('express')
const { auth } = require('../../utils/auth')
const { apiCatch } = require('../../utils/errorHandle')
const router = Router()
const { followsToggle, getFollows } = require('../../controller/follows')

router.post('/', auth, apiCatch(followsToggle))
router.get('/', auth, apiCatch(getFollows))

module.exports = router
