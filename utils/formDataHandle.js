const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

const passFileToBodyByFormData = (fileName) => upload.single(fileName)

module.exports = { passFileToBodyByFormData }
