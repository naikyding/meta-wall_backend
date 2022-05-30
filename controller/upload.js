const uploadImg = require('../utils/uploadImageToImgur')
const sizeOf = require('image-size')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')

const avatarImgUpload = async (req, res, next) => {
  if (!req.files) return next(ApiError.badRequest(400, '請上傳圖片!'))
  const imgFiles = await sizeOf(req.files[0].buffer)

  if (imgFiles.width !== imgFiles.height) return next(ApiError.badRequest(400, '上傳圖片比例，必須 1:1!'))
  const resData = await uploadImg(req.files[0].buffer)

  successResponse({
    res,
    message: 'uploaded',
    data: { imageUrl: resData.data.link }
  })
}

module.exports = { avatarImgUpload }
