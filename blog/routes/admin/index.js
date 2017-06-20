//载入express模块
var express = require('express');
// 实例化一个router对象
// 引用express下的路由中间键router
var router = express.Router();

router.get('/',function(req,res,next){
	// render渲染视图模板
	res.render('admin/index');
});
// 导出模块
module.exports = router;