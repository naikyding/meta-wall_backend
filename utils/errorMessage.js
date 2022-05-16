const errorGeneralMessage = {
  401: '授權驗証失敗',
  403: '無訪問權限',
  404: '找不到請求資源',
  'jwt malformed': 'Token 格式錯誤',
  'jwt expired': 'Token 過期',
  'invalid token': 'Token 無效',
  'Unexpected end of JSON input': '輸入格式有誤!',
  SyntaxError: '輸入格式錯誤!'
}

module.exports = errorGeneralMessage
