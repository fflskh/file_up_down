
var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var needle = require('needle');
var fs = require('fs');

var app = new express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//接受图片
app.post('/remote/upload', function(req, res, next){
    var postData = '';
    req.on('data', function(chunk){
        postData += chunk;
    });
    req.on('end', function(){
        console.log('receive data over...');
    });
    console.log(postData.length);
    res.send('ok');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send('error!');
});

var server = http.createServer(app);


server.listen(6000);
server.on('error', function(err){
    console.error(err);
});
server.on('listening', function(){
    console.log('listening on port 6000......');
});