const mongoose = require('mongoose')
const Schema = mongoose.Schema
//
const WallSchema = new Schema({
  // 文章
  content: {
    type: String,
    required: '',
  },
  // 点赞/取消
  copyNum: {
    type: String,
    required: '1',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Wall = mongoose.model('Wall', WallSchema)
