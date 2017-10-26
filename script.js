//自定义事件
var eventCenter = {
  on: function(type, handler){
    $(document).on(type, handler)
  },
  fire: function(type, data){
    $(document).trigger(type, data)
  }
}


//专辑模块
var album = {
  init: function(){
    this.$album = $('.album')
    this.$ul = $('.album ul')
    this.$box = $('.album .box')
    this.$right = $('.album .fa-chevron-right')
    this.$left = $('.album .fa-chevron-left')
    this.isToEnd = false
    this.isToStart = true
    this.getData()
    this.event()
  },
  event: function(){
    //滚动专辑列表
    var me = this
    me.$right.on('click', function(){
      //判断动画是否执行完毕
      if(me.isAnimateFinish) return
      var liWidth = me.$ul.find('li').outerWidth(true)
      var count = Math.floor(me.$box.width()/liWidth)
      //判断是否滚动到最后
      if(!me.isToEnd){
        me.isAnimateFinish = true
        me.$ul.animate({
          left: '-='+liWidth*count
        }, 1000, function(){
          me.isToStart = false
          me.isAnimateFinish = false
          if(me.$box.width() - parseFloat(me.$ul.css('left')) >= me.$ul.width()){
            me.isToEnd = true
          }
        })
      }
    })
    me.$left.on('click', function(){
      if(me.isAnimateFinish) return
      var liWidth = me.$ul.find('li').outerWidth(true)
      var count = Math.floor(me.$box.width()/liWidth)
      if(!me.isToStart){
        me.isAnimateFinish = true
        me.$ul.animate({
          left: '+='+liWidth*count
        }, 1000, function(){
          me.isAnimateFinish = false
          me.isToEnd = false
          if(parseFloat(me.$ul.css('left')) >= 0){
            me.isToStart = true
          }
        })
      }
    })

    //添加专辑选中状态
    me.$ul.on('click', 'li', function(){
      $(this).addClass('active').siblings().removeClass('active')

      //使用自定义事件传递专辑信息
      eventCenter.fire('select', channel_id = $(this).attr('data_id'))
    })
  },
  getData: function(){
    var me = this
    $.ajax({
      url: 'https://jirenguapi.applinzi.com/fm/getChannels.php',
      type: 'GET',
      dataType: 'jsonp'
    }).done(function(ret){
      console.log(ret)
      me.createNode(ret)
    }).fail(function(){
      console.log('error')
    })
  },
  createNode: function(data){
    var me = this
    var template = ''
    data.channels.forEach(function(album){
      template += '<li class="category" data_id="'+album.channel_id+'"'+' data_name="'+album.name+'">'+
                    '<div class="pic" style="background-image:url('+album.cover_small+')">'+
                    '</div>'+
                    '<p class="title">'+album.name+'</p>'+
                  '</li>'
    })
    me.$ul.html(template)
    this.setWidth()
  },
  //设置专辑列表长度
  setWidth: function(){
    var count = this.$ul.find('li').length
    var width = this.$ul.find('li').outerWidth(true)
    this.$ul.css({
      width: count * width + 'px'
    })
  }
}

//播放器模块
var player = {
  init: function(){
    this.$play = $('.player')
    this.$main = $('main')
    this.$playBtn = $('.player').find('.control .play-btn')
    this.$volumeBtn = $('.player').find('.control .volume-btn')
    this.$like = $('.player').find('.control .collect')
    this.$time = $('.player').find('.handle .time')
    this.$totalTime = $('.player').find('.handle .total-time')
    this.$current = $('.player').find('.handle .current')
    this.audio = new Audio()
    this.audio.autoplay = true
    this.event()
  },
  event: function(){
    var me = this
    //自定义事件获取专辑信息
    eventCenter.on('select', function(e, channel_id){
      me.channelId = channel_id
      me.getData()
    })
    
    //为按钮绑定事件
    me.$play.find('.control .fa-step-forward').on('click', function(){
      me.getData()
    })
    me.$play.find('.control .fa-step-backward').on('click', function(){
      me.getData()
    })
    me.$playBtn.on('click', function(){
      if(me.$playBtn.hasClass('fa-play')){
        me.$playBtn.removeClass('fa-play').addClass('fa-pause')
        me.audio.play()
      }else{
        me.$playBtn.removeClass('fa-pause').addClass('fa-play')
        me.audio.pause()
      }
    })
    me.$volumeBtn.on('click', function(){
      if(me.$volumeBtn.hasClass('icon-jingyin')){
        me.$volumeBtn.removeClass('icon-jingyin').addClass('icon-yinliang')
      }else{
        me.$volumeBtn.removeClass('icon-yinliang').addClass('icon-jingyin')
      }
    })
    me.$like.on('click', function(){
      if(me.$like.hasClass('collected')){
        me.$like.removeClass('collected')
      }else{
        me.$like.addClass('collected')
      }
    })
    
    //绑定歌曲信息更新
    me.audio.addEventListener('play', function(){
      clearInterval(me.clock)
      me.clock = setInterval(function(){
        me.update()
      },1000)
    })
    me.audio.addEventListener('pause', function(){
      clearInterval(me.clock)
    })
    me.audio.addEventListener('end', function(){
      me.getData()
    })

  },
  getData: function(){
    var me = this
    $.ajax({
      url: 'https://jirenguapi.applinzi.com/fm/getSong.php',
      type: 'GET',
      data: {
        channel: me.channelId
      },
      dataType: 'jsonp'
    }).done(function(ret){
      me.song = ret.song[0]
      me.loadMusic(ret.song[0])
      me.update()
    }).fail(function(){
      console.log('error')
    })
  },
  loadMusic: function(songData){
    var me = this
    this.audio.src = songData.url
    this.$play.find('.handle .title').text(songData.title)
    this.$play.find('.handle .songer').text(songData.artist)
    this.$play.find('.show .img').css('background-image', 'url('+songData.picture+')')
    this.$main.find('.background').css('background-image', 'url('+songData.picture+')')
    this.$play.find('.control .play-btn').addClass('fa-pause').removeClass(' fa-play')
  },
  update: function(){
    var me = this
    var min = ''+Math.floor(me.audio.currentTime/60)
    var sec = Math.floor(me.audio.currentTime%60)+''
    min = min.length<2?'0'+min:min
    sec = sec.length<2?'0'+sec:sec
    var str = min+':'+sec
    me.$time.text(str)
    var totalMin = ''+Math.floor(me.audio.duration/60)
    var totalSec = Math.floor(me.audio.duration%60)+''
    totalMin = totalMin.length<2?'0'+totalMin:totalMin
    totalSec = totalSec.length<2?'0'+totalSec:totalSec
    console.log(me.audio.duration)
    console.log('min', totalMin)
    console.log('sec', totalSec)
    var totalStr = totalMin+':'+totalSec
    me.$totalTime.text(totalStr)
    var current = Math.floor(me.audio.currentTime/player.audio.duration*100)+'%'
    me.$current.css({width: current})
  },
  render: function(){

  }
}



album.init()
player.init()
