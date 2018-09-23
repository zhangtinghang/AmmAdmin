var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const qs = require("qs");

var native = require('./routes/native/index');
var web = require('./routes/web/index');
var app = express();

//打开数据库连接
require('./db.config').openDb;
//静态文件
app.use(express.static('public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Handle cross-domain issues.
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Access-Control-Max-Age" ,"86400"); 
  res.header("Access-Control-Allow-Headers" , "Content-Type"); 
  res.header("Content-Type", "application/json;charset=utf-8")
  next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res,next){
  try {
    req.body = qs.parse(req.body);
  } catch (error) {
    // console.log('格式化报错',err)
  }
  next();
})

app.use('/native', native);
app.use('/web',web);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
