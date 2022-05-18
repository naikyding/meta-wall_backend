const { Router } = require('express')
const router = Router()

const { apiCatch } = require('../utils/errorHandle')
const { auth } = require('../utils/auth')
const { creatPost, deletePost, updatePost } = require('../controller/post')
const { passFileToBodyByFormData } = require('../utils/formDataHandle')

router.post('/', apiCatch(passFileToBodyByFormData('image', 'post /')), auth, apiCatch(creatPost))

router.delete('/:id', auth, apiCatch(deletePost))

router.patch('/:id', apiCatch(passFileToBodyByFormData('image', 'patch post')), auth, apiCatch(updatePost))

module.exports = router
