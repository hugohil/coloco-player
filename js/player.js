var socket = io('http://localhost:1337/');
var songs = songs || [];
var path;
var container = document.getElementById('container');
// var prev = document.getElementById('prev');
// var next = document.getElementById('next');
var play = document.getElementById('play');
var rand = document.getElementById('rand');
var songIndex = 0;
var title = document.getElementById('js-song-title');
var autoMode = true;

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
  shuffle();
});

function init(){
  shuffle();

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(songs.length){
    container.src = 'http://' + path + songs[songIndex];
  }

  play.onclick = function (){
    if(container.paused){
      container.play();
    } else {
      container.pause();
    }
  }

  rand.onclick = function (){
    changeSong();
  }

  // prev.onclick = changeSong(songIndex - 1);

  // next.onclick = changeSong(songIndex + 1);

  function changeSong (){
    var wasOnPlay = !container.paused
    // songIndex = (songIndex > songs.length - 1) ? 0 : songIndex + 1;
    songIndex++;
    if(songIndex > songs.length - 1){
      shuffle();
      songIndex = 0;
    }
    container.src = 'http://' + path + songs[songIndex];
    title.textContent = songs[songIndex];
    if(wasOnPlay){
      container.play();
    }
  }

  container.onended = function(){
    if(autoMode){
      changeSong();
    } else {
      title.textContent = null;
    }
  }

  container.onplay = function (){
    title.textContent = songs[songIndex];
  }
}

function shuffle (){
  for(var i = 0; i < songs.length; i++){
    var random = Math.round(Math.random(songs.length));
    var tmp = songs[i];
    songs[i] = songs[random];
    songs[random] = tmp;
  }
}
