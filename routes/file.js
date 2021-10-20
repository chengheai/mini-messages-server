var express = require('express')
var router = express.Router()

// 图片上传

const multer = require('multer')

// const upload = multer({ dest: '/home/assets' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/assets')
  },
  filename: function (req, file, cb) {
    const { prefix } = req.body
    // let type = file.originalname.replace(/.+\./, '.')
    cb(null, `${prefix}${file.originalname}`)
  },
})

var upload = multer({ storage: storage })

// 前端文件上传
router.post('/file/upload', upload.array('file', 10), function (req, res, next) {
  console.log('file:', req.files)
  const { prefix } = req.body
  // 获取文件名
  let name = req.files[0].originalname

  let imgUrl = `/${prefix}${name}`
  res.json({
    code: 200,
    result: imgUrl,
    message: '上传成功',
  })
})

module.exports = router
