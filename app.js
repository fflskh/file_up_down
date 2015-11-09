
var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var multer = require('multer');
var needle = require('needle');
var fs = require('fs');

//在此处定义图片的上传路径、上传格式、限制大小等参数.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd()+'/uploads');
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

app.get('/', function(req, res, next){
    res.render('index', {});
});

//single方法中的参数（head），必须与表单中的字段名相同 <input name="head" type="file">
app.post('/upload/single', upload.single('head'), function(req, res, next){
    //req.body存储form中的文字数据
    //console.log('body : ', req.body);
    //req.file存储图片属性
    //console.log(req.file);

    //传输图片到远端，使用node插件needle（若使用原生的http大体相同）
    var buffer = fs.readFileSync(req.file.path);
    var data = {
        file: {
            buffer       : buffer,
            filename     : req.file.filename,
            content_type : 'application/octet-stream'
        }
    };

    //向remote server发送图片
    needle.post('http://127.0.0.1:6000/remote/upload', data, { multipart: true }, function(err, resp, body) {
        if(err || resp.statusCode !== 200){
            if(err)
                console.error('upload to remote : ',err);
            else if(resp.statusCode)
                console.error('resp status code : ', resp.statusCode);
            res.status(500).send('图片上传成功，但提交到远端失败！');
        } else {
            res.send('上传图片，并提交到远端成功！');
        }
    });
});

//一次上传多张图片，array参数'head'必须与表单中字段名相同
//表单中有多个<input name="head" type="file">，每个input的name都相同，为head
/*app.post('/upload/multi', upload.array('head', 10), function(req, res, next){
    console.log('body : ', req.body);
    console.log(req.files);
    res.send('ok');
});*/

//一次上传多张不同名称的图片，参数name为表单中的input的name属性，maxCount为最大图片数量
/*app.post('/upload/mixed', upload.fields([{name:'head', maxCount:1}, {name:'IDCard', maxCount:1}]), function(req, res, next){
    console.log('body : ', req.body);
    console.log(req.files);
    res.send('ok');
});*/



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


server.listen(5000);
server.on('error', function(err){
  console.error(err);
});
server.on('listening', function(){
    console.log('listening on port 5000......');
});