const User = require('../model/user')

const { isValidObjectId } = require('mongoose')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')

const followsToggle = async (req, res, next) => {
  const { followUserId } = req.body
  const { _id } = req.user

  if (!followUserId) return next(ApiError.badRequest(400, '請輸入使用者 id'))
  if (!isValidObjectId(followUserId)) return next(ApiError.badRequest(400, '使用者 id 錯誤'))
  if (followUserId === _id) return next(ApiError.badRequest(400, '無法追蹤自已'))
  if (!await User.findById(followUserId)) return next(ApiError.badRequest(400, '這個使用者 id 不存在'))

  // 是否已經追蹤
  const followsIncludes = await User.findOne({
    _id,
    'follows.userId': followUserId
  }).select('follows')

  let msg = ''
  let resData = {}
  let followerData = {}

  // 已經追蹤
  if (followsIncludes) {
    // 儲存本身
    resData = await User.findByIdAndUpdate(_id, {
      $pull: { follows: { userId: followUserId } }
    }, { new: true }).select('follows')

    // 被追蹤都儲存
    followerData = await User.findByIdAndUpdate(followUserId, { $pull: { follower: _id } }, { new: true }).select('follower')

    // eslint-disable-next-line eqeqeq
    const followsUserIncludes = resData.follows.find(item => item.userId == followUserId)
    const followerUserIncludes = followerData.follower.includes(_id)
    if (followsUserIncludes && followerUserIncludes) return next(ApiError.badRequest(400, '加入追蹤，發生錯誤'))

    msg = '已移除追蹤'
  } else {
    // 尚未追蹤
    resData = await User.findByIdAndUpdate(_id, {
      $push: { follows: { userId: followUserId } }
    }, { new: true }).select('follows')

    followerData = await User.findByIdAndUpdate(followUserId, { $push: { follower: _id } }, { new: true }).select('follower')
    // eslint-disable-next-line eqeqeq
    const followsUserIncludes = resData.follows.find(item => item.userId == followUserId)
    const followerUserIncludes = followerData.follower.includes(_id)
    if (!followsUserIncludes && !followerUserIncludes) return next(ApiError.badRequest(400, '加入追蹤，發生錯誤'))

    msg = '已新增追蹤'
  }

  successResponse({
    res,
    message: msg,
    data: { follows: resData.follows }
  })
}

const getFollows = async (req, res, next) => {
  const { _id } = req.user
  const { follows } = await User.findById(_id).populate({
    path: 'follows',
    populate: {
      path: 'userId',
      ref: 'User',
      select: 'nickname avatar'
    }
  }).select('follows')

  successResponse({
    res,
    data: { follows }
  })
}

module.exports = { followsToggle, getFollows }
