<template>
  <hgroup>
    <h1><span class="thin">Awesome</span> Vue.js</h1>
    <h2 class="tagline thin">A curated list of awesome things related to
      <a href="https://vuejs.org/">Vue.js</a>
    </h2>
  </hgroup>
</template>

<script>
export default {}
</script>

<style lang="sass" scoped>
hgroup {
  margin-bottom: 2.4rem;

  h1 {
    font-size: 2.7rem;
    margin-bottom: 1.6rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  @media only screen and (max-width: 735px) {
    margin-bottom: 1.8rem;

    .tagline {
      display: none;
    }
  }
}
</style>
