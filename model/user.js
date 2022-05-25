const mongoose = require('mongoose')
const { Schema } = mongoose
const { isEmail } = require('validator')
const Post = require('./post')

const followsUser = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const userSchema = new Schema({
  nickname: {
    type: String,
    required: [true, '請輸入暱稱']
  },
  email: {
    type: String,
    require: [true, '請輸入電子信箱'],
    validate: {
      validator (email) {
        return isEmail(email)
      },
      message: props => `${props.value} 不是正確的電子信箱格式`
    }
  },
  password: {
    type: String,
    minlength: [8, '密碼至少 8 碼'],
    required: [true, '請輸入密碼'],
    select: false
  },
  avatar: {
    type: String,
    default: 'https://i.imgur.com/KPIA6Zi.png'
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '性別設置，不符合規範。'
    }
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // 追蹤他人
  follows: [followsUser],
  // 被追蹤
  follower: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: false,
    updatedAt: true
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
