//载入express模块
var express = require('express');
// 实例化一个router对象
// 引用express下的路由中间键router
var router = express.Router();
// 文件路径链接模块
const path = require("path");
// 文件操作目录转移模块
const fs = require("fs");
// 载入文件上传中间件模块
const multiparty = require("multiparty");
//载入类型转换模块objectid用作（字符串=>数组）
const Objectid = require('objectid');
//// 数据库操作下面有个方法MongoClient
const MongoClient = require("mongodb").MongoClient;
//链接数据库//blog是库名字
const url = "mongodb://localhost:27017/blog";

//显示文章列表页面
router.get('/',function(req,res,next){
	// 获取id
	let id = req.query.id;
	//获取数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取posts集合
		let posts = db.collection('posts');
		posts.find().toArray( (err,result)=>{
			if(err) throw err;
			res.render('admin/article_list',{posts : result});
		});
	});
});
// 添加文章页面显示
router.get('/add',function(req,res,next){
	//获取所有的分类数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取集合
		let cats = db.collection('cats');
		// 将cats集合中的数据以数组的形式输出
		cats.find().toArray((err,result)=>{
			res.render('admin/article_add',{cats:result});
		});
	});
});
// 添加文章的提交操作
router.post('/insert',function(req,res,next){
	// 获取分类
	let cat = req.body.cat;
	// 获取文章的标题
	let subject = req.body.subject; 
	//获取文章摘要
	let summary = req.body.summary;
	// 获取文章内容
	let content = req.body.content;
	// 设置上传文件的临时目录
	let tmp = path.join(__dirname,"../../public/admin/temp");
	//实例化一个form对象，调用方法uploadDir：文件名
	const form = new multiparty.Form({uploadDir:tmp});
	//调用form的parse方法解析表单提交的内容==fields为非文件内容files为文件内容
	form.parse(req,(err,fields,files)=>{
		////////////////////////
		let oldPath = files.cover[0].path;
		//获取临时文件的路径
		let newPath = path.join(__dirname,"../../public/admin/uploads",files.cover[0].originalFilename);
		//获取文件转移后的路径/////////////////////////////////////////查找在数据库显示的文件名字//拼接
		fs.rename(oldPath,newPath,(err)=>{
			//文件转移
			if(err) throw err;
			//博客对象
			let article = {
				cat : fields.cat[0],
				//fields对象下的cat的数组[0]
				subject : fields.subject[0],
				summary : fields.summary[0],
				content : fields.content[0],
				time : new Date(),
				// 随机生成
				count : Math.ceil(Math.random()*100),
				//相对路径//获取文件保存后路径uploads下的文件名
				cover : path.join('uploads',files.cover[0].originalFilename)
			};
			//入库
			MongoClient.connect(url,(err,db)=>{
				if(err) throw err;
				let posts = db.collection('posts');
				//把article对象保存到数据库
				posts.insert(article,(err,result)=>{
					if(err){
						res.render("admin/message",{msg : "添加博客失败"});
					}else{
						res.render("admin/message",{msg : "添加博客成功"});
					}
				});
			});
		});
	});
});
// 修改文章页面
router.get('/edit',function(req,res,next){
	res.render('admin/article_edit',{});
});
// 修改成功提示
router.get('/update',function(req,res,next){

});
// 删除文章页面
router.get('/delete',function(req,res,next){
	//获取id
	let id = req.query.id;
	//从数据库获取数据回调
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取集合//collection方法
		let posts = db.collection('posts');
		// 将获取到的id删除，成功就输出
		posts.remove({_id:Objectid(id)},(err,result)=>{
			if(err){
				res.render('admin/message',{msg:"删除文章失败"});
			}else{
				res.render('admin/message',{msg:"删除文章成功"});
			}
		});
	});
});
// 导出模块
module.exports = router;