

var xhr = new XMLHttpRequest()
xhr.open('GET', '/music.json', true)
xhr.onload = function(){
  if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
    console.log(this.responseText)
  }else{
    console.log('获取数据失败')
  }
}
xhr.send()