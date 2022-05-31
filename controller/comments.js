const Post = require('../model/post')
const User = require('../model/user')
const Comment = require('../model/comments')
const { verifyObjectId } = require('../utils/mongoose')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')

const comments = async (req, res, next) => {
  const userId = req.user._id
  const { postId, content } = req.body

  if (!verifyObjectId(postId)) return next(ApiError.badRequest(400, '貼文 id 格式錯誤'))
  if (!postId || !content) return next(ApiError.badRequest(400, '請輸入完整資料'))

  const commentResData = await Comment.create({
    user: userId,
    post: postId,
    content
  })

  if (!commentResData.post) return next(ApiError.badRequest(400, '留言失敗，請重試'))
  const userData = await User.findById(commentResData.user)

  successResponse({
    res,
    statusCode: 201,
    message: '留言成功',
    data: {
      comment: {
        postId: commentResData.post,
        createdAt: commentResData.createdAt,
        content: commentResData.content,
        user: {
          id: userData._id,
          avatar: userData.avatar,
          nickname: userData.nickname
        }
      }
    }
  })
}

const getComments = async (req, res, next) => {
  const { postId } = req.params
  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(400, '貼文 id 不正確'))

  const resData = await Post.findById(postId).select('-likes')
    .populate({
      path: 'user',
      ref: 'User',
      select: 'avatar nickname'
    })
    .populate({
      path: 'comments',
      ref: 'Comment',
      select: 'user content createdAt',
      populate: {
        path: 'user',
        ref: 'User',
        select: 'nickname avatar'
      }
    })

  successResponse({
    res,
    data: resData
  })
}

module.exports = { comments, getComments }
