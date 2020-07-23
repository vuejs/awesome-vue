<template>
 <div>
  <ul class="list-item list-unstyled">
     <VideoListItem 
      v-for="video in videos" 
      :key="video.etag" 
      :video="video"
      @videoSelect="onVideoSelect"
      />
     
  </ul>
 </div>
</template>

<script>
import VideoListItem from './VideoListItem';
export default {
    name: 'VideoList',
    components: {
      VideoListItem
    },
    props: {
      videos: Array
    },
    methods: {
      onVideoSelect(video) {
        this.$emit('videoSelect',video);
      }
    }
}
</script>

<style>

</style>