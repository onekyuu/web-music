function $$(selector) {
  return document.querySelector(selector)
}
if(localStorage.getItem('id')){
  $$('header .login-list').style.display = 'none'
  $$('header .user').style.display = 'none'
}

$$('header .user').onclick = function () {
  $$('.modal').style.display = 'block'
}
$$('.close').onclick = function () {
  $$('.modal').style.display = 'none'
}
$$('header .login-list').onclick = function () {
  $$('.modal').style.display = 'block'
}
$$('.modal').addEventListener('click', function (e) {
  if (e.target.classList.contains('switch-login')) {
    $$('.modal').classList.remove('register')
    $$('.modal').classList.add('login-modal')
  }
  if (e.target.classList.contains('switch-register')) {
    $$('.modal').classList.remove('login-modal')
    $$('.modal').classList.add('register')
  }
})

//自定义事件
var eventCenter = {
  on: function (type, handler) {
    $(document).on(type, handler)
  },
  fire: function (type, data) {
    $(document).trigger(type, data)
  }
}

var login = {
  init: function () {
    this.$modal = $('.modal')
    this.$login = $('.login-button')
    this.$user = $('.login .user')
    this.$loginUsername = $('.login-username')
    this.$loginPassword = $('.login-password')
    this.$register = $('.register-button')
    this.$registerUsername = $('.register-username')
    this.$registerPassword = $('.register-password')
    this.$registerConfirm = $('.register-confirm')
    // this.hasUser = false
    this.initAV()
    this.signin()
    this.signup()
  },

  initAV: function () {
    var APP_ID = 'Qsgz21PTwAPK3gt3N8QuYfjy-gzGzoHsz'
    var APP_KEY = 'MAnz2LBdRUgtfQLmjPmRl3xx'

    AV.init({
      appId: APP_ID,
      appKey: APP_KEY
    })
  },

  signin: function () {
    var me = this;
    var data = {}
    
    me.$login.on('click', function (e) {
      data.username = me.$loginUsername.val()
      data.password = me.$loginPassword.val()
      e.preventDefault()
      var query = new AV.Query('Users');
      query.find().then((users) => {
        users.map((user) => {
          if (user.attributes.username === data.username) {
            if (user.attributes.password === data.password) {
              localStorage.setItem('id', user.id)
              me.$modal.hide();
              me.$user.hide();
              album.init()
            }else{
              alert('密碼錯誤')
              return;
            }
          }
        })
      })
    })
  },

  signup: function () {
    var me = this;
    var data = {};
    me.$register.on('click', function () {
      data.username = me.$registerUsername.val();
      data.password = me.$registerPassword.val();
      data.registerConfirm = me.$registerConfirm.val();
      if(!data.username) {
        alert('用戶名不能為空')
        return
      }
      if(!data.password) {
        alert('密碼不能為空')
        return
      }
      if(!data.registerConfirm) {
        alert('確認密碼不能為空')
        return
      }
      var query = new AV.Query('Users');
      query.find().then((users) => {
        if(!users){
          var Users = AV.Object.extend('Users');
          var user = new Users();
          user.set('username', data.username);
          user.set('password', data.password);
          user.save().then(function (user) {
            alert('註冊成功')
            me.$modal.classList.remove('register')
            me.$modal.classList.add('login-modal')
          }, function (error) {
            // 异常处理
            console.error('Error');
          });
        }
        users.map((user) => {
          if (user.attributes.username === data.username) {
            alert('此用戶名已被占用')
            return;
          }
        })
      })
      if (data.password !== data.registerConfirm) {
        alert('两次输入的密码不相同');
        return;
      } else {
        var Users = AV.Object.extend('Users');
        var user = new Users();
        user.set('username', data.username);
        user.set('password', data.password);
        user.save().then(function (user) {
          // me.$modal.classList.remove('register')
          // me.$modal.classList.add('login-modal')
          alert('註冊成功')
        }, function (error) {
          // 异常处理
          console.error('Error');
        });
      }
    })
  }
}

