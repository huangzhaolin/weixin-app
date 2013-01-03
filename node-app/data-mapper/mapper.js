/**
 * @authoer:zhaolinhuang create:2013-01-03
 */
/**
 * ToUserName 消息接收方微信号，一般为公众平台账号微信号 FromUserName 消息发送方微信号 CreateTime 消息创建时间
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
		PicUrl : ""
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
		MsgType : "",// 消息类型，文本消息必须填写text
		Content : "",// 消息内容，大小限制在2048字节，字段为空为不合法请求
		FromUserName : "",// 消息发送方
		ToUserName : "",// 消息接收方
		CreateTime : "",// 消息创建时间
		MsgType : "",// 消息类型，图文消息必须填写news
		Content : "",// 消息内容，图文消息可填空
		ArticleCount : "",// 图文消息个数，限制为10条以内
		Articles : "",// 多条图文消息信息，默认第一个item为大图
		Title : "",// 图文消息标题
		Description : "",// 图文消息描述
		PicUrl : "",// 图片链接，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80，限制图片链接的域名需要与开发者填写的基本资料中的Url一致
			Url :""// 点击图文消息跳转链接
	};
})();