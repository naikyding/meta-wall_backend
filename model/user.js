const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  nickname: {
    type: String,
    required: [true, '請輸入暱稱']
  },
  email: {
    type: String,
    require: [true, '請輸入電子信箱']
  },
  password: {
    type: String,
    required: [true, '請輸入密碼'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
}, {
  versionKey: false
})

const User = mongoose.model('User', userSchema)

module.exports = User
