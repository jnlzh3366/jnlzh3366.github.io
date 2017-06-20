var express = require('express');
var router = express.Router();
//// 数据库操作下面有个方法MongoClient
const MongoClient = require("mongodb").MongoClient;
//链接数据库//blog是库名字
const url = "mongodb://localhost:27017/blog";

/* GET home page. */
router.get('/', function(req, res, next){
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		// 获取分类的集合
		let cats = db.collection('cats');
		// 查找到第一个内容转化为数组
		cats.find().toArray((err,res1)=>{
			if(err) throw err;
			//取文章
			let posts = db.collection('posts');
			posts.find().sort({time : -1}).limit(5).toArray((err,res2)=>{
			// (sort)排序显示 逆序从大到小的时间//限制只能取5条博客(limit)
				if(err) throw err;
				console.log(res1);
				console.log(res2);
				res.render('home/index',{cats : res1,posts : res2});
			});
		});
	});
});

module.exports = router;
