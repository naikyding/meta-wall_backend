const { successResponse } = require('../utils/responseHandle')

const comments = async (req, res, next) => {
  successResponse({
    res,
    message: 'COMMENTS'
  })
}

module.exports = { comments }
