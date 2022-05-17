const { isValidObjectId } = require('mongoose')

const verifyObjectId = (objectId) => isValidObjectId(objectId)

module.exports = {
  verifyObjectId
}
