const mongoose = require('mongoose')
const { Schema } = mongoose
const { isEmail } = require('validator')

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
    default: 'default Img'
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '性別設置，不符合規範。'
    }
  },
  posts: {
    type: Array,
    default: []
  },
  likes: {
    type: Array,
    default: []
  },
  follows: {
    type: Array,
    default: []
  },
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
