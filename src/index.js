require('dotenv').config(); // 환경변수 설정
const mongoose = require('mongoose');
const {
    PORT: port = 4000, 
    MONGO_URI: mongoURI, 
}= process.env;

mongoose.Promise = global.Promise; // Node의 Promise를 사용하도록 
mongoose.connect(mongoURI).then(()=>{
    console.log('connected to mongodb')
}).catch((e)=>{
    console.error(e);
})
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');

const app = new Koa();
const router = new Router();

// 라우터 설정 
router.use('/api', api.routes())// api라우트 적용

// 라우터 적용전에 bodyparser 적용
app.use(bodyParser());

// router.get('/', (ctx) =>{
//     ctx.body='홈';
// })
// router.get('/about/:name?', (ctx)=>{
//     const {name} = ctx.params;
//     // name의 존재 유무에 따라 다른 결과 출력 

//     ctx.body = name? `${name}의 소개` : '소개';
// })

// router.get('/posts', (ctx)=>{
//     const {id} = ctx.query;
//     // name의 존재 유무에 따라 다른 결과 출력 

//     ctx.body = id? `포스트 #${id}` : '소개';
// })

// app인스턴스에 라우터 적용 
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () =>{
    console.log('listening to port 4000')
})