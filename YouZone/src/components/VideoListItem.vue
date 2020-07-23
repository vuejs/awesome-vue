<template>

  <li class="list-group-item" @click="onVideoSelect"> 
      <!-- thumbnail -->
       <img class="mr-3" :src="thumbnailUrl">
       <!-- video title -->
       <div class="media-body">
       {{ video.snippet.title }}
       </div>
 </li>
</template>

<script>
export default {
    name: 'VideoListItem',
    props: ['video'],
    computed: {
        thumbnailUrl() {
            return this.video.snippet.thumbnails.default.url
        }
    },
    methods: {
        onVideoSelect() {
            console.log(this.video)
            this.$emit('videoSelect',this.video)
        }
    }

}
</script>

<style scoped>
    li{
        display: flex;
        cursor: pointer;
    }
    li:hover{
        background-color: #eee;
    }
</style>