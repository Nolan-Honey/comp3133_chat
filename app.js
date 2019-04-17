var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var bParser = require('body-parser')
var port = process.env.PORT || 5000;
require('./socketManager/socket')(io);

mongoose.Promise = global.Promise;
//db connection
mongoose.connect('mongodb://chat:admin123@ds048368.mlab.com:48368/chat', { useNewUrlParser: true }, (e)=> {

    if (e){
        console.log(e);
    }
    else {
        console.log('db is connected...');
    }
});

app.use(bParser.urlencoded({ extended: true }));
app.use(bParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/chats', require('./routes/chats'));
app.use('/', require('./routes/index'));
app.use('/', require('./routes/rooms'));

//port connection
server.listen(port, function(){
    console.log('Listening on' + port);
});