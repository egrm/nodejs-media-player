var socket = io();
var songList = document.querySelector('.song-list');
var audioPlayer = document.querySelector('.audio-player');
var currentSongLabel = document.querySelector('.current-song-label');
var uploadFileForm = document.querySelector("#upload-file-form");

var uploadFileButton = document.querySelector('#upload-file-button');
var uploadFileField = document.querySelector('#upload-field');

var loadingLabel = document.querySelector('#loading-label');

socket.on('connect', function() {

    socket.on('giveLibrary', function renderLibrary(data) {
        songsView = '';

        data.songNames.forEach(function(elem, index, array) {
            songsView += '<li class="song"><span class="song-name">' + elem + '</span></li>';
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
            // totalSize += file.size;
            if (file.type === 'audio/mp3') {
                var stream = ss.createStream();
                ss(socket).emit('uploadSong', stream, {
                    name: file.name,
                    size: file.size
                });
                var totalSize = 0;
                var blobStream = ss.createBlobReadStream(file);

                blobStream.on('data', function(chunk) {
                    totalSize += chunk.length;
                    if (blobStream._readableState.ended) {
                      loadingLabel.style.display = 'none';
                      console.log('uploaded');
                    } else {
                      loadingLabel.style.display = 'block';
                      loadingLabel.innerHTML = (Math.floor(totalSize / file.size * 100) + '%');
                    }
                });

                blobStream.pipe(stream);
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
        // upStream(e.target.files);
    });

    socket.on('disconnect', function() {
        console.log('you are disconnected');
    });

}); // on connect

socket.on('event', function() {});
socket.on('disconnect', function() {});
