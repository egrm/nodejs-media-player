var express = require('express');
var fs = require('fs');
var app = express();
var io = require('socket.io')();
var ss = require ('socket.io-stream');
var path = require('path');
var chokidar = require('chokidar');

app.use('/public', express.static(__dirname + '/public'))

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');

app.get('/', function(req, res) {
    res.render('index');
});

var server = app.listen(app.get('port'), function() {
    console.log('node music player listening on port ' + app.get('port'));
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
    var mediaFilesDir = __dirname + '/public/media/';

    var watcher = chokidar.watch(mediaFilesDir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    ss(socket).on('uploadSong', function (stream, data) {
      var filename = mediaFilesDir + path.basename(data.name);
      stream.pipe(fs.createWriteStream(filename));
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
