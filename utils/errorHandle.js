const errorGeneralMessage = require('./errorMessage')
const validationHandle = require('./modelValidationHandle')
const { errorResponse } = require('./responseHandle')

/**
 * 錯誤處理入口
 * @date 2022-05-15
 * @param {Object} error 錯誤物件
 * @param {Object} req 請求物件
 * @param {Object} res 響應物件
 * @param {Object} next 下一層
 */
const errorHandle = (error, req, res, next) => {
  // 已定義過錯誤
  if (error instanceof ApiError) {
    return errorResponse({
      res,
      statusCode: error.statusCode,
      message: error.message
    })
  }

  // 已知錯誤
  if (error.message in errorGeneralMessage || error.name in errorGeneralMessage) {
    return errorResponse({
      res,
      statusCode: error.statusCode,
      message: error.message in errorGeneralMessage
        ? errorGeneralMessage[error.message]
        : errorGeneralMessage[error.name]
    })
  }

  // mongoose 驗證錯誤處理
  if (error.name === 'ValidationError') {
    return errorResponse({
      res,
      statusCode: 422,
      message: '資料發生錯誤',
      errors: validationHandle(error.errors)
    })
  }

  // multer 錯誤處理
  if (error.name === 'MulterError') {
    return errorResponse({
      res,
      statusCode: 422,
      message: errorGeneralMessage[error.message] || error.message
    })
  }

  // JWT 錯誤處理
  if (error.name === 'JsonWebTokenError') {
    return errorResponse({
      res,
      statusCode: 422,
      message: errorGeneralMessage[error.message] || error.message
    })
  }

  if (process.env.NODE_ENV === 'dev') {
    console.log('------------ catch DEV ERROR (start) ------------')
    console.log(error)
    console.log('------------ catch DEV ERROR (end) ------------')
  }

  // 未知錯誤
  errorResponse({
    res,
    statusCode: 500,
    message: 'Something went wong!',
    // 開發模式: 看到 error.stack
    errors: { name: error.name, message: error.message, stack: error.stack }

    // // 開發模式: 看到 error.stack
    // errors: process.env.NODE_ENV === 'dev'
    //   ? { name: error.name, message: error.message, stack: error.stack }
    //   : undefined
  })
}

/**
 * 錯誤處理實例
 * @date 2022-05-14
 * @param {number} statusCode http 狀態碼
 * @param {string} message 響應訊息
 * @return {Constructor} 處理實例
 */
class ApiError {
  constructor(statusCode, message) {
    this.statusCode = statusCode
    this.message = message
  }

  static badRequest(statusCode = 400, message) {
    return new ApiError(statusCode, message)
  }

  static internalError(statusCode = 500, message) {
    return new ApiError(statusCode, message)
  }
}

/**
 * Controller 操作邏輯 catch 整合方法
 * @date 2022-05-15
 * @param {function} fun 函式
 */
const apiCatch = (fun) =>
  async (req, res, next) => {
    try {
      await fun(req, res, next)
    } catch (error) {
      next(error)
    }
  }

module.exports = { errorHandle, ApiError, apiCatch }
