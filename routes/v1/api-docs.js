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
    },

    '/likes': {
      get: {
        tags: ['Likes'],
        summary: '取得最愛列表',
        parameters: [
          {
            name: 'Authorization',
            description: 'JWT Token',
            in: 'header'
          }
        ],
        responses: {
          200: {
            description: '操作成功',
            schema: {
              $ref: '#/definitions/UserLikesList'
            }
          },
          403: {
            description: '驗證失敗，請重新登入'
          }
        }
      },
      post: {
        tags: ['Likes'],
        summary: '加入/移除 最愛',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: 'JWT Token'
          },
          {
            in: 'body',
            name: 'Body',
            schema: {
              $ref: '#/definitions/TogglerLikesItem'
            }
          }
        ],
        responses: {
          200: {
            description: '按讚成功 / 移除按讚'
          },
          400: {
            description: '失敗'
          }
        }
      }
    },

    '/user/': {
      get: {
        tags: ['User'],
        summary: '取得使用者資料',
        parameters: [
          {
            name: 'authorization',
            in: 'header',
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Token 無效'
          }
        }
      },
      patch: {
        tags: ['User'],
        summary: '修改使用者資料',
        parameters: [
          {
            name: 'authorization',
            in: 'header',
            type: 'string'
          },
          {
            in: 'formData',
            name: 'avatar',
            description: '頭像',
            type: 'file'
          },
          {
            in: 'formData',
            name: 'nickname',
            description: '暱稱',
            type: 'string'
          },
          {
            in: 'formData',
            name: 'gender',
            description: '性別',
            type: 'string',
            enum: ['male', 'female']
          }
        ],
        responses: {
          200: {
            description: '修改成功'
          },
          400: {
            description: '失敗'
          },
          403: {
            description: '驗證失敗，請重新登入'
          }
        }
      }
    },
    '/user/update_password': {
      patch: {
        tags: ['User'],
        summary: '修改使用者密碼',
        parameters: [
          {
            name: 'authorization',
            in: 'header',
            type: 'string'
          },
          {
            name: 'Body',
            in: 'body',
            schema: {
              $ref: '#/definitions/UserPasswordUpdate'
            }
          }
        ],
        responses: {
          200: {
            description: '密碼更新成功'
          },
          400: {
            description: '修改失敗'
          }
        }
      }
    },

    '/follows/': {
      get: {
        tags: ['Follows'],
        summary: '取得 (個人) 追蹤名單',
        parameters: [
          {
            name: 'authorization',
            in: 'header',
            type: 'string',
            required: true
          }
        ],
        responses: {
          200: {
            description: '操作成功',
            schema: {
              $ref: '#/definitions/UserFollowsData'
            }
          },
          401: {
            description: 'Token 無效'
          }
        }
      },
      post: {
        tags: ['Follows'],
        summary: '追蹤使用者 toggle',
        parameters: [
          {
            name: 'authorization',
            required: true,
            in: 'header',
            type: 'string'
          },
          {
            name: '追蹤者 id',
            required: true,
            in: 'body',
            type: 'object',
            schema: {
              $ref: '#/definitions/FollowerData'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          400: {
            description: '失敗'
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
      // 必填項目
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
                  description: '使用者暱稱',
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
          description: '暱稱'
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
    },

    // 取得喜愛列表
    UserLikesList: {
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
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                description: '文章 id'
              },
              content: {
                type: 'string',
                description: '文章內容'
              },
              image: {
                type: 'string',
                description: '文章圖片'
              },
              user: {
                type: 'object',
                description: '發文者資料',
                properties: {
                  _id: {
                    type: 'string',
                    description: '發文者 id'
                  },
                  nickname: {
                    type: 'string',
                    description: '發文者暱稱'
                  },
                  avatar: {
                    type: 'string',
                    description: '文章頭像'
                  }
                }
              },
              likes: {
                type: 'array',
                description: '文章喜愛者資料',
                items: {
                  type: 'string',
                  description: '發文者 id'
                }
              },
              createdAt: {
                type: 'string',
                description: '貼文時間'
              },
              comments: {
                type: 'array',
                description: '留言資料',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      description: '留言 id'
                    },
                    user: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          description: '留言者 id'
                        },
                        nickname: {
                          type: 'string',
                          description: '留言者暱稱'
                        },
                        avatar: {
                          type: 'string',
                          description: '留言者頭像'
                        }
                      }
                    },
                    post: {
                      type: 'string',
                      description: '留言文章 id'
                    },
                    content: {
                      type: 'string',
                      description: '留言內容'
                    },
                    createdAt: {
                      type: 'string',
                      description: '留言時間'
                    },
                    updatedAt: {
                      type: 'string',
                      description: '留言更新時間'
                    }
                  }
                }
              },
              id: {
                type: 'string',
                description: '留言文章 id'
              }
            }
          }
        }
      }
    },

    TogglerLikesItem: {
      type: 'object',
      properties: {
        postId: {
          type: 'string'
        }
      }
    },

    UserPasswordUpdate: {
      type: 'object',
      properties: {
        password: {
          type: 'string'
        },
        passwordConfirm: {
          type: 'string'
        }
      },
      required: ['password', 'passwordConfirm']
    },

    UserFollowsData: {
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
            follows: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'object',
                    description: '追蹤者資料',
                    properties: {
                      _id: {
                        type: 'string',
                        description: '追蹤者 id'
                      },
                      nickname: {
                        type: 'string',
                        description: '追蹤者眶稱'
                      },
                      avatar: {
                        type: 'string',
                        description: '追蹤者頭像'
                      }
                    }
                  },
                  _id: {
                    type: 'string',
                    description: '追蹤項目 id'
                  },
                  createdAt: {
                    type: 'string',
                    description: '追蹤時間'
                  }
                }
              }
            }
          }
        }
      }
    },

    FollowerData: {
      type: 'object',
      properties: {
        followUserId: {
          description: '追蹤者 id',
          type: 'string'
        }
      }
    }
  }
})

module.exports = docs()
