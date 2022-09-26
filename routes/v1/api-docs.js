const isDev = process.env.NODE_ENV === 'dev'

const docs = () => ({
  swagger: '2.0',

  info: {
    title: 'MetaWall APIs',
    description: '這是 MetaWall API 的說明文件',
    version: 'v1.0.0'
  },

  host: isDev ? 'localhost:3000' : process.env.NODE_APP_DOMAIN,
  basePath: '/v1',
  schemes: [isDev ? 'http' : 'https'],
  consumes: ['application/json'],

  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: '使用者登入',
        description: '使用者登入 api 說明',
        parameters: [
          {
            name: 'Body',
            in: 'body',
            description: '使用者登入資料',
            schema: {
              $ref: '#/definitions/UserSignIn'
            },
            required: true
          }
        ],
        responses: {
          200: {
            description: '登入成功',
            schema: {
              $ref: '#/definitions/UserLoginData'
            }
          },
          401: {
            description: '登入失敗'
          }
        }
      }
    }

  },

  // 建立 model schema
  definitions: {
    // 使用者登入資料
    UserSignIn: {
      type: 'object',
      properties: {
        email: {
          description: '使用者 email',
          type: 'string'
        },
        password: {
          description: '使用者密碼',
          type: 'string'
        }
      },
      // 必頁項目
      required: ['email', 'password']
    },

    // 使用者登入成功資料
    UserLoginData: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean',
          description: '響應狀態'
        },
        message: {
          type: 'string',
          description: '響應信息'
        },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: '使用者 ID'
                },
                nickname: {
                  type: 'string',
                  description: '使用者綽號'
                },
                avatar: {
                  type: 'string',
                  description: '使用者頭像'
                },
                tokenType: {
                  type: 'string',
                  description: '使用者 token 型式'
                },
                token: {
                  type: 'string',
                  description: '使用者 token'
                }
              }

            }
          }

        }
      }
    }
  }
})

module.exports = docs()