//专辑模块
var album = {
  init: function () {
    this.$album = $('.album')
    this.$mAlbum = $('.m-album')
    this.$ul = $('.album ul')
    this.$mUl = $('.m-album ul')
    this.$box = $('.album .box')
    this.$mBox = $('.m-album .box')
    this.$right = $('.album .fa-chevron-right')
    this.$left = $('.album .fa-chevron-left')
    this.isToEnd = false
    this.isToStart = true
    this.getData()
    this.event()
  },
  event: function () {
    //滚动专辑列表
    var me = this
    me.$right.on('click', function () {
      //判断动画是否执行完毕
      if (me.isAnimateFinish) return
      var liWidth = me.$ul.find('li').outerWidth(true)
      var count = Math.floor(me.$box.width() / liWidth)
      //判断是否滚动到最后
      if (!me.isToEnd) {
        me.isAnimateFinish = true
        me.$ul.animate({
          left: '-=' + liWidth * count
        }, 1000, function () {
          me.isToStart = false
          me.isAnimateFinish = false
          if (me.$box.width() - parseFloat(me.$ul.css('left')) >= me.$ul.width()) {
            me.isToEnd = true
          }
        })
      }
    })
    me.$left.on('click', function () {
      if (me.isAnimateFinish) return
      var liWidth = me.$ul.find('li').outerWidth(true)
      var count = Math.floor(me.$box.width() / liWidth)
      if (!me.isToStart) {
        me.isAnimateFinish = true
        me.$ul.animate({
          left: '+=' + liWidth * count
        }, 1000, function () {
          me.isAnimateFinish = false
          me.isToEnd = false
          if (parseFloat(me.$ul.css('left')) >= 0) {
            me.isToStart = true
          }
        })
      }
    })

    //添加专辑选中状态
    me.$ul.on('click', 'li', function () {
      $(this).addClass('active').siblings().removeClass('active')

      //使用自定义事件传递专辑信息
      eventCenter.fire('select', channel_id = $(this).attr('data_id'))
    })
    me.$mUl.on('click', 'li', function () {
      $(this).addClass('active').siblings().removeClass('active')

      //使用自定义事件传递专辑信息
      eventCenter.fire('select', channel_id = $(this).attr('data_id'))
    })
  },
  getData: function () {
    var me = this;
    $.ajax({
      url: '//jirenguapi.applinzi.com/fm/getChannels.php',
      type: 'GET',
      dataType: 'jsonp'
    }).done(function (ret) {
      me.createNode(ret)
    }).fail(function () {
      console.log('error')
    })
  },
  createNode: function (data) {
    var me = this
    var template = ''
    var id = localStorage.getItem('id')
    if (id) {
      data.channels.unshift({
        channel_id: 'shoucang',
        name: '我的收藏',
        cover_small: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-small',
        cover_middle: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-middle',
        cover_big: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-big',
      })
    }
    data.channels.forEach(function (album) {
      template += '<li class="category" data_id="' + album.channel_id + '"' + ' data_name="' + album.name + '">' +
        '<div class="pic" style="background-image:url(' + album.cover_small + ')">' +
        '</div>' +
        '<p class="title">' + album.name + '</p>' +
        '</li>'
    })
    me.$ul.html(template)
    me.$mUl.html(template)
    this.setWidth()
  },
  //设置专辑列表长度
  setWidth: function () {
    var count = this.$ul.find('li').length
    var width = this.$ul.find('li').outerWidth(true)
    this.$ul.css({
      width: count * width + 'px'
    })
  }
}

