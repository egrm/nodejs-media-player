var socket = io();
var songList = document.querySelector('.song-list');
var audioPlayer = document.querySelector('.audio-player');
var currentSongLabel = document.querySelector('.current-song-label');
var uploadFileForm = document.querySelector("#upload-file-form");

var uploadFileButton = document.querySelector('#upload-file-button');
var uploadFileField = document.querySelector('#upload-field');

socket.on('connect', function() {

    socket.on('giveLibrary', function renderLibrary(data) {
        console.log('library received');

        songsView = '';

        data.songNames.forEach(function(elem, index, array) {
            songsView += '<li class="song">' + elem + '</li>';
        });

        songList.innerHTML = songsView;

        var songs = document.querySelector('.song-list').children;

        Object.keys(songs).forEach(function(key) {
            songs[key].addEventListener('click', function(e) {
                mediaFilesDir = '/public/media/';

                audioPlayer.src = mediaFilesDir + this.textContent;
                currentSongLabel.innerHTML = 'Currently playing <br>' + this.textContent;

                socket.emit('songClicked', {
                    songName: this.textContent
                }); // emit
            }); // addEventListener
        }); // forEach

    });

    function FileDragHover(e) {
        e.preventDefault();
        e.target.className = (e.type === 'dragover' ? 'hover' : '');
    }

    function upStream(files) {
        // var file = e.target.files[0];
        Object.keys(files).forEach(function(key) {
            var file = files[key];
            if (file.type === 'audio/mp3') {
              var stream = ss.createStream();
              ss(socket).emit('uploadSong', stream, {
                  name: file.name,
                  size: file.size
              });
              ss.createBlobReadStream(file).pipe(stream);
            }
        });
    }

    uploadFileField.addEventListener('dragover', FileDragHover);
    uploadFileField.addEventListener('dragleave', FileDragHover);
    uploadFileField.addEventListener('drop', FileDragHover);

    uploadFileForm.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        upStream(e.dataTransfer.files);
    });

    uploadFileForm.addEventListener('change', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(e);
        upStream(e.target.files);
    });

    socket.on('disconnect', function() {
        console.log('you failed');
    });

}); // on connect

socket.on('event', function() {});
socket.on('disconnect', function() {});
