const isDev = process.env.NODE_ENV === 'dev'

const docs = () => ({
  swagger: '2.0', // swagger 版本

  // 說明區塊
  info: {
    title: 'MetaWall APIs', // 標題
    description: '這是 MetaWall API 的說明文件', // 說明
    version: 'v1.0.0' // 版號
  },

  host: isDev ? 'localhost:3000' : 'metawall-evo.herokuapp.com', // api url
  basePath: '/v1', // 基礎路由
  schemes: [isDev ? 'http' : 'https'], // 請求方式
  consumes: ['application/json'], // 請求格式

  // 請求路由
  paths: {
    '/auth/login': { // 請求 router
      post: { // 方法
        tags: ['Auth'], // 分類
        summary: '使用者登入', // 標題
        description: '使用者登入 api 說明', // 說明
        // 請求內容
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
              $ref: '#/definitions/UserLoginDataSuccess'
            }
          },
          401: {
            description: '登入失敗',
            schema: {
              $ref: '#/definitions/UserLoginDataFail'
            }
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

    // [成功] 使用者登入資料
    UserLoginDataSuccess: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean',
          description: '響應狀態',
          example: true
        },
        message: {
          type: 'string',
          description: '響應信息',
          example: '登入成功'
        },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: '使用者 ID',
                  example: '62957cfbf65a99fee3593xxx'
                },
                nickname: {
                  type: 'string',
                  description: '使用者綽號',
                  example: 'Dev'
                },
                avatar: {
                  type: 'string',
                  description: '使用者頭像',
                  example: 'https://i.imgur.com/ynrKsDu.jpg'
                },
                tokenType: {
                  type: 'string',
                  description: '使用者 token 型式',
                  example: 'Bearer '
                },
                token: {
                  type: 'string',
                  description: '使用者 token',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjk1N2NmYmY2NWE5OWZlZTM1OTNmZjQiLCJuaWNrbmFtZSI6IkRFViIsImF2YXRhciI6Imh0dHBzOi8vaS5pbWd1ci5jb20veW5yS3NEdS5qcGciLCJpYXQiOjE2NjQxODMxNDEsImV4cCI6MTY2NDc4Nzk0MX0.SUcGIITbsbaCDhke-KeFwBNGVlhagV6mlMeJGZ1Ad3c'
                }
              }

            }
          }

        }
      }
    },

    // [失敗] 使用者登入資料
    UserLoginDataFail: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean',
          description: '響應狀態',
          example: false
        },
        message: {
          type: 'string',
          description: '響應信息',
          example: '電子信箱或密碼錯誤。'
        }
      }
    }
  }
})

module.exports = docs()
