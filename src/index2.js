const Koa = require('koa');

const app = new Koa()
// 미들웨어를 애플리케이션에 등록
// ctx: 웹 요청과 응답정보를 가지고 있음 
// next: 현재 처리중인 미들웨어 다음 미들웨어를 호출함
app.use(async(ctx, next)=>{
    console.log(1);
    // 다음 미들웨어를 호출, next()를 호출하지 않으면 1만찍고 끝
    // next는 프로미스다
    // next().then(()=>{
    //     console.log('bye');
    // })
    // async-await 위에 코드랑 동일
    await next();
    console.log('bye')
})
app.use((ctx, next)=>{
    console.log(2);
    next();
})
app.use((ctx)=>{
    ctx.body = 'hello wolrd';
});

app.listen(4000, () =>{
    console.log('listening to port 4000')
});