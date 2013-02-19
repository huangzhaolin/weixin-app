/**
 * @author jolin.huang
 */
var getRemoteData = require("../service/getRemoteData.js");
var logger = require('../logger.js');
var requestParameters = require("../data-mapper/mapper.js").requestParameters;
var responseData=require('../service/responseHelper.js').responseData;
var stockService=require('../service/getRemoteStockData.js').stockService;
var musicService=require('../service/getRemoteMusicData.js').stockService;

var querystring = require('querystring'); 
var xml2json = require("xml2json");
var validator=require('validator').sanitize;


function requestData(req, res,handle) {
	var parameters = "";
	req.on("data", function(data) {
		parameters += data;
	});
	req.on("end", function() {
		var queryParse = querystring.parse(parameters);
		for ( var i in queryParse) {
			req.postParameters = JSON.parse(xml2json.toJson(i)).xml;
		}
		var serachParameters = [];
		var logInfo="";
		for ( var p in requestParameters) {
			serachParameters[p] = validator(req.postParameters[p]).entityDecode();
			logInfo+=p+"="+serachParameters[p]+" ; ";
		}
		logger.custom("parameters",logInfo);
		try{
			handle(serachParameters, res);}catch(e){
			logger.error(e);
			responseData(serachParameters,"对不起系统异常！请稍后再试！",res);
		};
	});

};
exports.stock = function(req, res){requestData(req, res,stockService);};
exports.music=function(req, res){requestData(req, res,musicService);};