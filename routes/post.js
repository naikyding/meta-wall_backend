const { Router } = require('express')
const router = Router()

const { apiCatch } = require('../utils/errorHandle')
const { auth } = require('../utils/auth')
const { creatPost, deletePost, updatePost } = require('../controller/post')
const { passFileToBodyByFormData } = require('../utils/formDataHandle')

router.post('/', auth, apiCatch(passFileToBodyByFormData('image')), apiCatch(creatPost))

router.delete('/:id', auth, apiCatch(deletePost))

router.patch('/:id', apiCatch(passFileToBodyByFormData('image')), auth, apiCatch(updatePost))

module.exports = router
