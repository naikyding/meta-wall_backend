const { ApiError } = require('../utils/errorHandle')
const User = require('../model/user')
const { successResponse } = require('../utils/responseHandle')
const uploadImgToImgUr = require('../utils/uploadImg')
const bcrypt = require('bcryptjs')

const userBaseInfo = async (req, res, next) => {
  const errorHandle = () => next(ApiError.badRequest(undefined, '驗証錯誤，請重新登入'))

  const { _id, nickname } = req.user
  if (!_id) return errorHandle()

  const userData = await User.findOne({ _id, nickname }).select('nickname avatar gender updatedAt')
  if (!userData) return errorHandle()

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

const updatePassword = async (req, res, next) => {
  const { password, passwordConfirm } = req.body
  const id = req.user._id

  if (!password || !passwordConfirm) return next(ApiError.badRequest(undefined, '請完整填寫密碼'))
  if (password !== passwordConfirm) return next(ApiError.badRequest(undefined, '輸入密碼不一致!'))
  if (password.length < 8) return next(ApiError.badRequest(undefined, '密碼長度不得少於 8 碼'))

  // 新密碼與舊密碼相同
  const userDB = await User.findById(id).select('password')
  const passwordInclude = bcrypt.compareSync(password, userDB.password)
  if (passwordInclude) return next(ApiError.badRequest(undefined, '新密碼不得與舊密碼相同!'))

  // 寫入資料庫
  const newPasswordHash = bcrypt.hashSync(password, 12)
  await User.findByIdAndUpdate(id, { password: newPasswordHash }, { runValidators: true })

  successResponse({
    res,
    message: '重設密碼成功'
  })
}

module.exports = { userBaseInfo, updateUserBaseInfo, updatePassword }
