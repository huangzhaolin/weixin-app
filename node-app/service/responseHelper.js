/**
 *  @author jolin.huang 2013-02-19
 */
var logger = require('../logger.js');
var json2xml = require('json2xml');
var mappers = require("../data-mapper/mapper.js");

exports.responseData = responseData;
/**
 * 最终返回结果，结果为：xml格式
 * 
 * @param serachParameters
 * @param remoteData
 * @param res
 */
function responseData(serachParameters, remoteData, res) {
  var responseData = mappers.responseParameters;
  responseData.FromUserName = serachParameters.ToUserName;
  responseData.ToUserName = serachParameters.FromUserName;
  for(var key in serachParameters){
  	if(!(key in {"FromUserName":"","ToUserName":"","Content":""})){
		responseData[key]=serachParameters[key];
  	}
  }
  if(responseData['MsgType']!="music"){
  	delete responseData['Music'];
  }
  responseData.Content=remoteData;
  var responseInfo = json2xml(responseData);
  logger.info("RESPONSE:" + responseInfo);
  res.send(responseInfo);
};