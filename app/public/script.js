var socket = io();

socket.on('connect', function () {});
socket.on('event', function () {});
socket.on('disconnect', function () {});


var songs = document.querySelector('.song-list').children;

Object.keys(songs).forEach (function (key) {
  songs[key].addEventListener('click', function (e) {
    console.log(this);
  })
});
