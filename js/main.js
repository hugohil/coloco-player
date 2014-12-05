var socket = io('http://localhost:1337/');
var songs = songs || [];
var path;
var container = document.getElementById('container');
var prev = document.getElementById('prev');
var next = document.getElementById('next');
var play = document.getElementById('play');
var songIndex = 0;

socket.on('set-dir', function(dir){
  path = dir;
});

socket.on('set-library', function (library){
  for(var i = 0; i < library.length; i++){
    songs.push(library[i]);
  }
  init();
});

socket.on('new-song', function (song){
  songs.push(song);
});

function init(){
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(songs.length){
    container.src = 'http://' + path + songs[songIndex];
  }
  // container.controls = true; // this doesn't work on chrome !

  play.onclick = function (){
    if(container.paused){
      container.play();
    } else {
      container.pause();
    }
  }

  prev.onclick = function (){
    var wasOnPlay = !container.paused;
    songIndex--;
    if(songIndex < 0){
      songIndex = songs.length - 1;
    }
    container.src = 'http://' + path + songs[songIndex];
    if(wasOnPlay){
      container.play();
    }
  }

  next.onclick = function (){
    var wasOnPlay = !container.paused;
    songIndex++;
    if(songIndex > songs.length - 1){
      songIndex = 0;
    }
    container.src = 'http://' + path + songs[songIndex];
    if(wasOnPlay){
      container.play();
    }
  }

  container.onended = function(){
    if(songs.length){
      next.click();
    }
  }
}