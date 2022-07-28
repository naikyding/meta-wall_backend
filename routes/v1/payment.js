const { Router } = require('express')
const router = Router()

const { linePay } = require('../../controller/payment')
const { apiCatch } = require('../../utils/errorHandle')

router.post('/line', apiCatch(linePay))

module.exports = router
