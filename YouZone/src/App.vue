<template>
  <div class="container">
    <!-- search bar -->
    <SearchBar @termChange="onTermChange"></SearchBar>
      <VideoDetail :video="selectedVideo" />
      <VideoList :videos="videos" @videoSelect="onVideoSelect" />
  </div>
</template>

<script>
import axios from 'axios';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
const API_KEY = 'AIzaSyCnE6rts0PA3mgRToJAMb4KX3zozTD8rjc';
export default {
  name: 'App',
  data() {
    return {
      videos: [],
      selectedVideo: null
    }
  },
  components: {
    SearchBar,
    VideoList,
    VideoDetail
  },
  methods: {
    // onvideo select
    onVideoSelect(video) {
      this.selectedVideo = video;
      console.log(video)
    },
    // input from the user
    onTermChange: function(searchItem) {
      axios.get('https://www.googleapis.com/youtube/v3/search',{
        params: {
          key: API_KEY,
          type: 'video',
          part: 'snippet',
          q: searchItem
        }
      })
      .then(response => {
        // console.log(response)
       this.videos = response.data.items;
      })
    }
  }

};
</script>

