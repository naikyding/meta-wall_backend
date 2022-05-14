const express = require('express')
const { ApiError, apiCatch } = require('../utils/errorHandle')
const router = express.Router()

/* GET users listing. */
router.get('/', apiCatch((req, res, next) => {
  const { content } = req.body

  if (!content) {
    next(ApiError.badRequest('缺少 content 欄位!!'))
    return
  }

  res.status(200).send({
    status: true
  })
}))

module.exports = router
