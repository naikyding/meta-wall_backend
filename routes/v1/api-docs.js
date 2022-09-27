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
  basePath: '/v1', // API url 前輟
  schemes: [isDev ? 'http' : 'https'], // 請求方式
  consumes: ['application/json'], // 請求格式

  // 請求路由
  paths: {
    // 驗證 token
    '/auth/check_token': {
      get: {
        tags: ['Auth'],
        summary: 'Token 驗證',
        description: '使用者 JWT  token 驗證',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: 'JWT Token',
            required: true
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          403: {
            description: 'Forbidden'
          }
        }
      }
    },

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
    },

    // 註冊
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: '註冊',
        description: '使用者註冊帳號',
        parameters: [
          {
            name: 'Body',
            in: 'body',
            schema: {
              $ref: '#/definitions/UserRegister'
            },
            required: true
          }
        ],
        responses: {
          201: {
            description: '註冊成功',
            schema: {
              $ref: '#/definitions/UserRegisterSuccessData'
            }
          },
          401: {
            description: '註冊失敗'
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
    },

    // 使用者註冊資料
    UserRegister: {
      type: 'object',
      properties: {
        nickname: {
          type: 'string',
          description: '綽號'
        },
        email: {
          type: 'string',
          description: 'email'
        },
        password: {
          type: 'string',
          description: '密碼'
        },
        passwordConfirm: {
          type: 'string',
          description: '密碼確認'
        }
      },
      required: ['nickname', 'email', 'password', 'passwordConfirm']
    },

    // 註冊成功
    UserRegisterSuccessData: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean'
        },
        message: {
          type: 'string'
        },
        data: {
          type: 'object',
          properties: {
            nickname: {
              type: 'string'
            },
            email: {
              type: 'string'
            }
          }
        }
      }
    }
  }
})

module.exports = docs()
