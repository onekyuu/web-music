

var musicList = []
var currentIndex = 0

function $(selector){
  return document.querySelector(selector)
}
function $$(selector){
  return document.querySelectorAll(selector)
}

getMusicList(function(list){
  musicList = list
  console.log(musicList)
  setChannels(list)
})

function getMusicList(callback){
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

function setChannels(musicObj){
  console.log(musicObj)
  for(var i=0; i<$$('.category p').length; i++){
    $$('.category p')[i].innerText = musicObj.channels[i].name
    $$('.category p')[i].className = musicObj.channels[i].channel_id
  }
}