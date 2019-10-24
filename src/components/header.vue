<template>
  <header class="top-head"></header>
</template>

<script>
export default {
  name: 'head',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.top-head {
  margin: 10vw 0;
}
.top-head > p {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-size: 15px;
  background-color: #f8f8f8;
  text-align: center;
  z-index: 111;
  overflow: hidden;
}
</style>
