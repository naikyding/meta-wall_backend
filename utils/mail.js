const nodemailer = require('nodemailer')

const { google } = require('googleapis')
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  `${process.env.APP_DOMAIN}login`
)
oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })

const mail = async (mailAddress, userName, redirectUrl) => {
  const accessToken = await oauth2Client.getAccessToken()

  const transporter = await nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_ACCOUNT,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken
    }
  })

  const info = await transporter.sendMail({
    from: '"MetaWall 👻" <meta_service@metawall.com>', // sender address
    to: mailAddress, // list of receivers
    subject: 'MetaWall【會員密碼重置確認信】', // Subject line
    html: `
    <div style="padding:0px;margin:0px;font-family:SF Pro TC,SF Pro Display,SF Pro Icons,PingFang TC,Noto Sans TC,LiHei Pro,Microsoft JhengHei,Microsoft YaHei,Open Sans,Helvetica Neue,Helvetica,sans-serif;font-size:16px; width: 100%; height: 100%; color:#999">
      <div style="text-align: center; background:#faf9f2;margin:0px;padding-top:40px;padding-bottom:40px;padding-right:20px;padding-left:20px;font-size:15px;line-height:1.7; width: 100%;">
        <div style="max-width:660px; background: white; padding: 16px; text-align: left;">
          <img src="https://i.imgur.com/Lw43fgR.png" style="display: block;" width="150px"/>
          <p>${userName} 你好！</p>
          <p>
          我們已經收到您重新設定密碼的需求，請直接點選下方連結完成步驟。
          </p>
          <p>
            <a href="${redirectUrl}">
            按此認證，重設密碼
            </a>
            為確保會員資料安全性，重設密碼的連結將於此信件寄出後 <strong>15 分鐘內</strong> 或重設密碼後失效。
          </p>
          <p>＊此信件為系統發出信件，請勿直接回覆，感謝您的配合。＊</p>
          <br/>
          <p>MetaWall 團隊</p>
        </div>
      </div>
    </div>` // plain text body
  })

  return info
}

module.exports = mail
