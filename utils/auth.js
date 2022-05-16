const JWT = require('jsonwebtoken')
const { ApiError } = require('./errorHandle')
const errorGeneralMessage = require('./errorMessage')

/**
 * 產生 token 令牌
 * @date 2022-05-15
 * @param {String} payload 夾帶資料
 * @param {String} exp='7d' 有效期 (預設 7 天)
 * @returns {String} Token 令牌
 */
const generatorToken = (payload, exp = '7d') =>
  JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: exp })

/**
 * 驗證 token 令牌
 * @date 2022-05-15
 * @param {String} token 令牌
 * @returns {Object} 成功: 夾帶資料 / 失敗: 錯誤資料
 */
const verifyToken = (token) => JWT.verify(token, process.env.JWT_SECRET, (error, payload) => {
  if (error) return { errors: error }
  return { user: payload }
})

/**
 * (中介) token 是否授權 middleware
 * @date 2022-05-15
 * @param {Object} req 請求 物件
 * @param {Object} res 響應 物件
 * @param {Object} next 下一層
 */
const auth = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith('Bearer ')) { return next(ApiError.badRequest(undefined, '未授權，請輸入正確金鑰')) }

  const token = authorization.split(' ')[1]
  const { errors, user } = await verifyToken(token)
  if (errors) return next(ApiError.badRequest(401, errorGeneralMessage[errors.message] || '驗證失敗，請重新登入'))
  req.user = user
  next()
}

module.exports = { generatorToken, verifyToken, auth }
