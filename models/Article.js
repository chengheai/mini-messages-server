const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//订单模型
const articleSchema = new Schema({
  userId:{
    type: String,
    default: ""
  },
  // 作者名字
  nickName: {
    type: String,
    required: true
  },
  // 头像
  avatarUrl: {
    type: String,
    default: ""
  },
  // 性别
  gender: {
    type: String,
    default: ""
  },
  // 寄语
  content: {
    type: String,
    default: ""
  },
  // 图片信息
  imgs:{
    type: String,
    default: ""
  },
  // 是否公开
  public:{
    type: String,
    default:''
  },
  // 地址
  address: {
    type: String,
    default: ""
  },
  // 点赞
  like: {
    type: Number,
    default: 0
  },
  // 点赞的人id
  likers:{
    type: String,
    default: ""
  },
  // 举报数
  report:{
    type: Number,
    default: 0
  },
  // 理由
  reason:{
    type: String,
    default: ''
  },
  // 举报人ids
  reports:{
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Article = mongoose.model("Article", articleSchema);
