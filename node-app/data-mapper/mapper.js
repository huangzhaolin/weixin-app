/**
 * @authoer:jolin.huang 2013-01-03
 */
/**
 * ToUserName 消息接收方微信号一般为公众平台账号微信号 FromUserName 消息发送方微信号 CreateTime 消息创建时间
 * MsgType 文本消息为text Content 消息内容 地理位置为location Location_X 地理位置纬度 Location_Y
 * 地理位置经度 Scale 地图缩放大小 Label 地理位置信息
 */
exports.requestParameters = (function() {
	return {
		ToUserName : "",
		FromUserName : "",
		CreateTime : "",
		MsgType : "",
		Content : "",
		MsgType : "",
		Location_X : "",
		Location_Y : "",
		Scale : "",
		Label : "",
		PicUrl : "",
		Music:{
			Title:"",
			Description:"",
			MusicUrl:"",
			HQMusicUrl:""
		},
	};
})();
/**
 * 返回给微信服务器
 */
exports.responseParameters = (function() {
	return {
		FromUserName : "",// 消息发送方
		ToUserName : "",// 消息接收方
		CreateTime : "",// 消息创建时间
		MsgType : "",// 消息类型文本消息必须填写text
		Content : "",// 消息内容大小限制在2048字节字段为空为不合法请求
		FromUserName : "",// 消息发送方
		ToUserName : "",// 消息接收方
		CreateTime : "",// 消息创建时间
		MsgType : "",// 消息类型图文消息必须填写news
		Music:{
			Title:"",
			Description:"",
			MusicUrl:"",
			HQMusicUrl:""
		},
		Content : "",// 消息内容图文消息可填空
		ArticleCount : "",// 图文消息个数限制为10条以内
		Articles : "",// 多条图文消息信息默认第一个item为大图
		Title : "",// 图文消息标题
		Description : "",// 图文消息描述
		PicUrl : "",// 图片链接支持JPG、PNG格式较好的效果为大图640*320小图80*80限制图片链接的域名需要与开发者填写的基本资料中的Url一致
		Url : ""// 点击图文消息跳转链接
	};
})();
/**
 * 新浪接口的数据格式
 */
exports.sinaStockMapper = {
	"stoackInfo" : {
		dataMapper : {
			'0' : '股票名字',
			'1' : '今日开盘价',
			'2' : '昨日收盘价',
			'3' : '当前价格',
			'4' : '今日最高价',
			'5' : '今日最低价',
			'6' : '竞买价',
			'7' : '竞卖价',
			'8' : '成交的股票数',
			'9' : '成交金额',
			'10' : '买一量',
			'11' : '买一',
			'12' : '买二量',
			'13' : '买二',
			'14' : '买三量',
			'15' : '买三',
			'16' : '买四量',
			'17' : '买四',
			'18' : '买五量',
			'19' : '买五',
			'20' : '卖一量',
			'21' : '卖一',
			'22' : '卖二量',
			'23' : '卖二',
			'24' : '卖三量',
			'25' : '卖三',
			'26' : '卖四量',
			'27' : '卖四',
			'28' : '卖五量',
			'29' : '卖五',
			'30' : '日期',
			'31' : '时间'
		},
		printTemplate :(function(){
			 return "日期:#日期# #时间# 股票名字:#股票名字#\n" + "今日开盘价:#今日开盘价#\n"
				+ "昨日收盘价:#昨日收盘价#\n" + "当前价格:#当前价格#\n" + "今日最高价:#今日最高价#\n"
				+ "今日最低价:#今日最低价#\n" + "竞买价:#竞买价# 竞卖价:#竞卖价#\n"
				+ "成交的股票数:#成交的股票数#\n" + "成交金额:#成交金额#\n"
				+ "买入  买入量    卖出  卖出量  \n" + "#买一# #买一量# #卖一# #卖一量#\n"
				+ "#买二# #买二量# #卖二# #卖二量#\n" + "#买三# #买三量# #卖三# #卖三量#\n"
				+ "#买四# #买四量# #卖四# #卖四量#\n" + "#买五# #买五量# #卖五# #卖五量#";
		})()
	},
	"stockGrail" : {
		dataMapper : {
			"0" : "指数名称",
			"1" : "当前点数",
			"2" : "当前价格",
			"3" : "涨跌率",
			"4" : "成交量",
			"5" : "成交额"
		},
		printTemplate : (function(){return "#指数名称#\n" +
				"当前点数:#当前点数#\n" +
				"当前价格:#当前价格#\n" +
				"涨跌率:#涨跌率#\n" +
				"成交量(手):#成交量#\n" +
				"成交额(万元):#成交额#";})()
	}
};
