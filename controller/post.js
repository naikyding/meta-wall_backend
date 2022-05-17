const Post = require('../model/post')
const User = require('../model/user')
const { ApiError } = require('../utils/errorHandle')
const { successResponse } = require('../utils/responseHandle')
const uploadImgToImgUr = require('../utils/uploadImg')
const { verifyObjectId } = require('../utils/mongoose')

const creatPost = async (req, res, next) => {
  const post = {}
  const { content } = req.body
  const id = req.user._id
  if (!content) return next(ApiError.badRequest(undefined, '請輸入貼文內容'))

  // 如果有上傳圖片
  const uploadFile = req.file
  if (uploadFile) {
    const uploadImgBuffer = uploadFile.buffer
    const { data } = await uploadImgToImgUr(uploadImgBuffer)
    post.image = data.data.link
  }

  post.content = content
  post.user = id

  const { _id } = await Post.create(post)
  const { posts } = await User.findByIdAndUpdate(id, { $push: { posts: _id } }, { new: true }).select('posts')
  if (!posts.includes(_id)) return next(ApiError.badRequest(undefined, '新增失敗，請重試'))

  setTimeout(() => {
    successResponse({
      res,
      message: '新增成功',
      data: { postId: _id }
    })
  }, 300)
}

const deletePost = async (req, res, next) => {
  const errorHandle = () => next(ApiError.badRequest(undefined, '刪除失敗，請確認貼文 id'))

  const postId = req.params.id
  if (!postId || !verifyObjectId(postId)) return errorHandle()

  const deletePost = await Post.findByIdAndDelete(postId)
  if (!deletePost) return errorHandle()

  successResponse({
    res,
    message: '刪除成功'
  })
}

const updatePost = async (req, res, next) => {
  const postUpdateData = {}
  const postId = req.params.id
  const { content } = req.body

  if (!postId || !verifyObjectId(postId)) return next(ApiError.badRequest(undefined, '貼文 id 錯誤'))
  if (!content) return next(ApiError.badRequest(undefined, '貼文內容必填'))

  if (req.file) {
    const imgBuffer = req.file.buffer
    const { data } = await uploadImgToImgUr(imgBuffer)
    postUpdateData.image = data.data.link
  }

  postUpdateData.content = content

  const updateStatus = await Post.findByIdAndUpdate(postId, postUpdateData, { new: true }).select('_id')
  if (!updateStatus) return next(ApiError.badRequest(undefined, '修改失敗'))

  successResponse({
    res,
    message: '修改成功'
  })
}
module.exports = { creatPost, deletePost, updatePost }
