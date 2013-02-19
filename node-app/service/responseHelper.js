/**
 *  @author jolin.huang 2013-02-19
 */
var json2xml = require('json2xml');
var responseParameters = require("../data-mapper/mapper.js").responseParameters;

exports.responseData = responseData;
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