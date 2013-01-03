/**
 * @author jolin.huang 2013-1-3
 */
var http = require('http');
var json2xml = require('json2xml');
var url = require('url');
var iconv = require('iconv-lite');

var logger = require('../logger.js');
var responseParameters = require("../data-mapper/mapper.js").responseParameters;
var sinaStockMapper = require("../data-mapper/mapper.js").sinaStockMapper;

var apiOption = {
	hostname : 'hq.sinajs.cn',
	port : 80,
	method : 'GET'
};
/**
 * 从远程服务器获得数据
 * @param requestParameters
 * @param response
 * @param next
 */
function getData(requestParameters, response) {
	apiOption.path = "/list=" + requestParameters.Content;
	http.request(apiOption, function(res) {
		res.on('data', function(remoteData) {
			res.setEncoding('utf8');
			var datas = iconv.fromEncoding(remoteData, 'gbk').replace(/\&quot;/g,'').split("=")[1].split(",");
			var printInfo="";
			//最后一个数字为毫秒级，去掉;
			for(var i=0;i<datas.length-1;i++){
				printInfo+=sinaStockMapper[i]+":"+datas[i]+"\n";
			};
			responseData(requestParameters, printInfo, response);
		});
	}).on('error', function(e) {
		logger.error('problem with request: ' + e.message);
	}).end();
};
/**
 * 所有服务接口
 * @param requestParameters
 * @param response
 * @param next
 */
exports.service=function(requestParameters, response, next){
	var content=String(requestParameters.Content).trim();
	switch(content){
	case "h":
		helpConsole(requestParameters,response);
		break;
	default:
		getData(requestParameters, response);
		break;
	}
};
/**
 * 帮助
 */
function helpConsole(serachParameters,response){
	responseData(serachParameters,"帮助：\n 1.回复sh,查看当前上证指数数据; 回复sz,查看深圳成指数;\n2.直接回复股票编码,用逗号分开可以查询多个,如:sh601003,sh601001",response);
};
/**
 * responseData:json格式
 */
function responseData(serachParameters, remoteData, res) {
	var responseData = responseParameters;
	responseData.FromUserName = serachParameters.ToUserName;
	responseData.ToUserName = serachParameters.FromUserName;
	responseData.CreateTime = serachParameters.CreateTime;
	responseData.MsgType = serachParameters.MsgType;
	responseData.Content = remoteData;
	var responseInfo = json2xml(responseData);
	logger.info("RESPONSE:"+responseInfo);
	res.send(responseInfo);
};