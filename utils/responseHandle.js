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

const errorResponse = ({
  res,
  status = false,
  statusCode = 400,
  message = '操作失敗',
  error
}) => {
  res
    .status(statusCode)
    .send({
      status,
      message,
      error
    })
}

module.exports = {
  successResponse,
  errorResponse
}
