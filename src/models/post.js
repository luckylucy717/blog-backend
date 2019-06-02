const mongoose = require('mongoose');

const {Schema} = mongoose;

const Post = new Schema({
    title: String, 
    body: String, 
    tags: [String], //문자열 배열 
    publishedDate:{
        type:Date, 
        default: new Date() // 현재 날짜를 기본값으로 지정
    }
})
//1) 스키마 이름, 2) 스키마 객체 
module.exports = mongoose.model('Post', Post);
