const { Router } = require('express')
const router = Router()

const likesRoutes = require('./likes')
const userRoutes = require('./user')
const authRoutes = require('./auth')
const commentsRoutes = require('./comments')
const followsRoutes = require('./follows')
const postRoutes = require('./post')
const postsRoutes = require('./posts')
const indexRoutes = require('./main')
const payment = require('./payment')

const routes = [
  {
    path: '/',
    router: indexRoutes
  },
  {
    path: '/likes',
    router: likesRoutes
  },
  {
    path: '/user',
    router: userRoutes
  },
  {
    path: '/auth',
    router: authRoutes
  },
  {
    path: '/comments',
    router: commentsRoutes
  },
  {
    path: '/follows',
    router: followsRoutes
  },
  {
    path: '/post',
    router: postRoutes
  },
  {
    path: '/posts',
    router: postsRoutes
  },
  {
    path: '/payment',
    router: payment
  }
]

routes.forEach(routerItem => {
  router.use(routerItem.path, routerItem.router)
})

module.exports = router
