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
	console.log(requestParameters.Content)
	apiOption.path = "/list=" + requestParameters.Content;
	http.request(apiOption, function(res) {
		res.on('data', function(remoteData) {
			res.setEncoding('utf8');
			var responseDatas=[];
			var datas = iconv.fromEncoding(remoteData, 'gbk').split(";");
			for(var i=0;i<datas.length;i++){
				var printTemplate="日期:#日期# #时间# 股票名字:#股票名字#\n" +
				"今日开盘价:#今日开盘价#\n" +
				"昨日收盘价:#昨日收盘价#\n" +
				"当前价格:#当前价格#\n" +
				"今日最高价:#今日最高价#\n" +
				"今日最低价:#今日最低价#\n" +
				"竞买价:#竞买价# 竞卖价:#竞卖价#\n" +
				"成交的股票数:#成交的股票数#\n" +
				"成交金额:#成交金额#\n" +
				"买入  买如量    卖出  卖出量  \n" +
				"#买一# #买一量# #卖一# #卖一量#\n" +
				"#买二# #买二量# #卖二# #卖二量#\n" +
				"#买三# #买三量# #卖三# #卖三量#\n" +
				"#买四# #买四量# #卖四# #卖四量#\n" +
				"#买五# #买五量# #卖五# #卖五量#";
				var data=datas[i].replace(/"/g,'').split("=")[1].split(",");
				//最后一个数字为毫秒级，去掉;
				for(var i=0;i<data.length-1;i++){
					var re=new RegExp("#"+sinaStockMapper[i]+"#",'g');
					printTemplate=printTemplate.replace(re, data[i]);
				};
				responseDatas.push(printTemplate);
			}
			responseData(requestParameters, responseDatas.join("\n"), response);
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