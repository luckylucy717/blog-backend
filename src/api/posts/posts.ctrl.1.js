let postId = 1;

const posts = [
    {
        id:1, 
        title: '제목', 
        body: '내용'
    }
];
/**
 * 포스트 작성
 * POST /api/posts
 * {title, body}
 */
exports.write = (ctx) => {
    // REST API의 request body는 ctx.reqeust.body에서 조회할 수 있다. 
    const{
        title, body 
    }= ctx.request.body
    postId +=1; // 기존 postID값에 1을 더함 
    const post = {id: postId, title, body};
    posts.push(post);
    ctx.body = post;
}

/**
 * 포스트 목록조회 
 * GET /api/posts
 */
exports.list = (ctx) => { 
    ctx.body = posts;
}

/**
 * 특정 포스트 조회 
 * GET /api/posts/:id
 */
exports.read = (ctx) => {
    const {id} = ctx.params;

    const post = posts.find((item)=> item.id.toString() === id);

    if(!post){
        ctx.status =400;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }
    ctx.body = post;
}

/**
 * 특정 포스트 제거 
 * DELETE /api/posts/:id
 */
exports.remove = (ctx)=>{
    const {id} = ctx.params; 
    const index = posts.findIndex((item)=> item.id.toString() ===id);
    if(index === -1 ){
        ctx.status = 400;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return; 
    }
    posts.splice(index, 1);
    ctx.status = 204; // No Content
};

/**
 * 포스트 수정(교체)
 * PUT /api/posts/:id
 * {title, body}
 */
exports.replace = (ctx) =>{
    const {id} = ctx.params;

    const index = posts.findIndex((item) => item.id.toString() === id);

    if(index === -1){
        ctx.status =400;
        ctx.body ={
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }
    //전체 객체를 덮어씌운다 
    // id를 제외한 기존 정보는 날리고, 객체를 새로 만든다.
    posts[index] = {
        id, 
        ...ctx.request.body
    };
    ctx.body = posts[index];
}

/**
 * 포스트 수정(특정 필드변경)
 * PATCH /api/posts/:id
 */
exports.update = (ctx)=>{
    const {id} = ctx.params;

    const index = posts.findIndex((item)=> item.id.toString() ===id);
    if(index ===-1){
        ctx.status =400;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        }
        return; 
    }

    posts[index] = {
        ...posts[index],
        ...ctx.request.body 
    };
    ctx.body = posts[index];
}