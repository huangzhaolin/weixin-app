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
var responseData = require('./responseHelper.js').responseData;

var apiOptions = {
  hostname: 'box.zhangmen.baidu.com',
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
function musicService(requestParameters, response, next) {
  var contentArr = requestParameters.Content.split(":");
  if (contentArr.length != 2) {
    return helpConsole(requestParameters, response);
  }
  var musicName = contentArr[0];
  var singerName = contentArr[1];
  apiOptions.path = "/x?op=12&count=1&title=" + encodeURIComponent(musicName) + "$$" + encodeURIComponent(singerName);
  http.request(apiOptions,
  function(res) {
    res.on('data',
    function(remoteData) {
      //查询结果转成对象
      /*
      {"count":5,"url":[{"encode":"http://zhangmenshiting.baidu.com/data2/music/18740228/YmpqaGVoaXBfn6NndK6ap5WXcGptm2xpaWdkZm1nnWiTlWZtaWpnbWqYZ5prampwlGqVWqKfm3VhYGdkbmxvbmNiY2ZrbWpoMQ$$","decode":"18740228.mp3?xcode=68e51851281f0bc3944059f4f6438c8b&amp;mid=0.40968620026730","type":8,"lrcid":0,"flag":0},
      {"encode":"http://shiting.chaishouji.com:551/file2/179/YmlrZWZsNw$$.mp3","decode":"178116.mp3","type":1,"lrcid":0,"flag":0},
      {"encode":"http://shiting3.chaishouji.com:553/file2/179/YmlrZWZsNw$$.mp3","decode":"178116.mp3","type":1,"lrcid":0,"flag":0},
      {"encode":"http://www.tutufc.com/UploadFiles_all/091116/Users/2848/Songs/Y2JkZGZoZ2pkZmRtbWxnamgy.mp3","decode":"20101202341986027.mp3","type":1,"lrcid":0,"flag":0},
      {"encode":"http://shiting2.chaishouji.com:552/file2/179/YmlrZWZsNw$$.mp3","decode":"178116.mp3","type":1,"lrcid":0,"flag":0}],
      "durl":[{"encode":"http://zhangmenshiting2.baidu.com/data2/music/18740228/YmpqaGVoaXBfn6NndK6ap5WXcGptm2xpaWdkZm1nnWiTlWZtaWpnbWqYZ5prampwlGqVWqKfm3VhYGdkbmxvbmNiY2ZrbWpoMQ$$","decode":"18740228.mp3?xcode=68e51851281f0bc3944059f4f6438c8b&amp;mid=0.40968620026730","type":8,"lrcid":0,"flag":0},{},{},{},{}]}
      */
      var datas = JSON.parse(xml2json.toJson(iconv.fromEncoding(remoteData, 'gbk'))).result.url;
      console.log(JSON.stringify(datas));
      if (datas&&datas.length > 0) {
        //encode:http://zhangmenshiting.baidu.com/data2/music/18740228/YmpqaGVoaXBfn6NndK6ap5WXcGptm2xpaWdkZm1nnWiTlWZtaWpnbWqYZ5prampwlGqVWqKfm3VhYGdkbmxvbmNiY2ZrbWpoMQ$$
        //去掉最后那部分用decode来代替
        var musicURL=(datas[0].encode.replace(/(\/[^\/]*)$/,'')+"/"+datas[0].decode);
        requestParameters.MsgType = "music";
        requestParameters.Music.MusicUrl = musicURL;
        requestParameters.Music.HQMusicUrl = musicURL;
        requestParameters.Music.title = musicName + "--" + singerName;
        console.log(JSON.stringify(requestParameters));
        console.log(Music);
        responseData(requestParameters, "1212121212", response);
      } else {
        responseData(requestParameters, "无法找到歌手为：" + singerName + "，歌曲为：" + musicName + "的音乐", response);
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
exports.service = musicService;