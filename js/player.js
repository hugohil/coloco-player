var socket = io('http://localhost:1337/');
var player = io('http://localhost:1337/player');
var songs = songs || [];
var randomized = [];
var path;
var container = document.getElementById('container');
var title = document.getElementById('js-song-title');
var songIndex = 0;
var autoMode = true;
var randomMode = false;
var currentSong;

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
  currentSong = songs[songIndex];
  if(songs.length){
    container.src = 'http://' + path + currentSong;
  }

  player.on('change-state', function (){
    console.log('change-state');
    if(container.paused){
      container.play();
    } else {
      container.pause();
    }
  })

  player.on('change-song', function (direction){
    console.log('change-song');
    switch(direction){
      case 'prev':
        changeSong('prev');
        break;
      case 'next':
        changeSong('next');
        break;
      default:
        break;
    }
  })

  player.on('switch-random', function(){
    randomMode = !randomMode;
    if(randomMode){
      shuffle();
    }
  })

  player.on('switch-auto', function(){
    autoMode = !autoMode;
  })

  function changeSong (direction){
    var wasOnPlay = !container.paused;
    switch(direction){
      case 'prev':
        songIndex = (songIndex - 1 < 0) ? songs.length - 1 : songIndex - 1;
        break;
      case 'next':
        songIndex = (songIndex + 1 > songs.length - 1) ? 0 : songIndex + 1;
        break;
    }
    currentSong = randomMode ? songs[randomized[songIndex]] : songs[songIndex];
    container.src = 'http://' + path + currentSong;
    title.textContent = currentSong;
    if(wasOnPlay){
      container.play();
    }
  }

  container.onended = function(){
    if(autoMode){
      changeSong('next');
    } else {
      title.textContent = null;
    }
  }

  container.onplay = function (){
    title.textContent = currentSong;
  }
}

function shuffle (){
  for(var i = 0; i < songs.length; i++){
    randomized[i] = i;
  }
  for(var i = 0; i < songs.length; i++){
    var random = Math.round(Math.random(randomized.length));
    var tmp = randomized[i];
    randomized[i] = randomized[random];
    randomized[random] = tmp;
  }
}
