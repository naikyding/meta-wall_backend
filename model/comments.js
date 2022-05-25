const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '請輸入評論者 id']
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, '請填入貼文 id']
  },
  content: {
    type: String,
    required: [true, '請填入貼文內容']
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

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
