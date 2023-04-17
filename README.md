# feishu-authentication
飞书鉴权node版本，以便后续web应用调用JSAPI

1、使用 App ID 和 App Secret 获取 tenant_access_token
调用 https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal

2、使用 tenant_access_token 获取 jsapi_ticket
调用 https://open.feishu.cn/open-apis/jssdk/ticket/get

3、使用jsapi_ticket、随机字符串、当前时间戳、当前鉴权的网页URL 生成签名signature。

替换index.js中的 APP_ID和APP_SECRET

npm install
npm run start