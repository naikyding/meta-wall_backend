const express = require('express')
const { ApiError } = require('../utils/errorHandle')
const router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  const { content } = req.body
  if (!content) {
    next(ApiError.badRequest('缺少 content 欄位'))

    return false
  }

  res.send({
    data: content
  })
})

module.exports = router
