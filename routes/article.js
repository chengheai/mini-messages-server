var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const Article = require('../models/Article') //引入模块模型
const User = require('../models/User')
var vertoken = require('../utils/token') //引入token

// 获取寄语列表
router.get('/article/list', (req, res) => {
  vertoken
    .getToken(req.headers.token)
    .then((data) => {
      let total = 0
      let query = {
        userId: req.query.type ? data._id : '',
        public: req.query.public || '',
        report: !req.query.type ?{$lte: 3}:''
      }
      if (!query.userId) {
        delete query.userId
      }
      if (!query.report) {
        delete query.report
      }
      if (!query.public) {
        delete query.public
      }
      // console.log('==',query)
      Article.count(query, function (err, count) {
        if (err) return
        total = count
      })

      Article.find(query)
        .limit(Math.min(parseInt(req.query.pageSize) || 10, 100))
        .skip(parseInt(req.query.page - 1) * req.query.pageSize || 0)
        .sort({ date: -1 })
        .then((articles) => {
          res.json({
            code: 200,
            result: {
              data: articles,
              total,
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
// 删除寄语
router.delete('/article/delete/:id', (req, res) => {
  console.log('req: ', req.params)
  Article.findOneAndRemove({ _id: req.params.id })
    .then((role) => {
      res.json({
        code: 200,
        message: '删除成功',
      })
    })
    .catch((err) => {
      res.json({
        code: -1,
        message: '删除失败',
      })
    })
})
// 寄语详情
router.get('/article/detail/:id', (req, res) => {
  vertoken
    .getToken(req.headers.token)
    .then((data) => {
      Article.find(
        {
          _id: req.params.id,
        },
        (err, articles) => {
          res.json({
            code: 200,
            message: '请求成功',
            result: articles[0],
          })
        }
      )
    })
    .catch((error) => {
      res.json({
        code: 401,
        message: 'token失效了',
      })
    })
})
//更新寄语
router.put('/article/update/:id', (req, res) => {
  vertoken
    .getToken(req.headers.token)
    .then((val) => {
      const article = req.body
      Article.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { $set: article },
        { new: true }
      ).then((article) =>
        res.json({
          code: 200,
          message: '更新成功',
        })
      )
    })
    .catch((error) => {
      res.json({
        code: 401,
        message: 'token失效了',
      })
    })
})

// 创建寄语
router.post('/article/add', (req, res) => {
  vertoken.getToken(req.headers.token).then((data) => {
    console.log('data: ', data)
    User.find({ openid: data.openid }).then((user) => {
      console.log('user: ', user)
      const { nickName, avatarUrl, gender } = user[0]
      let article = {
        userId: data._id,
        nickName,
        avatarUrl,
        gender,
        // 点赞数
        like: 0,
        // 点赞人id
        likers: '',
        // 理由
        reason: '',
        // 举报数
        report: 0,
        // 举报人id
        reports: '',
      }
      article = Object.assign(article, req.body)
      console.log('article: ', article)
      new Article(article).save().then((val) => {
        res.json({
          code: 200,
          result: val._id,
          message: '创建寄语成功',
        })
      })
    })
  })
})

module.exports = router
