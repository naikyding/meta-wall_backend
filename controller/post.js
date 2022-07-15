const Post = require('../model/post')
const User = require('../model/user')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')
const uploadImg = require('../utils/uploadImageToImgur')
const { verifyObjectId } = require('../utils/mongoose')

const getUserPost = async (req, res, next) => {
  const { q: query, s: sort } = req.query
  const keyword = new RegExp(query)
  const createdAtSort = (sort === 'o') ? 1 : -1 // o: 舊到新

  const { id } = req.params
  if (!id) return next(ApiError.badRequest(undefined, '請帶入使用者 id'))
  if (!verifyObjectId(id)) return next(ApiError.badRequest(undefined, '使用者 id 錯誤'))

  const resData = await User.findById(id)
    .populate({
      path: 'posts',
      match: { content: keyword },
      options: {
        sort: { createdAt: createdAtSort }
      },
      populate: {
        path: 'comments',
        select: 'user'
      }
    }).select('-gender -updatedAt -email')

  successResponse({
    res,
    data: resData
  })
}

const createPost = async (req, res, next) => {
  const post = {}
  const { content } = req.body
  const id = req.user._id
  if (!content) return next(ApiError.badRequest(400, '請輸入貼文內容'))

  // 如果有上傳圖片
  const uploadFile = req.files[0]
  if (uploadFile) {
    const uploadImgBuffer = uploadFile.buffer
    const { data } = await uploadImg(uploadImgBuffer)
    post.image = data.link
  }

  post.content = content.trim()
  post.user = id

  const { _id } = await Post.create(post)
  const { posts } = await User.findByIdAndUpdate(id, { $push: { posts: _id } }, { new: true }).select('posts')
  if (!posts.includes(_id)) return next(ApiError.badRequest(400, '新增失敗，請重試'))

  successResponse({
    res,
    message: '新增成功',
    data: { postId: _id }
  })
}

const deletePost = async (req, res, next) => {
  const errorHandle = () => next(ApiError.badRequest(400, '刪除失敗，請確認貼文 id'))
  const postId = req.params.id

  if (!postId || !verifyObjectId(postId)) return errorHandle()

  // 刪除文章
  const deletePost = await Post.findByIdAndDelete(postId)
  if (!deletePost) return errorHandle()

  // 刪除 user.posts
  await User.findOneAndUpdate({
    posts: { $in: postId }
  }, {
    $pull: { posts: postId }
  }, { new: true })

  // 刪除 user.likes
  await User.updateMany({
    likes: { $in: postId }
  }, {
    $pull: { likes: postId }
  }, { new: true })

  successResponse({
    res,
    message: '刪除成功'
  })
}

const updatePost = async (req, res, next) => {
  const postUpdateData = {}
  const postId = req.params.id
  const { content } = req.body

  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(400, '貼文 id 錯誤'))
  if (!content) return next(ApiError.badRequest(400, '貼文內容必填'))

  // 如果有上傳圖片
  const uploadFile = req.files[0]
  if (uploadFile) {
    const uploadImgBuffer = uploadFile.buffer
    const { data } = await uploadImg(uploadImgBuffer)
    postUpdateData.image = data.link
  }

  postUpdateData.content = content.trim()

  const updateStatus = await Post.findByIdAndUpdate(postId, postUpdateData, { new: true }).select('_id')
  if (!updateStatus) return next(ApiError.badRequest(400, '修改失敗'))

  successResponse({
    res,
    message: '修改成功'
  })
}

const getPostsLikes = async (req, res, next) => {
  const postId = req.params.postId
  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(400, '貼文 id 錯誤'))

  const likesList = await Post.findById(postId).populate({
    path: 'likes',
    ref: 'User',
    select: 'nickname avatar follows',
    populate: {
      path: 'follows.userId',
      ref: 'User',
      select: 'nickname avatar'
    }
  }).select('-comments -updatedAt')

  if (!likesList) return next(ApiError.badRequest(400, '發生錯誤，請重試'))

  successResponse({
    res,
    message: 'LIKES',
    data: likesList
  })
}

const getPostsComments = async (req, res, next) => {
  const postId = req.params.postId
  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(400, '貼文 id 錯誤'))

  const commentsList = await Post.findById(postId).select('-likes')
    .populate({
      path: 'comments',
      select: 'createdAt user content',
      populate: {
        path: 'user',
        ref: 'User',
        select: 'nickname avatar'
      }
    })

  successResponse({
    res,
    data: commentsList
  })
}

const postLikes = async (req, res, next) => {
  const postId = req.params.postId
  const userId = req.user._id
  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(400, '貼文 id 錯誤'))
  const inPost = await Post.findById(postId)
  if (!inPost) return next(ApiError.badRequest(400, '貼文 id 不存在!'))

  const newPostStatus = await Post.findByIdAndUpdate(postId, {
    $addToSet: {
      likes: userId
    }
  }, { new: true })

  const newUserStatus = await User.findByIdAndUpdate(userId, {
    $addToSet: {
      likes: newPostStatus._id
    }
  }, { new: true })

  successResponse({
    res,
    message: '已按讚貼文',
    data: {
      user: {
        likes: newUserStatus.likes
      }
    }
  })
}

const unPostLikes = async (req, res, next) => {
  const postId = req.params.postId
  const userId = req.user._id
  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(400, '貼文 id 錯誤'))
  const inPost = await Post.findById(postId)
  if (!inPost) return next(ApiError.badRequest(400, '貼文 id 不存在!'))
  const isIncludesLikes = await User.findOne({ _id: userId, likes: { $in: [postId] } })
  if (!isIncludesLikes) return next(ApiError.badRequest(400, '貼文本來就不存在按讚列表'))

  const newPostStatus = await Post.findByIdAndUpdate(postId, {
    $pull: {
      likes: userId
    }
  }, { new: true })

  const newUserStatus = await User.findByIdAndUpdate(userId, {
    $pull: {
      likes: newPostStatus._id
    }
  }, { new: true })

  successResponse({
    res,
    message: '貼文已移除按讚',
    data: {
      user: {
        likes: newUserStatus.likes
      }
    }
  })
}

module.exports = {
  createPost,
  deletePost,
  updatePost,
  getUserPost,
  getPostsLikes,
  getPostsComments,
  postLikes,
  unPostLikes
}
