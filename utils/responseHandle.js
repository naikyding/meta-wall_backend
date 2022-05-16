/**
 * (成功) 響應格式
 * @date 2022-05-14
 * @param {Object} {res 響應物件
 * @param {Boolean} status=true 操作狀態
 * @param {Number} statusCode=200 http 狀態碼
 * @param {String} message='操作成功' 響應信息
 * @param {Object} data=[]} 響應資料
 */
const successResponse = ({
  res,
  status = true,
  statusCode = 200,
  message = '操作成功',
  data = []
}) => {
  res
    .status(statusCode)
    .send({
      status,
      message,
      data
    })
}

/**
 * (失敗) 響應格式
 * @date 2022-05-14
 * @param {Object} {res 響應物件
 * @param {Boolean} status=true 操作狀態
 * @param {Number} statusCode=400 http 狀態碼
 * @param {String} message='操作失敗' 響應信息
 * @param {Object} error=[]} 錯誤資料
 */
const errorResponse = ({
  res,
  status = false,
  statusCode = 400,
  message = '操作失敗',
  errors
}) => {
  res
    .status(statusCode)
    .send({
      status,
      message,
      errors
    })
}

module.exports = {
  successResponse,
  errorResponse
}
