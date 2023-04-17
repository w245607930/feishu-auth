const express = require('express')
const cors = require('cors')
var APP_ID = 'YOUR APP_ID'
var APP_SECRET = 'YOUR APP_SECRET'
var axios = require('axios')
var sha1 = require('js-sha1');
var app = express()
app.use(cors({
    origin: true,
    methods: '*',
    credentials: true
}));
const PORT = 3000

async function getTenantAccessToken(){
    const config = {
        method: 'POST',
        url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            app_id: APP_ID,
            app_secret: APP_SECRET
        }
    }

    try {
        const response = await axios(config)
        // console.log(response.data)
        if(response.data.code!==0){
            return response.data.msg;
        }
        return response.data.tenant_access_token
    }catch (e){
        console.log(e, '==================================error==============')
        return 'ERROR'
    }
}


async function getTicket() {
    const tenant_access_token = await getTenantAccessToken()
    console.log(tenant_access_token, 'tenant_access_token')

    const config = {
        method: 'POST',
        url: 'https://open.feishu.cn/open-apis/jssdk/ticket/get',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${tenant_access_token}`
        }
    }

    try {
        const response = await axios(config)
        console.log(response.data.data.ticket, 'ticket')
        if(response.data.code!==0){
            return response.data.msg;
        }
        return response.data.data.ticket
    }catch (e){
        console.log(e, '==================================error==============')
        return 'ERROR'
    }
}

async function getNonceStr(e) {  // e代表生成的字符个数
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789",
        a = t.length,
        noncestr = "";
    for (let i = 0; i < e; i++) noncestr += t.charAt(Math.floor(Math.random() * a));
    return noncestr;
}

async function sign(url){
    var ticket = await getTicket()
    let timeStamp = (new Date()).getTime();
    let jsticket = ticket;
    let nonceStr = await getNonceStr();
    url = decodeURIComponent(url)
    console.log(url, '***************************************decode url****************************')
    let verifyStr = `jsapi_ticket=${jsticket}&noncestr=${nonceStr}&timestamp=${timeStamp}&url=${url}`;
    //签名
    let signature = sha1(verifyStr);
    console.log(ticket, '********ticket*************')
    console.log(timeStamp, '********timeStamp********')
    console.log(nonceStr,'********nonceStr********')
    console.log(verifyStr, '********verifyStr********')
    console.log(signature, '********signature********')
    return {
        appId: APP_ID,
        timestamp: timeStamp,
        nonceStr: nonceStr,
        signature: signature
    }
}

app.get('/getSign', async (req, res) => {
    console.log(req.query.url, '***********************url*********************');
    if(!req.query.url){
        res.send('缺少url参数')
        return
    }
    res.json(await sign(req.query.url))
})

app.listen(PORT, () => {
    console.log(`app running at ${PORT}`)
})

