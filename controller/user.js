const { ApiError } = require('../utils/errorHandle')
const User = require('../model/user')
const { successResponse } = require('../utils/responseHandle')
const bcrypt = require('bcryptjs')
const uploadImg = require('../utils/uploadImageToImgur')
const sizeOf = require('image-size')
const { isValidObjectId } = require('mongoose')

const userBaseInfo = async (req, res, next) => {
  const errorHandle = () => next(ApiError.badRequest(undefined, '驗証錯誤，請重新登入'))

  const { _id } = req.user
  if (!_id) return errorHandle()

  const userData = await User.findOne({ _id }).select('nickname avatar gender updatedAt')
  if (!userData) return errorHandle()

  successResponse({
    res,
    data: {
      user: {
        id: userData._id,
        nickname: userData.nickname,
        avatar: userData.avatar,
        gender: userData.gender
      }
    }
  })
}

const updateUserBaseInfo = async (req, res, next) => {
  const userUpdateData = {}
  const { nickname, gender } = req.body
  if (!nickname || !gender) return next(ApiError.badRequest(400, '請完善個人資料'))

  const uploadFiles = req.files[0]
  // 若有上傳頭像
  if (uploadFiles) {
    const imgBuffer = uploadFiles.buffer
    const { width, height } = await sizeOf(imgBuffer)
    if (width !== height) return next(ApiError.badRequest(400, '圖片寬高比必需為 1:1，請重新上傳'))

    const { data } = await uploadImg(imgBuffer)
    userUpdateData.avatar = data.link
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

const userFollows = async (req, res, next) => {
  const userId = req.user._id
  const followsUserId = req.params.userId

  if (!followsUserId || !isValidObjectId(followsUserId)) return next(ApiError.badRequest(400, '追蹤者 id 錯誤'))
  if (!await User.findById(followsUserId)) return next(ApiError.badRequest(400, '追蹤者 id 不存在!'))
  const isInclues = await User.findOne({ _id: userId, 'follows.userId': followsUserId })
  if (isInclues) return next(ApiError.badRequest(400, '使用者已在追蹤名單了!'))

  const userDataStatus = await User.findByIdAndUpdate(userId, {
    $push: {
      follows: {
        userId: followsUserId
      }
    }
  }, { new: true })

  await User.findByIdAndUpdate(followsUserId, {
    $addToSet: {
      follower: userId
    }
  }, { new: true })

  successResponse({
    res,
    message: '加入追蹤',
    data: {
      user: {
        follows: userDataStatus.follows
      }
    }
  })
}

const unUserFollows = async (req, res, next) => {
  const userId = req.user._id
  const followsUserId = req.params.userId

  if (!followsUserId || !isValidObjectId(followsUserId)) return next(ApiError.badRequest(400, '追蹤者 id 錯誤'))
  if (!await User.findById(followsUserId)) return next(ApiError.badRequest(400, '追蹤者 id 不存在!'))
  const isInclues = await User.findOne({ _id: userId, 'follows.userId': followsUserId })
  if (!isInclues) return next(ApiError.badRequest(400, '使用者本來就不在追蹤名單了!'))

  const newUserStatus = await User.findByIdAndUpdate(userId, {
    $pull: {
      follows: {
        userId: followsUserId
      }
    }
  }, { new: true })

  await User.findByIdAndUpdate(followsUserId, {
    $pull: {
      follower: newUserStatus._id
    }
  }, { new: true })

  successResponse({
    res,
    message: '移除追蹤',
    data: {
      user: {
        follows: newUserStatus.follows
      }
    }
  })
}

module.exports = {
  userBaseInfo,
  updateUserBaseInfo,
  updatePassword,
  userFollows,
  unUserFollows
}
