var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// 引入登陆的第三方中间键
var cookieParser = require('cookie-parser');
// 引入登陆的第三方中间键
var session = require('express-session');
// 获取表单提交数据
var bodyParser = require('body-parser');
// 载入首页index路由模块
var index = require('./routes/home/index');
//载入posts路由模块
var posts = require('./routes/home/posts');
// 载入后台首页模块
var admin = require('./routes/admin/index');
//载入后台分类页面的二级路由
var cats  = require('./routes/admin/cats');
//载入后台文章页面的二级路由
var article = require('./routes/admin/posts');
//登录页面路由
var user = require('./routes/admin/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// 获取表单提交数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/home')));
app.use(express.static(path.join(__dirname, 'public/admin')));
// 调用session函数
app.use(session({
	// 配置参数
	// 加密字符串
	secret:'blog',
	resave:false,
	saveUninitialized:true,
	// 登录的有效期
	// 不写默认关闭浏览器才会注销
	cookie:{}
}));

// 判断是否已经登录
app.use("/admin",(req,res,next)=>{
	if(!req.session.isLogin){
		// 没有登录，跳转到登录页面
		res.redirect('/user/login');
		return;
	}
	next();
});

app.use('/', index);
// 以posts开头的查询字符串链接，交给post处理
app.use('/posts',posts);
// 后台以admin开头的交给admin路由处理
app.use('/admin',admin);
//使用后台分类主页面cats都交给cats二级路由处理
app.use('/admin/cats',cats);
//使用后台分类主页面posts都交给article二级路由处理
app.use('/admin/posts',article);
//后台登录页面
app.use('/user',user);

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
