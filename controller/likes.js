const User = require('../model/user')
const Post = require('../model/post')

const { successResponse } = require('../utils/responseHandle')
const { ApiError } = require('../utils/errorHandle')
const { verifyObjectId } = require('../utils/mongoose')

const toggleLikes = async (req, res, next) => {
  const { _id } = req.user
  const { postId } = req.body
  const errorMessage = [400, '貼文 id 錯誤']
  let resData = {}

  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(...errorMessage))

  const [alwaysLikesPost] = await User.find({ id: _id, likes: { $in: [postId] } })

  if (!alwaysLikesPost) {
    resData = await User.findByIdAndUpdate(_id, { $push: { likes: postId } }, { new: true }).select('likes')
    await Post.findByIdAndUpdate(postId, { $push: { likes: _id } }, { new: true }).select('likes')
  } else {
    resData = await User.findByIdAndUpdate(_id, { $pull: { likes: postId } }, { new: true }).select('likes')
    await Post.findByIdAndUpdate(postId, { $pull: { likes: _id } }, { new: true }).select('likes')
  }

  successResponse({
    res,
    data: { likes: resData.likes }
  })
}

const userLikes = async (req, res, next) => {
  const { _id } = req.user
  const { likes } = await User.findById(_id)
    .populate({
      path: 'likes',
      select: '-updatedAt',

      // 第二層填充
      populate: {
        path: 'user',
        select: 'nickname avatar'
      }
    }).select('likes')

  successResponse({
    res,
    data: likes
  })
}

module.exports = { toggleLikes, userLikes }
