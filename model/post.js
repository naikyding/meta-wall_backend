const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
  content: {
    type: String,
    required: [true, '必須要有貼文內容哦。']
  },
  image: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: {
    type: Array,
    default: []
  },
  comments: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: false,
    updatedAt: true
  }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
