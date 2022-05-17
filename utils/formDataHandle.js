const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

const passFileToBodyByFormData = (fileName, text) => {
  console.log(`------- passFileToBodyByFormData middleware ----${text}-----`)
  return upload.single(fileName)
}

module.exports = { passFileToBodyByFormData }
