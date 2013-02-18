/**
 * 帮助：http://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm-login&lang=zh_CN
 * 
 * @author jolin.huang 2013-1-3
 */
var http = require('http');
var json2xml = require('json2xml');
var url = require('url');
var iconv = require('iconv-lite');
var utils = require('util');

var logger = require('../logger.js');
var query_dao = require("../dao/query-dao.js");
var responseParameters = require("../data-mapper/mapper.js").responseParameters;
var sinaStockMapper = require("../data-mapper/mapper.js").sinaStockMapper;

var apiOption = {
  hostname: 'hq.sinajs.cn',
  port: 80,
  method: 'GET'
};

/**
 * 从远程服务器获得数据
 * 
 * @param requestParameters
 * @param response
 * @param next
 */
function getData(requestParameters, response, searchType) {
	//记录查询日志
  logQueryData({userName:requestParameters.FromUserName,queryData:requestParameters.Content});
  apiOption.path = "/list=" + requestParameters.Content.replace(/ /, "");
  paramaters = requestParameters.Content.split(",");
  http.request(apiOption,
  function(res) {
    res.on('data',
    function(remoteData) {
      var dataMapper = sinaStockMapper[searchType];
      var responseDatas = [];
      // 如果查询多个的话，传回的结果用;分开。
      var datas = iconv.fromEncoding(remoteData, 'gbk').split(";");
      for (var i = 0; i < datas.length; i++) {
        if (String(datas[i]).trim() === "") {
          continue;
        }
        var printTemplate = dataMapper.printTemplate;
        var data = datas[i].replace(/"/g, '').split("=")[1].split(",");
        if (String(data).trim() === "") {
          responseDatas.push(paramaters[i] + "这支股无法找到！请确认参数是否正确！");
          continue;
        }
        for (var j = 0; j < data.length; j++) {
          var re = new RegExp("#" + dataMapper.dataMapper[j] + "#", 'g');
          printTemplate = printTemplate.replace(re, data[j]);
        };
        responseDatas.push(printTemplate);
      }
      responseData(requestParameters, responseDatas.join("\n"), response);
    });
  }).on('error',
  function(e) {
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
  //如果传过来的参数类似于：sh10001,sz10002$mark_name 就需要更新或者插入书签
  content = logMarkData(requestParameters);
  requestParameters.Content = content;
  if (requestContentVal(content)) {
    if (content == "sh") {
      requestParameters.Content = "s_sh000001";
      getData(requestParameters, response, "stockGrail");
    } else if (content == "sz") {
      requestParameters.Content = "s_sz399001";
      getData(requestParameters, response, "stockGrail");
    } else if (content.match(/^sh|sz/)) {
      getData(requestParameters, response, "stoackInfo");
      //直接查上一条记录
    } else if (content.match(/^\+$/)) {
      query_dao.selectLastQueryByUserName(requestParameters.FromUserName,
      function(data) {
        if (data.length > 0) {
          requestParameters.Content = data[0].query_data;
          getData(requestParameters, response, "stoackInfo");
        } else {
          responseData(requestParameters, "找不到上一条记录", response);
        }
      });
    } else if (content.match(/^\$\$$/)) {//$$查询所有的书签
      query_dao.selectMarksByUserName(requestParameters.FromUserName,
      function(data) {
        var marks = [];
        console.log(JSON.stringify(data));
        for (var d in data) {
          data[d]=data[d]["request_marks"]
          marks.push(data[d].mark_info + "$" + data[d].mark_name);
        }
        responseData(requestParameters, (marks.length > 0 ? marks.join("\n") : "您没有书签：新增/更新书签：回复sh10001,sz10002$my;"), response);
      });
    } else if (content.match(/^\$[^\$]+$/)) {//a#my 直接查询a
      var markName = content.replace("$");
      query_dao.selectMarkQueryByUserNameAndMarkName(requestParameters.FromUserName, markName,
      function(data) {
        if (data.length > 0) {
          requestParameters.Content = data[0].mark_info;	
          getData(requestParameters, response, "stoackInfo");
        } else {
          responseData(requestParameters, "找不到名字为：" + markName + "的书签", response);
        }
      });
    } else {
      helpConsole(requestParameters, response);
    }
  } else {
    helpConsole(requestParameters, response);
  }
};
/**
 * /** 帮助
 * 
 * @param serachParameters
 * @param response
 */
function helpConsole(serachParameters, response) {
  responseData(serachParameters, "帮助：" + "1.回复sh,查看当前上证指数数据; 回复sz,查看深圳成指数;\n" + "2.直接回复股票编码,用逗号分开可以查询多个,如:sh601003,sh601001\n" + "3.新增/更新书签：回复sh10001,sz10002$my;之后，可以直接输入my进行查询\n" + "4.回复:+号，查询上一条记录\n" + "5.回复$$查看所有书签", response);
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
/**
 * 如果传过来的参数类似于：sh10001,sz10002$mark_name 就需要更新或者插入书签
 * @param requestParameters
 */
function logMarkData(requestParameters) {
  var content = String(requestParameters.Content).trim();
	if(content==="$$"){
		return content;
	}
  var markName = content.split("$").length == 2 ? content.split("$")[1] : null;
  //如果是sh000001,sz399001$mark_name，则更新或者存储记录
  if (markName) {
    query_dao.logMark({
      userName: requestParameters.FromUserName,
      markName: markName,
      makrInfo: content.split("$")[0]
    });
    return content.split("$")[0];
  }
  return content;
}
/**
 * 
 * @param content
 */
function requestContentVal(content) {
  if (content.match(/(delete|update|insert|drop|show|modify)/)) {
    return false;
  }
  return true;
}
/**
 * 
 */
function logQueryData(queryData){
	query_dao.logUserQuery({userName:queryData.userName,queryData:queryData.queryData});
}