const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 微信用户
const userSchema = new Schema({
  userInfo: {
    type: String,
    required: true
  },
  nickName: {
    type: String,
    default: ""
  },
  avatarUrl:{
    type: String,
    default:''
  },
  gender:{
    type: String,
    default:''
  },
  city:{
    type: String,
    default:''
  },
  province:{
    type: String,
    default:''
  },
  country:{
    type: String,
    default:''
  },
  openid:{
    type:String,
    default:''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("User", userSchema);
