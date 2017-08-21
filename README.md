## 基于html5<audio>的网页音乐播放器

> ![效果图](https://www.166zx.com/static/img/music_ui.png)

> [demo](https://www.166zx.com/ "demo")

## 需要

- vue ^2.3.3
- vue-resource ^1.3.4
- v-click-outside ^0.0.8

## 下载
npm

	npm install vue-music --save

## 使用

	<template>
	  <div id="app">
	    <Music></Music>
	  </div>
	</template>
	<script>
	import Music from 'vue-music'
	export default {
	  name: 'app',
	  components: {
	    Music
	  }
	}
	</script>

## 功能要点

vue实例监听变化的数据，再通过music对象进行具体的dom操作。

- 播放/暂停，上一首，下一首

播放/暂停：

> 通过监听一个开关，这里叫做**audioToggle**，去布尔值进行播放与暂停的判断

上/下一首：

> 通过一个play()函数，执行播放，通过传入的参数(随机播放，列表播放，单曲循环)判断**播放模式**

> 单曲循环和随机播放比较容易，不需要判断方向，即是上一首还是下一首

> 列表循环需要判断一下**上一首还是下一首**


- 实时进度

这里采用监听html5的一个audio事件**timeupdate**来实时返回播放的进度，进度条使用input新属性range，通过v-model的双向绑定的特点，就可以实时修改range的播放进度

- 播放时长

进度和时长的方法类似，就不赘述了，这里修改一个时间属性duration即可。

- 声音调控

同实时进度一样，同样是修改range的值

- 播放模式

分为三种：单曲循环、列表循环、随机播放
播放模式涉及到播放列表，详见播放列表。

- 播放列表

列表循环以及随机播放时候需要用到列表，我将储存好的列表存放在localstorage中(效仿网易云)，如果没有列表默认播放faded(个人比较喜欢的一首歌，很有旋律感)