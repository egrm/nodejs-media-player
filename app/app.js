var express = require('express');
var fs = require('fs');
var app = express();
var io = require('socket.io')();

app.use('/public', express.static('./app/public'))


app.set('view engine', 'ejs');
app.set('views', './app/views/');

app.get('/', function(req, res) {

    var mediaFilesDir = './app/public/media/';
    var songNames = fs.readdirSync(mediaFilesDir)


    console.log(songNames);
    res.render('index', {
        songNames: songNames
    });
});

var server = app.listen(3000, function() {
    console.log('node music player listening on port 3000');
});

io.attach(server);

io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});
