/**
 * Module dependencies.
 */
require('utils');
require('./dao/data-access.js');
var express = require('express'), routes = require('./routes/routers.js'), http = require('http'), logger = require('./logger.js');
var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'html');
	app.engine(".html", require('ejs').__express);
	app.use(express.favicon());
	app.use(function(req, res, next) {
		logger.custom('access', 'from:' + req.ip + ' -> ' + req.originalUrl
				+ ' - ' + res.statusCode);
		next();
	});
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret : 'keyboard cat'
	}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

/*
 * app.get('*', function(req, res, next) { console.log(req.body); next(); });
 */

app.post('/stock.htm', routes.stock);

app.get('/stock.htm', routes.stock);

/*
 * app.get('/stock.htm', function(req,res){ var signature
 * =req.param("signature"); var timestamp=req.param("timestamp"); var nonce
 * =req.param("nonce"); var echostr=req.param("echostr"); console.log(echostr);
 * res.send(echostr); });
 */
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
