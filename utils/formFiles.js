const multer = require('multer')
const { ApiError } = require('./errorHandle')

const postFiles = multer({
  fileFilter(req, file, cb) {
    // 驗証圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(ApiError.badRequest(400, '檔案格式錯誤，限上傳 jpg、jpeg、png 格式。'))
    cb(null, true)
  },
  limits: {
    // 檔案尺吋限制 2md
    fileSize: 1024 * 1024 * 2
  }
}).any()

module.exports = postFiles
