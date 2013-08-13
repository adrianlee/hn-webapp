var express = require('express'),
  http = require('http'),
  path = require('path');

var app = express();

// all environments
app.set('port', process.argv[2] || 3000);
app.use(express.favicon());
app.use(express.errorHandler());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + "/app"));
app.use(function (req, res) {
  res.sendfile(__dirname + "/app/index.html");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});