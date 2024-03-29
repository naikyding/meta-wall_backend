const express = require('express')
const router = express.Router()
const postFiles = require('../utils/formFiles')

const { auth } = require('../utils/auth')
const { avatarImgUpload } = require('../controller/upload')
const { apiCatch } = require('../utils/errorHandle')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

// 圖片上傳
router.post('/avatar-img-upload', postFiles, auth, apiCatch(avatarImgUpload))

module.exports = router
