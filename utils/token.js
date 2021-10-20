var jwt = require("jsonwebtoken");
var jwtSecret = "write messages"; //签名
//登录接口 生成token的方法
var setToken = function(_id, openid) {
  return new Promise((resolve, reject) => {
    //expiresln 设置token过期的时间
    //{ openid: openid, _id: _id } 传入需要解析的值（ 一般为用户名，用户id 等）
    const rule = { _id: _id, openid: openid };
    // const token = 'Bearer ' + jwt.sign(rule, jwtSecret, { expiresIn: '36000' });
    const token = jwt.sign(rule, jwtSecret, {expiresIn: '7d'});
    resolve(token);
  });
};

//各个接口需要验证token的方法
var getToken = function(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      console.log("token是空的");
      reject({
        error: "token 是空的"
      });
    } else {
      var info = jwt.verify(token, jwtSecret);
      // console.log('info: ', info);
      resolve(info); //解析返回的值（sign 传入的值）
    }
  });
};

module.exports = {
  setToken,
  getToken
};
