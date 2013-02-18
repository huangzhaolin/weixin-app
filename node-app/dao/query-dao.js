/**
 * @authoer:jolin.huang 2013-01-30
 */
/**
 * 书签功能入库
 * @param serachParameters
 */
var utils = require('util');

var dao = require("./data-access.js");
exports.logMark=function(logData){
	var userName=logData.userName;
	var markName=logData.markName;
	var makrInfo=logData.makrInfo;
	dao.execute(utils.format("select * from request_marks where user_name='%s' and mark_name='%s'",userName,markName),
			function(data){
		if(data.length>0){
			//如果有两条，那么还只做一条
			dao.execute(utils.format("update request_marks set mark_info='%s',log_date=now() where id='%s'",makrInfo,data[0].id));
		}else{
			dao.execute(utils.format("insert into request_marks(user_name,mark_name,mark_info) values('%s','%s','%s')",userName,markName,makrInfo));
		}
	});
};
/**
 * 记录查询日志
 * @param queryData
 */
exports.logUserQuery=function(queryData){
	dao.execute(utils.format("insert into request_log(user_name,query_data) values('%s','%s')",queryData.userName,queryData.queryData));
};
/**
 * 通过userName,markName 获取书签信息
 * @param userName
 * @param markName
 */
exports.selectMarkQueryByUserNameAndMarkName=function(userName,markName,callBack){
	dao.execute(utils.format("select * from request_marks where user_name='%s' and mark_name='%s'",userName,markName),callBack);
};
/**
 * 通过用户名获取所有的书签
 * @param userName
 * @param callBack
 */
exports.selectMarksByUserName=function(userName,callBack){
	dao.execute(utils.format("select * from request_marks where user_name='%s'",userName),callBack);
};
/**
 * 查询某个用户最近的一条查询
 * @param userName
 * @param callBack
 */
exports.selectLastQueryByUserName=function(userName,callBack){
	dao.execute(utils.format("select * from request_log where user_name='%s' order by id desc limit 1",userName),callBack);
};