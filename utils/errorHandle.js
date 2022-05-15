const { errorResponse } = require('./responseHandle')

const errorHandle = (error, req, res, next) => {
  // 已知錯誤
  if (error instanceof ApiError) {
    errorResponse({
      res,
      statusCode: error.statusCode,
      message: error.message
    })

    return false
  }

  // 未知錯誤
  errorResponse({
    res,
    statusCode: 500,
    message: 'Something went wong!',
    // 開發模式: 看到 error.stack
    error: process.env.NODE_ENV === 'dev'
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      : undefined
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
  constructor (statusCode, message) {
    this.statusCode = statusCode
    this.message = message
  }

  static badRequest (statusCode = 400, message) {
    return new ApiError(statusCode, message)
  }

  static internalError (statusCode = 500, message) {
    return new ApiError(statusCode, message)
  }
}

const apiCatch = (fun) =>
  (req, res, next) => {
    try {
      fun(req, res, next)
    } catch (error) {
      next(error)
    }
  }

module.exports = { errorHandle, ApiError, apiCatch }
