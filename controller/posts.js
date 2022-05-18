const { successResponse } = require('../utils/responseHandle')
const Post = require('../model/post')
const { ApiError } = require('../utils/errorHandle')

const getPostsList = async (req, res, next) => {
  const postList = await Post.find({})
  if (!postList) return next(ApiError.badRequest(undefined, '操作失敗，請重試'))

  successResponse({
    res,
    data: postList
  })
}

module.exports = { getPostsList }
