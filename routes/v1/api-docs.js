const docs = () => ({
  swagger: '2.0',

  info: {
    title: 'MetaWall APIs',
    description: '這是 MetaWall API 的說明文件',
    version: 'v1.0.0'
  },

  host: process.env.NODE_ENV === 'dev'
    ? 'localhost:3000'
    : process.env.NODE_APP_DOMAIN,
  basePath: '/v1',
  schemes: ['http', 'https'],

  consumes: ['application/json'],
  produces: ['application/json']
})

module.exports = docs()
