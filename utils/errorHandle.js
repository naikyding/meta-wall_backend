const { errorResponse } = require('./responseHandle')

const errorHandle = (error, req, res, next) => {
  if (error instanceof ApiError) {
    errorResponse({
      res,
      statusCode: error.statusCode,
      message: error.message
    })

    return false
  }

  errorResponse({
    res,
    statusCode: 500,
    message: 'Something went wong!',
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

  /**
   * 錯誤的請求 400
   * @date 2022-05-14
   * @param {string} message 錯誤信息
   * @return {Constructor} 處理實例
   */
  static badRequest (message) {
    return new ApiError(400, message)
  }

  static internalError (message) {
    return new ApiError(500, message)
  }
}

module.exports = { errorHandle, ApiError }
