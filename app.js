var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");
const db = require("./config/keys.js").mongoURL;
mongoose.set("useCreateIndex", true); 
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(res => {
    console.log("远程数据库连接成功～～");
  })
  .catch(err => {
    console.log(err);
  });

var userRouter = require("./routes/user");
var articleRouter = require("./routes/article");
var fileRouter = require("./routes/file");
var likeRouter = require("./routes/like");
var wallRouter = require("./routes/wall");

var app = express();
//express 设置允许跨域访问

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api", userRouter);
app.use("/api", articleRouter);
app.use("/api", fileRouter);
app.use("/api", likeRouter);
app.use("/api", wallRouter);
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,X-File-Name,token"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Cache-Control", "no-store");
  if (req.method == "OPTIONS") {
    res.sendStatus(200).end();
  } else {
    next();
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// 监听端口
// app.listen(8899);
// console.log("server is running 8899");
module.exports = app;
