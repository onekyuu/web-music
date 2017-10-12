

getMusicList(function(list){
  console.log(list)
})

function getMusicList(callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/music.json', true)
  xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
      callback(JSON.parse(this.responseText))
    }else{
      console.log('获取数据失败')
    }
  }
  xhr.send()
}