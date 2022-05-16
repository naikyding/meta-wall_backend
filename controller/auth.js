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

  if (!(password === passwordConfirm)) return next(ApiError.badRequest(422, '輸入密碼不一致!'))
  if (password.length < 8) return next(ApiError.badRequest(422, '密碼長度不得少於 8 碼'))
  const userData = await User.findOne({ email }).select('email')
  if (userData) return next(ApiError.badRequest(422, '電子郵件的使用者帳戶已存在。'))

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

  if (!email || !password) return next(ApiError.badRequest(undefined, '資料有誤，請填寫完善!'))
  const userData = await User.findOne({ email }).select('_id nickname email password')
  if (!userData) return next(ApiError.badRequest(undefined, '電子信箱或密碼錯誤。'))
  const passwordCheckStatus = bcrypt.compareSync(password, userData.password)
  if (!passwordCheckStatus) return next(ApiError.badRequest(undefined, '電子信箱或密碼錯誤。'))

  const tokenType = 'Bearer '
  const token = generatorToken({
    _id: userData._id,
    nickname: userData.nickname
  })

  res.append('Authorization', tokenType + token)
  successResponse({
    res,
    message: '登入成功',
    data: {
      user: {
        nickname: userData.nickname,
        email: userData.email
      },
      tokenType,
      token
    }
  })
}

module.exports = { checkToken, register, login }
