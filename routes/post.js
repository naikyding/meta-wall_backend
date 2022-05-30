const { Router } = require('express')
const router = Router()
const { apiCatch } = require('../utils/errorHandle')
const { auth } = require('../utils/auth')
const {
  creatPost, deletePost, updatePost, getUserPost,
  getPostsLikes, getPostsComments
} = require('../controller/post')
const postFiles = require('../utils/formFiles')

router.get('/:id', auth, apiCatch(getUserPost))

router.post('/', auth, postFiles, apiCatch(creatPost))

router.delete('/:id', auth, apiCatch(deletePost))

router.patch('/:id', auth, postFiles, apiCatch(updatePost))

router.get('/likes/:postId', auth, apiCatch(getPostsLikes))

router.get('/comments/:postId', auth, apiCatch(getPostsComments))

module.exports = router
