/**
 * 帮助：http://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm-login&lang=zh_CN
 * 
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
 * 
 * @param requestParameters
 * @param response
 * @param next
 */
function getData(requestParameters, response,searchType) {
	apiOption.path = "/list=" + requestParameters.Content.replace(/ /, "");
	http.request(
			apiOption,
			function(res) {
				res.on('data', function(remoteData) {
					var dataMapper=sinaStockMapper[searchType];
					res.setEncoding('utf8');
					var responseDatas = [];
					//如果查询多个的话，传回的结果用;分开。
					var datas = iconv.fromEncoding(remoteData, 'gbk')
							.split(";");
					for ( var i = 0; i < datas.length; i++) {
						if (String(datas[i]).trim() === "") {
							continue;
						}
						var printTemplate =dataMapper.printTemplate;
						var data = datas[i].replace(/"/g, '').split("=")[1]
								.split(",");
						// 最后一个数字为毫秒级，去掉;
						for ( var j = 0; j < data.length ; j++) {
							if(!(j in dataMapper.dataMapper)){
								continue;
							}
							var re = new RegExp("#" + dataMapper.dataMapper[j] + "#",
									'g');
							printTemplate = printTemplate.replace(re, data[j]);
						}
						;
						responseDatas.push(printTemplate);
					}
					responseData(requestParameters, responseDatas.join("\n"),
							response);
				});
			}).on('error', function(e) {
		logger.error('problem with request: ' + e.message);
	}).end();
};
/**
 * 所有服务接口
 * 
 * @param requestParameters
 * @param response
 * @param next
 */
exports.service = function(requestParameters, response, next) {
	var content = String(requestParameters.Content).trim();
	if (content == "sh") {
		requestParameters.Content = "s_sh000001";
		getData(requestParameters, response,"stockGrail");
	} else if (content == "sz") {
		requestParameters.Content = "s_sz399001";
		getData(requestParameters, response,"stockGrail");
	} else if (content.match(/^sh|sz/)) {
		getData(requestParameters, response,"stoackInfo");
	} else {
		helpConsole(requestParameters, response);
	}
};
/**
 * /**1.回复sh,查看当前上证指数数据; 回复sz,查看深圳成指数;\n 帮助
 * 
 * @param serachParameters
 * @param response
 */
function helpConsole(serachParameters, response) {
	responseData(serachParameters,
			"帮助：\n 直接回复股票编码,用逗号分开可以查询多个,如:sh601003,sh601001", response);
};
/**
 * 最终返回结果，结果为：xml格式
 * 
 * @param serachParameters
 * @param remoteData
 * @param res
 */
function responseData(serachParameters, remoteData, res) {
	var responseData = responseParameters;
	responseData.FromUserName = serachParameters.ToUserName;
	responseData.ToUserName = serachParameters.FromUserName;
	responseData.CreateTime = serachParameters.CreateTime;
	responseData.MsgType = serachParameters.MsgType;
	responseData.Content = remoteData;
	var responseInfo = json2xml(responseData);
	logger.info("RESPONSE:" + responseInfo);
	res.send(responseInfo);
};
exports.responseData = responseData;