# web-music音乐网站
### 一、简介
本项目使用面向对象方法，通过jQuery实现以下功能：
* 初始化时随机播放音乐 
* 在专辑栏展示由API获取的专辑信息
* 点击任意专辑即可随机播放本专辑下歌曲
* 上一曲、下一曲、暂停/播放、音量调节功能均可使用
* 展示当前音乐总时长及当前时间，拖动进度条可改变当前播放时间
* 展示歌词
### 二、设计思路
* 音乐网站分为两个主要的功能区块：占页面主要部分的播放展示及控制区块；展示专辑列表的底部专辑区块
1. 专辑区块负责展示由API接口所获取的专辑信息，包括专辑名及专辑封面，还有专辑显示的左右切换
2. 播放展示及控制区块负责展示歌曲信息，包括歌曲封面、歌名、歌手以及歌词，另一方面负责对歌曲的操作：上一曲、下一曲、暂停/播放及控制音量
* 本项目使用面向对象的编程思想，按照功能创建了album及player两个重要的对象
1. album对象中包含了功能不同的函数：init函数用于初始化，event函数用于绑定事件，getData函数用于获取数据，createNode函数在HTML中创建DOM节点，setWidth函数用于设置专辑列表长度。
2. player对象中各个函数的作用：init函数-初始化，event函数-绑定事件，playInit函数-播放音乐初始化，getData函数-获取数据，loadMusic函数-展示音乐信息，loadLyric函数-获取歌词，update函数-更新进度条及播放时间，setLyric函数-展示歌词
3. 两个功能区块间互不干扰，但是由于播放用户点击的专辑中的歌曲时需要获取用户点击的专辑ID，所以使用eventCenter自定义事件，实现功能模块间的信息传递
### 三、效果展示
![](https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/web-music/show.png)
### 四、难点&问题&解决
##### 1.专辑栏滚动功能
1. * 专辑栏由AJAX获取数据后通过操作DOM节点创建在页面上，通过CSS设置浮动使各个专辑横向排列，但其父元素宽度无法确定会导致超出父元素宽度的部分换行继续排列
   * 解决办法：通过JS根据获取元素的多少以及每个元素的 ``` outerWidth() ```获取元素包含边距的宽度设置父元素宽度
2. * 判断专辑栏是否滚动到最后或是否处于开始位置
   * 解决办法：由于滚动通过设置 ``` animate() ``` 的 ``` left ``` 属性实现，因此只需要判断滚动的长度+当前的显示区域的宽度是否大于等于所有元素的总长度，若是则已经滚动到底部，否则就没有
3. * 当前显示区域未必能完整地显示所有元素，常见的情况是最右侧的元素会被截断，只有部分显示出来，当滚动到下页时最左侧只显示上一页没有显示的部分 
![](https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/web-music/album1.png)
![](https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/web-music/album2.png)
   * 解决办法：计算得到当前显示区所显示的完整元素个数，每次滚动只滚动完整元素的总长度，当前显示不完整的元素就可以完整的显示在下一页的开始
##### 2.专辑模块与播放模块的信息交互
* 由于播放模块需要用户点击专辑元素后播放本专辑下的歌曲，基于API接口的要求，需要将专辑的 ``` channel_id ``` 传递给播放模块，播放模块在请求歌曲数据时将 ``` channel_id ``` 作为数据发送
* 解决办法：使用jQuery自定义事件
   ``` 
    var eventCenter = {
      on: function(type, handler){
        $(document).on(type, handler)
      },
      fire: function(type, data){
        $(document).trigger(type, data)
      }
    }
   ```
##### 3.播放模块
1. * 播放模块按钮交互
   * 此部分功能多由监听``` click ```事件触发，由于之前音乐播放器的工作，在此不再赘述
2. * 歌词显示
   * 通过AJAX获取的歌词是一个对象![](https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/web-music/lyric.png)此对象中包含三个属性：歌词、曲名以及歌曲ID，而歌词部分对应的值为一串字符串，因此通过字符串的操作以及正则表达式可以将lyric拆分组合为只包含时间数字和只包含歌词的两个数组，再将两个数组组合为以时间为key，以歌词为value的对象![](https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/web-music/lyric1.png)在拼接DOM时就可以通过当前播放时间调用歌词并显示
### 五、总结
本项目作为不存在滚动条的全屏单页web应用，适用于大屏展示，在项目实现过程中，综合了之前完成的音乐播放器的成果，完成了更多的效果，在这个过程中加强了对面向对象编程思想的理解，更熟练了对jQuery的使用，其中还涉及到CSS的flex布局、JS基本操作、正则表达式等的使用。由于本人仍在学习过程中，难免出现一些问题，如果您有意见或建议，还请不吝赐教:)
