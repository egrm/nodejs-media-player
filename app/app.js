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

    var songNames = fs.readdirSync(mediaFilesDir).filter(isMusicFile);

    console.log(songNames);
    socket.emit('giveLibrary', {
        songNames: songNames
    });

    var watcher = chokidar.watch('./app/media', {
        persistent: true
    });

    watcher.on('add', function(path) {
        socket.emit('giveLibrary', {
            songNames: songNames
        });
        console.log('something happened');
    });

    socket.on('songClicked', function playSong(data) {

    });

    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.id);
    });
});
