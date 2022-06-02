const User = require('../model/user')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')
const bcrypt = require('bcryptjs')
const { generatorToken } = require('../utils/auth')
const { isEmail } = require('validator')
const JWT = require('jsonwebtoken')
const { verifyObjectId } = require('../utils/mongoose')

const checkToken = async (req, res, next) => {
  res.status(200).send({ status: true, user: req.user })
}

const register = async (req, res, next) => {
  const {
    nickname,
    email,
    password,
    passwordConfirm,
    gender
  } = req.body

  const statusCode = 401

  if (nickname.length < 2) return next(ApiError.badRequest(statusCode, '暱稱至少 2 個字元以上!'))
  if (!(password === passwordConfirm)) return next(ApiError.badRequest(statusCode, '輸入密碼不一致!'))
  if (!/^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/.test(password)) return next(ApiError.badRequest(statusCode, '密碼必須英數混合'))
  if (password.length < 8) return next(ApiError.badRequest(statusCode, '密碼長度不得少於 8 碼'))
  const userData = await User.findOne({ email }).select('email')
  if (userData) return next(ApiError.badRequest(statusCode, '電子郵件的使用者帳戶已存在。'))

  const createdData = await User.create({
    nickname,
    email,
    gender,
    password: bcrypt.hashSync(password, 12)
  })
  successResponse({
    res,
    statusCode: 201,
    message: '註冊成功',
    data: {
      nickname: createdData.nickname,
      email: createdData.email
    }
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const statusCode = 401

  if (!email || !password) return next(ApiError.badRequest(statusCode, '資料有誤，請填寫完善!'))
  const userData = await User.findOne({ email }).select('_id nickname password avatar')
  if (!userData) return next(ApiError.badRequest(statusCode, '電子信箱或密碼錯誤。'))
  const passwordCheckStatus = bcrypt.compareSync(password, userData.password)
  if (!passwordCheckStatus) return next(ApiError.badRequest(statusCode, '電子信箱或密碼錯誤。'))

  const tokenType = 'Bearer '
  const token = generatorToken({
    _id: userData._id,
    nickname: userData.nickname,
    avatar: userData.avatar
  })

  res.append('Authorization', tokenType + token)
  successResponse({
    res,
    message: '登入成功',
    data: {
      user: {
        id: userData._id,
        nickname: userData.nickname,
        avatar: userData.avatar
      },
      tokenType,
      token
    }
  })
}

const forgotPassword = async (req, res, next) => {
  const { email } = req.body
  if (!email) return next(ApiError.badRequest(400, '請填入 email'))
  if (!isEmail(email)) return next(ApiError.badRequest(400, 'email 格式錯誤'))

  const user = await User.findOne({ email }).select('password email')
  if (!user) return next(ApiError.badRequest(400, '帳戶不存在!'))

  const payload = { _id: user._id, email: user.email }
  const secret = process.env.JWT_SECRET + user.password
  const newToken = generatorToken(payload, '15m', secret)

  const redirectUrl = `${process.env.APP_DOMAIN}reset-password/${user._id}/${newToken}`

  successResponse({
    res,
    message: `驗證信已發送至 ${user.email}`,
    data: { redirectUrl }
  })
}

const resetPassword = async (req, res, next) => {
  const { password, passwordConfirm, userId, token } = req.body

  if (!userId || !token) return next(ApiError.badRequest(400, '驗証資料錯誤'))
  if (!verifyObjectId(userId)) return next(ApiError.badRequest(400, '錯誤的使用者 id'))
  if (!password || !passwordConfirm) return next(ApiError.badRequest(400, '請完整填寫密碼'))
  if (password !== passwordConfirm) return next(ApiError.badRequest(400, '輸入密碼不一致!'))
  if (password.length < 8) return next(ApiError.badRequest(400, '密碼長度不得少於 8 碼'))
  if (!/^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/.test(password)) return next(ApiError.badRequest(400, '密碼必須英數混合'))

  const user = await User.findById(userId).select('password')
  if (!user) return next(ApiError.badRequest(400, '使用者不存在'))

  // 新密碼與舊密碼相同
  const passwordInclude = bcrypt.compareSync(password, user.password)
  if (passwordInclude) return next(ApiError.badRequest(400, '新密碼不得與舊密碼相同!'))

  const JWTPayload = JWT.verify(token, process.env.JWT_SECRET + user.password)
  if (JWTPayload._id !== userId) return next(ApiError.badRequest(400, '錯誤的使用者 id'))

  // 更新密碼
  const newUserData = await User.findOneAndUpdate({ _id: JWTPayload._id, email: JWTPayload.email }, {
    password: bcrypt.hashSync(password, 12)
  })

  successResponse({
    res,
    message: '密碼重置成功，請重新登入',
    data: {
      user: newUserData._id
    }
  })
}

module.exports = { checkToken, register, login, forgotPassword, resetPassword }
