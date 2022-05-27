const { successResponse } = require('../utils/responseHandle')
const Post = require('../model/post')
const { ApiError } = require('../utils/errorHandle')

const getPostsList = async (req, res, next) => {
  const { q, s } = req.query
  const keyword = new RegExp(q)
  const createdAtSort = (s && s === 'o') ? 1 : -1 // o: 舊到新

  const postList = await Post.find({ content: keyword })
    .populate({
      path: 'user',
      select: 'nickname avatar'
    })
    .select('-updatedAt')
    .sort({ createdAt: createdAtSort })

  if (!postList) return next(ApiError.badRequest(400, '操作失敗，請重試'))

  successResponse({
    res,
    data: postList
  })
}

module.exports = { getPostsList }
