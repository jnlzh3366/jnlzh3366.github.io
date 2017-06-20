//载入express模块
var express = require('express');
// 实例化一个router对象
// 引用express下的路由中间键router
var router = express.Router();
//载入类型转换模块objectid用作（字符串=>数组）
const Objectid = require('objectid');
//// 数据库操作下面有个方法MongoClient
const MongoClient = require("mongodb").MongoClient;
//链接数据库//blog是库名字
const url = "mongodb://localhost:27017/blog";

// 后台的分类显示主页面
router.get('/',function(req,res,next){
	//获取数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取集合//collection方法
		let cats = db.collection('cats');
		// 把数据库里得到的对象转换成数组
		cats.find().toArray((err,result)=>{
			// 把得到的结果通过模板的cats传输
			res.render('admin/category_list',{cats:result});
		});
	});
});
// 后台的分类添加
router.get('/add',function(req,res,next){
	// render渲染视图模板
	res.render('admin/category_add');
});
//后台分类添加结果
router.post('/insert',function(req,res,next){
	//获取表单提交的信息
	let title = req.body.title;
	let order = req.body.order;

	// 在提交后提示验证提交内容的格式是否合格
	if(title.trim() == '' || order.trim == ''){
		res.render('admin/message',{msg:'标题和排序不能为空'});
		return;
	}
	// 获取数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		// 获取集合
		let cats = db.collection("cats");
		// 写入
		cats.insert({title : title,order : order},(err,result)=>{
			if(err){
				res.render('admin/message',{msg:'添加分类失败'});
			}else{
				res.render('admin/message',{msg:'添加分类成功'});
			}
		});
	});
});
// 后台的分类修改
router.get('/edit',function(req,res,next){
	//在显示编辑分类表单页面时，需要将这个分类的信息，获取到，然后渲染到模板页面中
	//获取到按钮的查询字符串
	let id = req.query.id;
	// 获取数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取集合//collection方法
		let cats = db.collection('cats');
		//查到一条数据,得到的结果回调result输出
		cats.findOne({_id : Objectid(id)},(err,result)=>{
			if(err) throw err;
			res.render("admin/category_edit",{cat : result});
		});
	});
});
//后台的分类修改更新
router.post('/update',function(req,res,next){
	let title = req.body.title;
	let order = req.body.order;
	let id    = req.body.id;
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		cats.update({_id:Objectid(id)},{$set:{title : title,order : order}},(err,db)=>{
			if(err){
				res.render('admin/message',{msg:"更新分类失败"});
			}else{
				res.render('admin/message',{msg:"更新分类成功"});
			}
		});
	});
});
// 后台的分类删除
router.get('/delete',function(req,res,next){
	//获取id
	let id = req.query.id;
	//从数据库获取数据回调
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取集合//collection方法
		let cats = db.collection('cats');
		// 将获取到的id删除，成功就输出
		cats.remove({_id:Objectid(id)},(err,result)=>{
			if(err){
				res.render('admin/message',{msg:"删除分类失败"});
			}else{
				res.render('admin/message',{msg:"删除分类成功"});
			}
		});
	});
});

// 导出模块
module.exports = router;