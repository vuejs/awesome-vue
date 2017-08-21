<template>
  <div class="my-music">
    <div class="music-box" :key="2">
      <div class="music-body">
        <div class="music-pre" @click="play(true)"></div>
        <div v-if="!audioToggle" class="music-toggle play" @click="musicToggle"></div>
        <div v-if="audioToggle" class="music-toggle pause" @click="musicToggle"></div>
        <div class="music-next" @click="play(false)"></div>
      </div>
      <div class="music-length">
        <input type="range" id="rangeLength" v-model="length" min="0" max="100" @input="changeLength()">
      </div>
      <div class="music-duration">
        {{Math.floor(nowDuration/60)+':'+(nowDuration%60/100).toFixed(2).slice(-2)}}/{{Math.floor(duration/60)+':'+(duration%60/100).toFixed(2).slice(-2)}}
      </div>
      <div class="music-voice" @click="voiceShow=!voiceShow,listShow=false" v-click-outside="voiceOutside">
        <div class="voice-range" v-show="voiceShow">
          <input type="range" id="rangeVoice" v-model="voice" min="0" max="100" @input="changeVoice()">
        </div>
      </div>
      <div @click="changeModel(modelImg)" :data-index="modelImg" class="music-model" :style="{backgroundImage: 'url('+modelBase[modelImg-1].url+')'}"></div>
      <div class="music-list" @click.self.stop="listShow=!listShow,voiceShow=false">
      </div>
      <div class="music-list-result" v-if="listShow" v-click-outside="listOutside">
        <div class="music-search">
          <input v-model="musicName" type="text" placeholder="输入歌名回车搜索" @keyup.enter="musicSearch">
          <div v-if="searchShow" style="float:right;cursor:pointer;" @click="searchShow=false">取消</div>
          <div v-if="!searchShow" style="float:right;cursor:pointer;" @click.stop="listShow=false">取消</div>
        </div>
        <li v-if="searchShow" @click="playOnline(searchResult)" style="cursor:pointer;" v-for="(searchResult,index) in searchResults">
          <div class="music-name" v-html="searchResult.SongName"></div>
          <div class="music-singerName" v-html="searchResult.SingerName"></div>
          <div style="width:50px;" v-html="Math.floor(searchResult.Duration/60)+':'+(searchResult.Duration%60/100).toFixed(2).slice(-2)"></div>
          <div style="width:10px;" @click.stop="addTempList(searchResult)">+</div>
        </li>
        <li v-if="!searchShow" @click="playOnline(onlineList)" style="cursor:pointer;" v-for="(onlineList,index) in onlineLists">
          <div class="music-name" v-html="onlineList.SongName"></div>
          <div class="music-singerName" v-html="onlineList.SingerName"></div>
          <div style="width:50px;" v-html="Math.floor(onlineList.Duration/60)+':'+(onlineList.Duration%60/100).toFixed(2).slice(-2)"></div>
          <div style="width:10px;" @click.stop="removeTempList(onlineList,index)">-</div>
        </li>
      </div>
    </div>
    <audio id="audio" style="display:none" :src="musicUrl" controls="controls" autoplay="autoplay">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>
<script>
//ios不自动播放
function audioAutoPlay(id) {
  var audio = document.getElementById(id),
    play = function() {
      audio.play();
      document.removeEventListener("touchstart", play, false);
    };
  audio.play();
  document.addEventListener("WeixinJSBridgeReady", function() {
    play();
  }, false);
  document.addEventListener('YixinJSBridgeReady', function() {
    play();
  }, false);
  document.addEventListener("touchstart", play, false);
}
//判断返回的音乐数据时候有空值
function validateFilePath(arr) {
  for (var x = 0; x < arr.length; x++) {
    if (arr[x].AlbumPrivilege == 5) {
      var a = arr.splice(x, 1);
      return validateFilePath(arr)
    }
  }
  return arr;
}

//音乐对象
function Music() {
  var audio = document.getElementById("audio");
  //设置音量
  this.setVoice = function(voice) {
    audio.volume = voice / 100;
  }
  //设置播放进度
  this.setLength = function(length, duration) {
    audio.currentTime = length * duration / 100;
  }
  //修改播放模式
  this.modifyModel = function(model) {
    window.localStorage.setItem("model", model);
  }
  //播放和暂停
  this.setToggle = function(boolean) {
    if (boolean) {
      audio.play();
    } else {
      audio.pause();
    }
  }
  //更新播放列表
  this.modify = function(list) {
    window.localStorage.setItem("list", JSON.stringify(list));
  }
  //获取音乐列表
  this.getList = function() {
    var list = JSON.parse(window.localStorage.getItem("list") || '[]');
    return list;
  }
  //获取播放模式
  this.getModel = function() {
    var model = JSON.parse(window.localStorage.getItem("model") || 1);
    return model;
  }
  //重新播放
  this.reload = function() {
    audio.load();
  }
}


