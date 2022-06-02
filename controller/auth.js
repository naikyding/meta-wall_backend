const User = require('../model/user')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')
const bcrypt = require('bcryptjs')
const { generatorToken } = require('../utils/auth')

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
  successResponse({
    res,
    message: '忘記密碼'
  })
}

module.exports = { checkToken, register, login, forgotPassword }
