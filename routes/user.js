const express = require('express')
const http = require('https')
const router = express.Router()
const mongoose = require('mongoose')
const qs = require('querystring')
const User = require('../models/User') //引入模块模型
const vertoken = require('../utils/token') //引入token
const wx = require('../config/wx')

// 登录
router.post('/login', (_req, _res) => {
  console.log(_req.body, ' 页面传入参数')
  let user = Object.assign({}, _req.body)
  var query = {
    appid: wx.appid,
    secret: wx.secret,
    js_code: _req.body.code,
    grant_type: 'authorization_code',
  }
  var content = qs.stringify(query)
  var options = {
    hostname: 'api.weixin.qq.com',
    port: '',
    path: '/sns/jscode2session?' + content,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }

  var req = http.request(options, function (res) {
    res.on('data', function (_data) {
      console.log('_data: ', _data)

      let parsData = JSON.parse(_data.toString())
      const { openid } = parsData
      User.find(
        {
          openid,
        },
        (err, users) => {
          if (users && users.length > 0) {
            vertoken.setToken(users[0]._id, users[0].openid).then((token) => {
              _res.json({
                code: 200,
                result: {
                  token,
                  userId:users[0]._id
                },
                message: '登录成功',
              })
            })
          } else {
            user.openid = openid
            new User(user).save().then((val) => {
              vertoken.setToken(val._id, openid).then((token) => {
                _res.json({
                  code: 200,
                  result: {
                    token,
                    userId:val._id
                  },
                  message: '登录成功',
                })
              })
            })
          }
        }
      )
    })
  })

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message)
  })

  req.end()
})
// 个人信息
router.post('/user/detail', (req, res) => {
  vertoken
    .getToken(req.headers.token)
    .then((data) => {
      console.log(data._id)
      User.find(
        {
          _id: data._id,
        },
        (err, user) => {
          res.json({
            code: 200,
            message: '请求成功',
            result: user[0],
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

module.exports = router
