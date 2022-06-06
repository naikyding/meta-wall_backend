const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { errorHandle } = require('./utils/errorHandle')
require('dotenv').config()
const metaWallConnect = require('./db/metaWall')
const cors = require('cors')
require('./utils/passports')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')
const likesRouter = require('./routes/likes')
const followsRouter = require('./routes/follows')
const commentsRouter = require('./routes/comments.js')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

metaWallConnect()

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/posts', postsRouter)
app.use('/likes', likesRouter)
app.use('/follows', followsRouter)
app.use('/comments', commentsRouter)

// Error Handle
app.use((req, res) => res.status(404).send('Not Found'))
app.use(errorHandle)

process.on('uncaughtException', (error) => {
  console.log('--------------- uncaughtException (start) -------------------')
  console.log(error)
  console.log('--------------- uncaughtException (end) -------------------')
})

process.on('unhandledRejection', (error) => {
  console.log('--------------- unhandledRejection (start) -------------------')
  console.log(error)
  console.log('--------------- unhandledRejection (end) -------------------')
})

module.exports = app
