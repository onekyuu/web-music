

var channelList = []
var musicList = []
var currentIndex = 0
var musicPlay = new Audio("http://yinyueshiting.baidu.com/data2/music/ff664c9b5cdd1d0f2043d39a3454c644/265046490/2650462611508443261128.mp3")
musicPlay.autoplay = true

function $(selector){
  return document.querySelector(selector)
}
function $$(selector){
  return document.querySelectorAll(selector)
}

getChannelList(function(list){
  channelList = list
  console.log(channelList, 'channel')
  setChannels(list)
})
getMusicList(function(list){
  musicList = list
  console.log(musicList, 'music')
  setMusicList(list)
})

function getChannelList(callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://jirenguapi.applinzi.com/fm/getChannels.php', true)
  xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
      callback(JSON.parse(this.responseText))
    }else{
      console.log('获取数据失败')
    }
  }
  xhr.send()
}

function setChannels(channelObj){
  for(var i=0; i<$$('.category p').length; i++){
    $$('.category p')[i].innerText = channelObj.channels[i].name
    $$('.category p')[i].className = channelObj.channels[i].channel_id
  }
}
function getMusicList(callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://jirenguapi.applinzi.com/fm/getSong.php', true)
  xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304){
      callback(JSON.parse(this.responseText))
    }else{
      console.log('获取数据失败')
    }
  }
  xhr.send()
}
function loadMusic(musicObj){
  // var src = /musicObj.url/
  musicPlay.src = "http://yinyueshiting.baidu.com/data2/music/ff664c9b5cdd1d0f2043d39a3454c644/265046490/2650462611508443261128.mp3"
  
}
function setMusicList(musicObj){

}