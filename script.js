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
    })

    //使用自定义事件传递专辑信息
    eventCenter.fire('select', {
      channel_id : $(this).attr('data_id'),
      channelName : $(this).attr('data_name')
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
      template += '<li class="category" data_id="'+album.channel_id+' data_name'+album.name+'">'+
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

  },
  start: function(){

  },
  event: function(){

  },
  getData: function(){
    var me = this
    $.ajax({
      url: 'https://jirenguapi.applinzi.com/fm/getSong.php',
      type: 'GET',
      dataType: 'jsonp'
    }).done(function(ret){
      console.log(ret)
    }).fail(function(){
      console.log('error')
    })
  },
  render: function(){

  }
}


var eventCenter = {
  on: function(type, handler){
    $(document).on(type, handler)
  },
  fire: function(type, data){
    $(document).trigger(type, data)
  }
}


album.init()
player.init()