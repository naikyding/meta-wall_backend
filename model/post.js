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
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // comments: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Comment'
  // }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: false,
    updatedAt: true
  },
  toJSON: { virtuals: true }, // for res.json
  toObject: { virtuals: true } // for console.log
})

postSchema.virtual('comments', {
  ref: 'Comment', // 資源來自
  foreignField: 'post', // 外部屬性
  localField: '_id' // 本地對應
})

// 若要自動帶入的話開啟
// postSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'comments',
//     ref: 'Comment',
//     select: '-updatedAt -post',
//     populate: {
//       path: 'user',
//       ref: 'User',
//       select: 'nickname avatar'
//     }
//   })
//   next()
// })

const Post = mongoose.model('Post', postSchema)

module.exports = Post
