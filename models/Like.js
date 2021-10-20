const mongoose = require('mongoose')
const Schema = mongoose.Schema
//点赞
const likeSchema = new Schema({
  userId: {
    type: String,
    default: '',
  },
  // 文章
  articleId: {
    type: String,
    required: '',
  },
  // 点赞/取消
  isLike: {
    type: String,
    required: '1',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Like = mongoose.model('Like', likeSchema)
