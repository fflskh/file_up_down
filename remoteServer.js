
var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var needle = require('needle');
var multer = require('multer');
var fs = require('fs');

//在此处定义图片的上传路径、上传格式、限制大小等参数.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd()+'/remote-uploads');
    },
    filename: function (req, file, cb) {
        var postfix = file.mimetype.split('/')[1];
        if(postfix)
            cb(null, file.fieldname + '.' + postfix);
        else
            cb(null, file.fieldname);
    }
});
var upload = multer({storage : storage});

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
app.post('/remote/upload', upload.single('head'), function(req, res, next){
    console.log(req.file);
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


server.listen(7000);
server.on('error', function(err){
    console.error(err);
});
server.on('listening', function(){
    console.log('listening on port 7000......');
});