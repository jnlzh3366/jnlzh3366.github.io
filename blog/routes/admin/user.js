var express = require('express');
var router  = express.Router();
//// 数据库操作下面有个方法MongoClient
const MongoClient = require("mongodb").MongoClient;
//链接数据库//blog是库名字
const url = "mongodb://localhost:27017/blog";

// 登录页面显示路由
router.get('/login',function(req,res,next){
	// 判断是否已经登录
	if(req.session.isLogin){
		res.redirect('/admin');
	}else{
		res.render('admin/login');
	}
});
// 登录提交表单操作
router.post('/signin',(req,res)=>{
	//获取输入的用户名和密码
	let username = req.body.username;
	let password = req.body.password;

	// 链接数据库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		// 获取user集合
		let user = db.collection('user');
		//显示查找到的第一个
		user.findOne({username : username,password : password},(err,result)=>{
			//判断result是否有值
			if(err) throw err;
			if(result){
				//用户名密码正确
				//设置session,然后跳转
				req.session.isLogin = 1;
				res.redirect('/admin');
			}else{
				//用户名密码错误跳转到登录页面
				res.redirect('/user/login');
			}
		});
	});
});
//注销登录
router.get("/logout",(req,res)=>{
	//销毁session
	req.session.destroy();
	//跳转
	res.redirect('/admin');
});
module.exports = router;