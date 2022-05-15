const User = require('../model/user')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')

const checkToken = async (req, res, next) => {
  res.status(200).send({ status: true, user: req.user })
}

const register = async (req, res, next) => {
  const {
    nickname,
    email,
    password,
    passwordConfirm
  } = req.body

  // const dataAry = [
  //   nickname,
  //   email,
  //   password,
  //   passwordConfirm
  // ]

  // if (emptyInBody(dataAry)) return next(ApiError.badRequest(422, '資料錯誤，請完善必填項目'))
  // if (!isEmail(email)) return next(ApiError.badRequest(422, '電子信箱格式錯誤!'))
  if (!(password === passwordConfirm)) return next(ApiError.badRequest(422, '輸入密碼不一致!'))

  const createdData = await User.create({
    nickname,
    email,
    password,
    passwordConfirm
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

module.exports = { checkToken, register }
