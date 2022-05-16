const { ApiError } = require('../utils/errorHandle')
const User = require('../model/user')
const { successResponse } = require('../utils/responseHandle')
const uploadImgToImgUr = require('../utils/uploadImg')

const userBaseInfo = async (req, res, next) => {
  const { _id, nickname } = req.user
  if (!_id) return next(ApiError.badRequest(undefined, '驗証錯誤，請重新登入'))

  const userData = await User.findOne({ _id, nickname }).select('nickname avatar gender updatedAt')

  successResponse({
    res,
    data: { user: userData }
  })
}

const updateUserBaseInfo = async (req, res, next) => {
  const userUpdateData = {}
  const { nickname, gender } = req.body
  if (!nickname || !gender) return next(ApiError.badRequest(undefined, '請完善個人資料'))

  // 若有上傳頭像
  if (req.file) {
    const imgBuffer = req.file.buffer
    const { data } = await uploadImgToImgUr(imgBuffer)
    userUpdateData.avatar = data.data.link
  }

  userUpdateData.nickname = nickname
  userUpdateData.gender = gender

  const id = req.user._id
  const resData = await User.findByIdAndUpdate(id, userUpdateData, { runValidators: true, new: true }).select('nickname avatar gender')

  successResponse({
    res,
    message: '修改成功',
    data: { user: resData }
  })
}

module.exports = { userBaseInfo, updateUserBaseInfo }