export default {
  data() {
    return {
      searchShow: false,
      audioToggle: true,
      musicUrl: null,
      musicName: "",
      musicHash: "5DD8F4B0FB68415472136D961232421B",
      searchResults: null,
      onlineLists: [],
      duration: null,
      nowDuration: 0,
      voice: 100,
      voiceShow: false,
      listShow: false,
      modelImg: 1,
      length: 0,
      modelBase: [{
          index: 1,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABs0lEQVRYR+2XjU0CQRSEZyrQDsQK1ArEDqACoQKxA+3ADtQKxArUCsQOtAKlgjGDu+RYjvuBO0gMm5BA2Lv3vXnvzd4RO17ccXz8bwBJHZKfRSq3poCkUwAvAMYkh6sgWgGQdAjAmR+EwEOSD3kQrQA4kKQBgPtM0FyI1gCqQswAJL0CON/SSC4osQsA5zmHyAN425ISI5KTJQCSrfZFmtweoFUFJHU9ZEH2D5I/WymBpBGAKwCdJKDd8DoL0rgCkhzkMmYNIGYdfcYWfRYhGgWQ1APwlMn6gqRNzmYXS+GfPqD6/hIB7gD49AJJ122tJWkC4KQCgLcc+6hubObDCfidkK9SYO6GTQKk8jtIEcAzyV4sgY/O2Dh15e+7ocIDyHsNBW5J3swVSLq3DkQ2S3f4UcUe8CT8nQVxrQnxSNIKutOzI1hUgilJPzUtPxUnN/EMO0N3d+kKjei9UQUbUrx2No5hzVXLbcINIex+42QcY+ApgAFJ/z9bK6cggfgimdpqoSLBlOwt9hWr4I8NaOE8KBzDAOHx6lYtQ2mdkg2lPlDl5aJu0Oz+UoBNbl7l2j3AL3xf3yFN7UzRAAAAAElFTkSuQmCC"
        },
        {
          index: 2,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQklEQVRYR+2W7U0DMRBE31QAHQAdpAUqCFTA0UGoAOgAKiDpIFQAVEA6oAU6WLTIjozOOXRfzh/7T6JT4nk7nt2zOPLSkfWpANWBlgNmtgJOZgjnN7CR5J/7lQPYAqczACwAAy5SiGIZMLNz4Au4lPQeCywG4IJm5g5UgMMOmJkH5Q3YSrqdOoidR5CIxw5YTw1xECAR/wCW3q/ADTAKwsy8mKUk3+9PCIMmCu3xCbxKaiIl4G3zAjxKehhyHEHE9/4tJNnbh5Ef9SYCNFEktcnMrlxYkg+nQcvMmlDIGvDvd8B9LDg3CVu9Okg5+VMCEZ/6SHaY9n0gF5SxAOH8oxN78aIAAWIhafffy2jyI+hysEgGhgBcj0l+n8zkHPBX5Zn3bp+Nevz2ufM+EAbT00yXEudcpUEseh/IuVQBqgPVgR84rqjbMQPaWQAAAABJRU5ErkJggg=="
        },
        {
          index: 3,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABXUlEQVRYR+2W/VHDMAzFnzZgk3YDyghMQJmAdpKyAe0EsAEdoaPABOJeT8nlw46lXt3ccfWfiRP99Cw/STDzkpnj4w7wfxVQ1QcAnwC2InLK1VoVBSz4N4AlgB8ATzmIKgDMVlX3AF4s8yxENQAvxBlAVd8BLCY84SQi2ynPUFXKvUvsWXWejZRoAI4AHgumtBeR19QeC84zZ+GVVg8iAsAfjyCCwRu4FqJYA6q6BvDRSasHYcf3Zu8PIsL97lUEsBopQbDiEQ1+/saLWlLC+5/hPjeAR4lLIEIANSDCANeGcAF0TOZZRHiFaF6Thek9jiLA4J6zq7GxXA0iakSje55QwpP8L4AVO2QEIGsyQYg2eOsD5mZsJrnFZrSZSs0gUi7Y7TG94CEj8ug63DOYCUbBqwJ4glcDsJGMLZ4zRjLzRq3iNbxEevMJzgZfADY3H0oj0NUU8ELcAWZX4A+QLKwhysdzlAAAAABJRU5ErkJggg=="
        }
      ]
    }
  },
  methods: {
    musicToggle() {
      var music = new Music();
      this.audioToggle = !this.audioToggle;
      music.setToggle(this.audioToggle);
    },
    musicSearch() {
      var musicName = this.musicName;
      this.searchShow = true;
      //酷狗音乐
      var search = this.$http.jsonp("https://songsearch.kugou.com/song_search_v2?_callback=jQuery191034642999175022426_1489023388639&keyword=" + musicName + "&page=1&pagesize=10&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=1489023388641")
      search.then(data => {
        if (data.body.error_code == 0) {
          var list = validateFilePath(data.body.data.lists);
          this.searchResults = list;
        }
      }).catch(data => {
        alert("获取列表失败")
      })
    },
    playOnline(e) { //播放音乐
      var search = this.$http.jsonp('http://blog.166zx.com/edit/home/GetMusicInfo?hash=' + e.FileHash)
      search.then(data => {
        if (data.body.resultCode == 1) {
          var musicInfo = data.body.data;
          this.musicUrl = musicInfo.data.play_url;
          var music = new Music();
          music.reload();
          this.duration = e.Duration;
          this.musicHash = e.FileHash;
          this.audioToggle = true;
          if (musicInfo.play_url == "") {
            alert("很遗憾！播放源地址无效！");
          }
        }
      }).catch(data => {})
    },
    addTempList(e) { //添加到播放列表
      var list = this.onlineLists;
      list.push(e);
      this.onlineLists = list;
      var music = new Music();
      music.modify(list);
    },
    removeTempList(e, index) { //从播放列表删除
      var list = this.onlineLists;
      list.splice(index, 1);
      this.onlineLists = list;
      var music = new Music();
      music.modify(list);
    },
    changeVoice() { //调节音量
      var music = new Music();
      music.setVoice(this.voice);
    },
    changeLength() { //调节进度
      var music = new Music();
      music.setLength(this.length, this.duration);
    },
    changeModel() { //修改播放模式
      var music = new Music();
      this.modelImg = (this.modelImg + 1) % 3 + 1;
      music.modifyModel(this.modelImg);
    },
    play(e) {
      var vm = this;
      var music = new Music();
      switch (vm.modelImg) {
        case 1: //单曲循环
          music.reload();
          break;
        case 2: //列表循环
          var list = vm.onlineLists;
          if (list.length > 0) { //判断是否有缓存列表
            //判断当前音乐在列表中的位置
            for (var x = 0; x < list.length; x++) {
              if (list[x].FileHash == vm.musicHash) {
                if (!e) { //往后下一首
                  if (x !== list.length - 1) { //判断是否是列表最后一首
                    vm.playOnline(list[x + 1])
                  } else { //返回第一首
                    vm.playOnline(list[0])
                  }
                } else { //往前下一首
                  if (x == 0) { //判断是否是列表第一首
                    vm.playOnline(list[list.length - 1]) //返回列表最后一首
                  } else {
                    vm.playOnline(list[x - 1])
                  }
                }
                return;
              }
            }
          } else {
            music.reload();
          }
          break;
        case 3: //随机播放
          var list = vm.onlineLists;
          if (list.length > 0) { //判断是否有缓存列表
            var num = Math.floor(Math.random() * list.length);
            vm.playOnline(list[num])
          } else {
            music.reload();
          }
          break;
      }
    },
    bubbling(event) { //修复 click-outside 阻止事件向上冒泡。
      var flag = false;
      for (var x = 0; x < event.path.length; x++) {
        if (event.path[x].className == "music-list-result") {
          flag = true;
        }
      }
      return flag;
    },
    voiceOutside(event) {
      var flag = this.bubbling(event);
      this.voiceShow = flag;
    },
    listOutside(event) {
      var flag = this.bubbling(event);
      this.listShow = flag;
    }
  },
  mounted: function() {
    var music = new Music();
    //获取缓存内容
    var list = music.getList();
    var model = music.getModel();
    //赋值给vue实例
    this.modelImg = model;
    this.onlineLists = list;
    //判断应该播放缓存还是默认歌曲
    if (list.length !== 0) {
      this.playOnline(list[0]);
    } else {
      var e = {
        FileHash: this.musicHash,
        Duration: 213 //默认长度是fade的长度
      }
      this.playOnline(e);
    }
    //监听音乐正在播放
    var audio = document.getElementById("audio");
    var vm = this;
    audio.addEventListener("timeupdate", function() {
      //修改目前的ranger位置
      vm.length = audio.currentTime * 100 / vm.duration;
      //修改目前的播放时长
      vm.nowDuration = audio.currentTime;
    }, true);
    audioAutoPlay("audio");
  },
  watch: {
    //监听播放进度
    "length": function(val, oldVal) {
      if (val > 99.8) {
        this.play(true);
      }
    }
  }
}

