var album = {
  init: function(){
    this.$ul = $('.album ul')
    this.getData()
  },
  start: function(){

  },
  event: function(){

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
      template += '<li class="category" data_name="'+album.channel_id+'">'+
                    '<div class="pic" style="background-image:url('+album.cover_small+')">'+
                    '</div>'+
                    '<p class="title">'+album.name+'</p>'+
                  '</li>'
    })
    me.$ul.html(template)
    this.render()
  },
  render: function(){
    var count = this.$ul.find('li').length
    var width = this.$ul.find('li').outerWidth(true)
    this.$ul.css({
      width: count * width + 'px'
    })
  }
}


var player = {
  init: function(){

  },
  start: function(){

  },
  event: function(){

  },
  getData: function(){

  },
  render: function(){

  }
}


album.init()
player.init()