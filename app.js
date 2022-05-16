const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { errorHandle } = require('./utils/errorHandle')
require('dotenv').config()
const metaWallConnect = require('./db/metaWall')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')

metaWallConnect()

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/auth', authRouter)

// Error Handle
app.use((req, res) => res.status(404).send('Not Found'))
app.use(errorHandle)

process.on('unhandledRejection', (error) => {
  console.log('--------------- unhandledRejection (start) -------------------')
  console.log(error)
  console.log('--------------- unhandledRejection (end) -------------------')
})

module.exports = app