</script>
<style scoped>
.my-music {
  position: fixed;
  bottom: 0;
  width: 100%;
  border: 1px solid #fff;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
}

.music-box {
  width: 680px;
  height: 50px;
  border-bottom: 0;
  margin: 0 auto;
}

.music-body {
  float: left;
  display: flex;
  width: 120px;
  height: 100%;
  background: rgba(0, 0, 0, 0);
}

.music-body>div {
  height: 50px;
}

.music-left {
  float: right;
}

.music-pre {
  flex: 1;
  background: url("./img/pre.png") no-repeat center;
  cursor: pointer;
}

.music-next {
  flex: 1;
  cursor: pointer;
  background: url("./img/next.png") no-repeat center;
}

.music-toggle {
  flex: 1;
  cursor: pointer;
}

.music-duration {
  height: 100%;
  float: left;
  line-height: 50px;
  padding: 0 10px;
}

.music-length {
  height: 100%;
  float: left;
  width: 300px;
}

.music-voice {
  float: left;
  background: url("./img/voice.png") no-repeat 0 8px;
  height: 100%;
  width: 50px;
  cursor: pointer;
  position: relative;
}

.voice-range {
  transform: rotateZ(-90deg) translate3d(45px, -6px, 0px);
  width: 120px;
  height: 30px;
  border: 1px solid #fff;
  position: absolute;
  top: -30px;
  right: -32px;
  padding: 0 10px;
  cursor: auto;
  background-color: rgba(0, 0, 0, 0.8);
}