//播放器模块
var player = {
  init: function () {
    this.$header = $('header')
    this.$play = $('.player')
    this.$mContainer = $('.disc-container')
    this.$m_cover = $('.disc-container').find('.m-cover')
    this.$main = $('main')
    this.$playBtn = $('.player').find('.control .play-btn')
    this.$like = $('.player').find('.control .collect')
    this.$time = $('.player').find('.handle .time')
    this.$totalTime = $('.player').find('.handle .total-time')
    this.$progress = $('.player').find('.handle .bar')
    this.$current = $('.player').find('.handle .current')
    this.$volume = $('.player').find('.show-pic .volume-control .volume')
    this.$volumeBtn = $('.player').find('.show-pic .volume-control .volume-btn')
    this.audio = new Audio()
    this.audio.autoplay = true
    this.$volumeNow = 0.5
    this.playInit()
    this.event()
  },
  event: function () {
    var me = this
    //自定义事件获取专辑信息
    eventCenter.on('select', function (e, channel_id) {
      me.channelId = channel_id
      me.getData()
    })

    //为按钮绑定事件
    me.$play.find('.control .fa-step-forward').on('click', function () {
      me.getData()
    })
    me.$play.find('.control .fa-step-backward').on('click', function () {
      me.getData()
    })
    me.$playBtn.on('click', function () {
      if (me.$playBtn.hasClass('fa-play')) {
        me.$playBtn.removeClass('fa-play').addClass('fa-pause')
        me.audio.play()
      } else {
        me.$playBtn.removeClass('fa-pause').addClass('fa-play')
        me.audio.pause()
      }
    })
    me.$like.on('click', function () {
      if (me.$like.hasClass('collected')) {
        me.$like.removeClass('collected')
      } else {
        me.$like.addClass('collected')
      }
    })
    me.$mContainer.on('click', function () {
      if (me.audio.paused) {
        me.audio.play()
        $('.pause').removeClass('pausing')
        $('.disc-container').addClass('playing')
      } else {
        me.audio.pause()
        $('.pause').addClass('pausing')
        $('.disc-container').removeClass('playing')
      }
    })

    // audio.oncanplay = function(){
    //   $('.disc-container').addClass('playing')
    // }
    // 
    // $('.cover').attr("src", cover)
    // setInterval(()=>{
    //   let time = audio.currentTime
    //   setLyric(time)
    // }, 500)

    //绑定歌曲信息更新
    me.audio.addEventListener('play', function () {
      clearInterval(me.clock)
      me.clock = setInterval(function () {
        me.update()
      }, 1000)
    })
    me.audio.addEventListener('pause', function () {
      clearInterval(me.clock)
    })
    me.audio.addEventListener('ended', function () {
      me.getData()
    })
    //控制进度条
    me.$progress.on('click', function (e) {
      me.$current.css('width', e.offsetX + 'px')
      me.audio.currentTime = e.offsetX / me.$progress.width() * me.audio.duration
    })
    //音量控制
    me.$volume.on('click', function (e) {
      me.$volumeNow = e.offsetX / me.$volume.width()
      me.$volume.find('.volume-now').css('width', e.offsetX + 'px')
      me.audio.volume = me.$volumeNow
    })
    me.$volumeBtn.on('click', function () {
      if (me.$volumeBtn.hasClass('icon-jingyin')) {
        me.$volumeBtn.removeClass('icon-jingyin').addClass('icon-yinliang')
        me.audio.volume = me.$volumeNow
        me.$volume.find('.volume-now').css('width', me.$volumeNow * me.$volume.width() + 'px')
      } else {
        me.$volumeBtn.removeClass('icon-yinliang').addClass('icon-jingyin')
        me.audio.volume = 0
        me.$volume.find('.volume-now').css('width', 0)
      }
    })
  },
  playInit: function () {
    var me = this
    me.audio.volume = 0.5
    me.getData()
    me.audio.oncanplay = function () {
      $('.disc-container').addClass('playing')
    }
  },
  getData: function () {
    var me = this
    $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php', {
        channel: me.channelId
      })
      .done(function (ret) {
        me.loadMusic(ret.song[0])
        me.loadLyric(ret.song[0].sid)
        me.update()
      }).fail(function () {
        console.log('error')
      })
  },
  loadMusic: function (songData) {
    var me = this
    this.audio.src = songData.url
    this.$play.find('.handle .title').text(songData.title)
    this.$play.find('.handle .songer').text(songData.artist)
    this.$header.find('.details .title').text(songData.title)
    this.$header.find('.details .songer').text(songData.artist)
    this.$play.find('.show-pic .img').css('background-image', 'url(' + songData.picture + ')')
    this.$main.find('.background').css('background-image', 'url(' + songData.picture + ')')
    this.$play.find('.control .play-btn').addClass('fa-pause').removeClass(' fa-play')
    // $('.bg').css("background-image", "url("+"'"+cover+"'"+")")
    this.$m_cover.attr("src", songData.picture)
  },
  loadLyric: function (sid) {
    var me = this
    $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php', {
        sid: sid
      })
      .done(function (ret) {
        console.log(ret)
        me.lyricObj = {}
        var lyricStr = ret.lyric.split('\n')
        lyricStr.forEach(function (line) {
          var times = line.match(/\d{2}:\d{2}/g)
          var str = line.replace(/\[.+?\]/g, '')
          str = str.replace(/by 饥人谷/g, '')
          if (Array.isArray(times)) {
            times.forEach(function (time) {
              me.lyricObj[time] = str
            })
          }
        })
      }).fail(function () {
        console.log('error')
      })
  },
  update: function () {
    var me = this
    var min = '' + Math.floor(me.audio.currentTime / 60)
    var sec = Math.floor(me.audio.currentTime % 60) + ''
    min = min.length < 2 ? '0' + min : min
    sec = sec.length < 2 ? '0' + sec : sec
    var str = min + ':' + sec
    me.$time.text(str)
    var totalMin = '' + Math.floor((me.audio.duration || 0) / 60)
    var totalSec = Math.floor((me.audio.duration || 0) % 60) + ''
    totalMin = totalMin.length < 2 ? '0' + totalMin : totalMin
    totalSec = totalSec.length < 2 ? '0' + totalSec : totalSec
    var totalStr = totalMin + ':' + totalSec
    me.$totalTime.text(totalStr)
    var current = Math.floor(me.audio.currentTime / player.audio.duration * 100) + '%'
    me.$current.css({
      width: current
    })
    me.setLyric(str)
  },
  setLyric: function (time) {
    var me = this
    var lyricStr = me.lyricObj[time]
    if (lyricStr) {
      me.$play.find('.handle .lyrics .lyric').text(lyricStr)
    }
  }
}

login.init()
album.init()
player.init()