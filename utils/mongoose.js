const { isObjectIdOrHexString } = require('mongoose')

const verifyObjectId = (objectId) => isObjectIdOrHexString(objectId)

module.exports = {
  verifyObjectId
}
