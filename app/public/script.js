var socket = io();
var songList = document.querySelector('.song-list');
var audioPlayer = document.querySelector('.audio-player');
var currentSongLabel = document.querySelector('.current-song-label');

var uploadFileButton = document.querySelector('#upload-file-button');

socket.on('connect', function () {

  socket.on('giveLibrary', function renderLibrary (data) {
    console.log('library received');

    songsView = '';

    data.songNames.forEach(function (elem, index, array) {
      songsView += '<li class="song">' + elem + '</li>';
    });

    songList.innerHTML = songsView;

    var songs = document.querySelector('.song-list').children;

    Object.keys(songs).forEach (function (key) {
      songs[key].addEventListener('click', function (e) {
        mediaFilesDir = '/public/media/';

        audioPlayer.src = mediaFilesDir + this.textContent;
        currentSongLabel.innerHTML = 'Currently playing <br>' + this.textContent;

        socket.emit('songClicked', {
          songName : this.textContent
        }); // emit
      }); // addEventListener
    }); // forEach

  });

  uploadFileButton.addEventListener('change', function (e) {
    var file = e.target.files[0];
    var stream = ss.createStream();

    ss(socket).emit('uploadSong', stream, {name: file.name, size: file.size});
    ss.createBlobReadStream(file).pipe(stream);
  });


socket.on('disconnect', function () {
  console.log('you failed');
});

}); // on connect

socket.on('event', function () {});
socket.on('disconnect', function () {
});
