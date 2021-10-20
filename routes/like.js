var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const Like = require('../models/Like') //引入模块模型
const Article = require('../models/Article')
var vertoken = require('../utils/token') //引入token
// 个人点赞列表
router.get('/article/like/list', (req, res) => {
  vertoken
    .getToken(req.headers.token)
    .then((data) => {
      Like.find({
        userId: data._id,
      })
        .then((likes) => {
          res.json({
            code: 200,
            result: {
              data: likes,
            },
            message: '请求成功！',
          })
        })
        .catch((err) => {
          console.log('err:', err)
        })
    })
    .catch((error) => {
      console.log('error:', error)
      res.json({ code: 401, message: 'token失效了' })
    })
})
//举报
router.post('/article/report', (req, res) => {
  vertoken
    .getToken(req.headers.token)
    .then((data) => {
      console.log(req.body)
      const { query,type } = req.body
      let obj = {}
      let { reports, reason, _id, report } = query
      let temp = []
      let temp1 = []
      // 点赞人数有没有
      if (reports && reports.split(',').length > 0) {
        temp = reports.split(',')
      }
      if (reason && reason.split(',').length > 0) {
        temp1 = reason.split(',')
      }

      if (temp.length > 0 && temp.findIndex((item) => item === data._id) < 0) {
        return
      }
      temp.push(data._id)
      temp1.push(type)
       obj = {
        reports: temp.join(','),
        reason: temp1.join(','),
        report: ++report
      }
      // 更新文章点赞
      Article.findOneAndUpdate(
        {
          _id: _id,
        },
        { $set: obj },
        { new: true }
      ).then(() => {
        res.json({
          code: 200,
          message: '请求成功！',
        })
      })
    })
    .catch((error) => {
      console.log('error:', error)
      res.json({ code: 401, message: 'token失效了' })
    })
})
// 点赞/取消点赞
router.post('/article/like', (req, res) => {
  vertoken
    .getToken(req.headers.token)
    .then((data) => {
      console.log(req.body)
      const { query, isLike } = req.body
      let obj = {}
      const { likers, _id, like } = query
      let temp = []
      // 点赞人数有没有
      if (likers && likers.split(',').length > 0) {
        temp = likers.split(',')
      }
      if (isLike === '1') {
        temp.push(data._id)
        obj = {
          like: +like + 1,
          likers: temp.join(','),
        }
      } else {
        let idx = temp.findIndex((item) => item === data._id)
        temp.splice(idx, 1)
        obj = {
          like: like - 1,
          likers: temp.join(','),
        }
      }
      // 更新文章点赞
      Article.findOneAndUpdate(
        {
          _id: _id,
        },
        { $set: obj },
        { new: true }
      ).then(() => {
        res.json({
          code: 200,
          message: '请求成功！',
        })
      })
    })
    .catch((error) => {
      console.log('error:', error)
      res.json({ code: 401, message: 'token失效了' })
    })
})

module.exports = router
