<template>
  <footer>
    <a href="https://github.com/vuejs/awesome-vue"
      title="Contribute on GitHub"
      class="github">
      <i class="fa fa-github"></i>
      <span class="sm">Contribute on GitHub</span>
    </a>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="sass" scoped>
footer {
  margin-top: 4rem;

  .github {
    color: #34495e;
    font-size: 2rem;
    width: 149px;
    display: inline-block;
    position: relative;

    .sm {
      display: none;
    }

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 27px;
      background: url(../assets/look-here.png) no-repeat;
      background-size: 149px;
      position: absolute;
      right: -5px;
      transform: rotate(-4deg);
      transform-origin: 100% 0;
    }

    &:hover::after {
      animation: soho 1s ease-in-out infinite;
    }
  }

  @media only screen and (max-width: 735px) {
    margin-top: 2rem;

    .github {
      font-size: 1rem;
      width: 100%;

      .sm {
        display: inline;
      }

      &::after {
        display: none;
      }
    }
  }
}
</style>
