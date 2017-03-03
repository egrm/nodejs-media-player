var socket = io();
var songs = document.querySelector('.song-list').children;

socket.on('connect', function () {

  Object.keys(songs).forEach (function (key) {
    songs[key].addEventListener('click', function (e) {

      socket.emit('playSong', {
        songName : this.textContent
      })
    })
  });
});

socket.on('event', function () {});
socket.on('disconnect', function () {});