.music-length input {
  width: 100%;
  height: 2px;
  margin-top: 22px;
}

.music-voice input {
  width: 100%;
  height: 2px;
  cursor: pointer;
}

.music-model {
  float: left;
  background: no-repeat 0 8px;
  height: 100%;
  width: 50px;
  cursor: pointer;
  position: relative;
}

@media (max-width: 768px) {
  .music-length,
  .music-duration,
  .music-voice,
  .music-model,
  .music-list,
  .music-pre,
  .music-next {
    display: none;
  }
  .my-music {
    width: auto;
  }
  .music-box {
    width: auto;
  }
  .music-body {
    width: 50px;
  }
}

input[type=range] {
  -webkit-appearance: none;
  border-radius: 10px;
  /*这个属性设置使填充进度条时的图形为圆角*/
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type=range]::-webkit-slider-runnable-track {
  height: 15px;
  margin-top: 9px;
  border-radius: 10px;
  /*将轨道设为圆角的*/
}

input[type=range]:focus {
  outline: none;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  margin-top: -5px;
  /*使滑块超出轨道部分的偏移量相等*/
  background: #ffffff;
  border-radius: 50%;
  /*外观设置为圆形*/
  border: solid 0.125em rgba(205, 224, 230, 0.5);
  /*设置边框*/
  box-shadow: 0 .125em .125em #3b4547;
  /*添加底部阴影*/
}

.play {
  background: url("./img/play.png") no-repeat center;
}

.pause {
  background: url("./img/pause.png") no-repeat center;
}

.music-show,
.music-left {
  background: url("./img/right.png") no-repeat center;
  background-position-x: -7px;
  width: 20px;
  height: 48px;
  color: #fff;
  line-height: 50px;
  cursor: pointer;
}

.music-box .music-left {
  background: url("./img/left.png") no-repeat center;
}

.music-list {
  float: left;
  background: url("./img/list.png") no-repeat -6px 6px;
  background-size: 40px 40px;
  height: 100%;
  width: 50px;
  cursor: pointer;
  position: relative;
}

.music-list-result {
  position: fixed;
  bottom: 51px;
  left: 50%;
  text-align: left;
  border: 1px solid #fff;
  padding: 4px;
  word-break: break-all;
  width: 500px;
  background-color: rgba(0, 0, 0, 0.8);
}

.music-list-result li {
  list-style: none;
  display: flex;
}

.music-singerName,
.music-name {
  flex: 2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.music-singerName {
  flex: 1;
}

.music-search {
  border-bottom: 1px solid #fff;
  margin-bottom: 4px;
  height: 28px;
}

.music-search input {
  width: 400px;
  padding: 4px;
  border: 0;
  color: #fff;
  background: rgba(0, 0, 0, 0);
  float: left;
}

</style>
