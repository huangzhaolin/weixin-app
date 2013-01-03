/**
 * @author jolin.huang 2013-1-3
 */
var http = require('http');
var json2xml = require('json2xml');
var url = require('url');

var logger = require('../logger.js');
var responseParameters = require("../data-mapper/mapper.js").responseParameters;

var apiOption = {
	hostname : 'hq.sinajs.cn',
	port : 80,
	method : 'GET'
};
/**
 * 从远程服务器获得数据
 */
exports.getData = function(requestParameters, response, next) {
	apiOption.path = "/list=" + requestParameters.Content;
	http.request(apiOption, function(res) {
		res.on('data', function(chunk) {
			res.setEncoding('utf8');
			var c = chunk.toString();
			responseData(requestParameters, c, response);
		});
	}).on('error', function(e) {
		console.log('problem with request: ' + e.message);
		logger.error('problem with request: ' + e.message);
	}).end();
	if (next) {
		next();
	}
};
/**
 * responseData:json格式
 */
function responseData(serachParameters, remoteData, res) {
	var responseData = responseParameters;
	responseData.FromUserName = serachParameters.ToUserName;
	responseData.ToUserName = "odFr3jgtZIUpg97zioQdYLEQZL_I";//serachParameters.FromUserName;
	responseData.CreateTime = serachParameters.CreateTime;
	responseData.MsgType = serachParameters.MsgType;
	responseData.Content = remoteData;
	console.log(responseData);
	var responseInfo = json2xml(responseData);
	logger.info(responseInfo);
	res.send(responseInfo);
};