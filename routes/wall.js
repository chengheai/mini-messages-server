var express = require('express')
var router = express.Router()
var request = require('request')
const mongoose = require('mongoose')
const Wall = require('../models/Wall') //引入模块模型
// 墙列表
router.get('/wall/list', (req, res) => {
  let total = 0
  let query = {}
  Wall.count(query, function (err, count) {
    if (err) return
    total = count
  })

  Wall.find(query)
    .limit(Math.min(parseInt(req.query.pageSize) || 10, 100))
    .skip(parseInt(req.query.page - 1) * req.query.pageSize || 0)
    .sort({ date: -1 })
    .then((walls) => {
      res.json({
        code: 200,
        result: {
          data: walls,
          total,
        },
        message: '请求成功！',
      })
    })
    .catch((err) => {
      console.log('err:', err)
    })
})

router.put('/wall/update/:id', (req, res) => {
  let obj = {}
  Wall.find({ _id: req.body._id }).then((walls) => {
    // let obj = Object.assign(walls[0], {copyNum: walls[0].copyNum++})
    obj.copyNum = ++walls[0].copyNum
    console.log('obj:', obj)
    Wall.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: obj },
      { new: true }
    ).then(() =>
      res.json({
        code: 200,
        message: '更新成功',
      })
    )
  })
})
router.get('/wall/add', (req, res) => {
  // https://api.oick.cn/dutang/api.php
  // https://api.oick.cn/yulu/api.php
  // https://api.oick.cn/dog/api.php
  request('https://api.oick.cn/dog/api.php', function (err, response, body) {
    if (!err && response.statusCode == 200) {
      //todoJSON.parse(body)
      var data = JSON.parse(body)
      console.log('data:', data)
      Wall.find({ content: data }).then((wall) => {
        if (wall.length > 0) {
          console.log('已存在:', wall[0].content)
          res.json({
            code: 200,
            result: wall[0]._id,
            message: '已存在',
          })
        } else {
          let obj = {
            copyNum: '0',
            content: data,
          }
          new Wall(obj).save().then((val) => {
            res.json({
              code: 200,
              result: val._id,
              message: '创建寄语成功',
            })
          })
        }
      })
    }
  })
})
let type = 'default'
let types = ['default', 'custom']
router.get('/theme/set/:type', (req, res) => {
  let index = types.findIndex((item) => item === req.params.type)
  type = index > -1 ? req.params.type : 'default'
  console.log('index:', index)
  res.json({
    code: index > -1 ? 200 : 400,
    data: `${index > -1 ? `设置成功 模式为 => ${type}` : '设置失败，值必须为default或者custom'}`,
  })
})
// theme pick
router.get('/theme/pick', (req, res) => {
  res.json({
    code: 200,
    data: type,
  })
})

module.exports = router
