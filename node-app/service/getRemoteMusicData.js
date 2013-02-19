/**
 * 音乐方面的支持
 * @author jolin.huang 2013-02-19
 */
var http = require('http');
var json2xml = require('json2xml');
var url = require('url');
var iconv = require('iconv-lite');
var utils = require('util');
var xml2json = require("xml2json");

var logger = require('../logger.js');
var query_dao = require("../dao/query-dao.js");
var responseParameters = require("../data-mapper/mapper.js").responseParameters;
var sinaStockMapper = require("../data-mapper/mapper.js").sinaStockMapper;
var responseData=require('./responseHelper.js').responseData;

var apiOptions={
		hostname: 'http://box.zhangmen.baidu.com/x',
		port: 80,
		method: 'GET'	
};
/**
 * http://box.zhangmen.baidu.com/x?op=12&count=1&title=大约在冬季$$齐秦$$$$ 
 * 音乐服务接口
 * @param requestParameters
 * @param response
 * @param next
 */
function musicService(requestParameters, response, next){
	var contentArr=requestParameters.Content.split(":");
	if(contentArr.length!=2){
		return helpConsole(requestParameters,response);
	}
	var musicName=contentArr[0];
	var singerName=contentArr[1];
	apiOptions.path = "?op=12&count=1&title=" + musicName+"$$"+singerName;
	paramaters = requestParameters.Content.split(",");
	http.request(apiOptions,
			  function(res) {
			    res.on('data',
			    function(remoteData) {
			      //查询结果转成对象
			      var datas = JSON.parse(xml2json.toJson(iconv.fromEncoding(remoteData, 'gbk'))).xml;
			      if(datas.length>0&&datas[0].durl.enode){
			    	  requestParameters.MsgType="music";
				      requestParameters.Music.MusicUrl=datas[0].durl.enode;
				      requestParameters.Music.HQMusicUrl=datas[0].durl.enode;
				      requestParameters.Music.title=musicName+"--"+singerName;
			    	  responseData(requestParameters, "", response);
			    	  }else{
			    		  responseData(requestParameters, "无法找到歌手为："+singerName+"，歌曲为："+musicName+"的音乐", response);
			    	  };
			      });
			  }).on('error',
			  function(e) {
			    logger.error('problem with request: ' + e.message);
			  }).end();
};
/**
 * /** 帮助
 * 
 * @param serachParameters
 * @param response
 */
function helpConsole(serachParameters, response) {
  responseData(serachParameters, "帮助：\n" + "回复：歌曲名+':'+歌手，愿你能够搜到音乐！", response);
};
exports.service=musicService;