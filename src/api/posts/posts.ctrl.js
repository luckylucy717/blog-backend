const Post = require('models/post');
const {ObjectId} = require('mongoose').Types;
const Joi = require('joi');

// 코드를 중복시키지 않고 만드려면 미들웨어로 
exports.checkObjectId = (ctx, next) =>{
    const {id} = ctx.params;

    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return null;
    }
    return next();
}
/*
    POST /api/posts
    {title, body, tags}
*/
exports.write =  async(ctx)=>{
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(), 
        tags: Joi.array().items(Joi.string()).required()
    })
    const result = Joi.validate(ctx.request.body, schema);
    if(result.error){
        ctx.status =400; 
        ctx.body = result.error;
        return;
    }

    const {title, body, tags} = ctx.request.body;
    const post = new Post({
        title, body, tags
    });
    try {
        await post.save();
        ctx.body = post;
    }catch(e){
        ctx.throw(e, 500);
    }
};
exports.list = async(ctx)=>{
    const page = parseInt(ctx.query.page ||1, 10);

    if(page<1){
        ctx.status = 400;
        return;
    }

    try {
        // sort({_id:-1}) 내림차순
        const posts = await Post.find()
                            .sort({_id:-1})
                            .limit(10)
                            .skip((page-1)* 10)
                            .lean()
                            .exec();
        const limitBodyLength = post =>({
            ...post, 
            body: post.body.length<200? post.body: `${post.body.slice(0,200)}`
        })
        const postCount = await Post.count().exec();
        // 마지막 페이지 알려주기 
        // ctx.set은 response header를 설정 
        ctx.set('Last-Page', Math.ceil(postCount/10));
        ctx.body = posts.map(limitBodyLength);
    }catch(e){
        ctx.throw(e, 500);
    }
}
exports.read = async(ctx)=>{
    const {id} = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if(!post){
            ctx.status =404;
            return;
        }
        ctx.body = post
    }catch(e){
        ctx.throw(e, 500);
    }
}
exports.remove = async (ctx)=>{
    //remove: 특정 조건을 만족하는 데이터들을 모두 지운다. 
    //findByIdAndRemove: id를 찾아서 지운다. 
    //findOneAndRemove: 특정 조건을 만족하는 데이터 하나를 찾아서 제거한다. 

    const {id} = ctx.params; 
    try{ 
        await Post.findOneAndRemove(id).exec();
        ctx.status =200
    }catch(e){
        ctx.throw(e, 500);
    }
}
exports.update = async (ctx)=>{
    const {id} = ctx.params; 
    try {
        const post = await Post.findOneAndUpdate(id, ctx.request.body, {
            new: true,
            // 이걸 설정해줘야 업데이트된 객체를 반환한다. 
        }).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(e, 500);
    }
}