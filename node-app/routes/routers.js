/**
 * @author jolin.huang
 */
var getRemoteData = require("../service/getRemoteData.js");
var logger = require('../logger.js');
var requestParameters = require("../data-mapper/mapper.js").requestParameters;


var querystring = require('querystring'); 
var xml2json = require("xml2json");

exports.stock = function(req, res) {
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

		for ( var p in requestParameters) {
			serachParameters[p] = req.postParameters[p];
		}
		try{
		getRemoteData.service(serachParameters, res);}catch(e){
			getRemoteData.responseData(serachParameters,"对不起系统异常！请稍后再试！",res);
		};
	});

};