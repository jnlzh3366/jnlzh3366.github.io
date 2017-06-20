var express = require('express');
var router = express.Router();
//// 数据库操作下面有个方法MongoClient
const MongoClient = require("mongodb").MongoClient;
//链接数据库//blog是库名字
const url = "mongodb://localhost:27017/blog";
///////////////////////////////////
const Objectid = require('objectid'); 

router.get('/',function(req,res,next){
	//获取id
	let id = req.query.id;
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let posts = db.collection('posts');
		posts.findOne({_id : Objectid(id)},(err,result)=>{
			if(err) throw err;
			// res.send(markdown.toHTML(result.content));
			res.render('home/posts',{posts : result});
		});
	});
});

module.exports = router;