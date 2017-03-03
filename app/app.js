var express = require('express');
var fs = require('fs');
var app = express();
var io = require('socket.io')();
var chokidar = require('chokidar');

app.use('/public', express.static('./app/public'))


app.set('view engine', 'ejs');
app.set('views', './app/views/');

app.get('/', function(req, res) {
    res.render('index');
});

var server = app.listen(3000, function() {
    console.log('node music player listening on port 3000');
});

function isMusicFile(filename) {
    if (/^\.\w+$/.test(filename)) {
        return false
    } else {
        return true;
    }
};

io.attach(server);

io.on('connection', function(socket) {
    console.log('user connected: ' + socket.id);
    var mediaFilesDir = './app/media/';

    var watcher = chokidar.watch(mediaFilesDir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.on('all', function (event, path) {
      var songNames = fs.readdirSync(mediaFilesDir).filter(isMusicFile);
      socket.emit('giveLibrary', {
        songNames : songNames
      });
    });

    socket.on('songClicked', function playSong(data) {
      console.log('song clicked');
    });

    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.id);
    });
});
