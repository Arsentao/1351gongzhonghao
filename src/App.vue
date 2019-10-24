<template>
  <div id="app"
       v-cloak>
    <!-- 主体 -->
    <router-view v-wechat-title='$route.meta.title'></router-view>

  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
  padding-bottom: 5em;
}
* {
  margin: 0;
  padding: 0;
}
body {
  font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
    "Hiragino Sans GB", "Hiragino Sans GB W3", "Microsoft YaHei UI",
    "WenQuanYi Micro Hei", sans-serif;
  font-size: 12px;
  color: #000;
  /* background: #e8e8e8; */
}
a {
  text-decoration: none;
  color: #222;
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* 清除浮动 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
/* 全局清除点击默认效果 */
*,
*:before,
*:after {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.empty {
  height: 100px;
  line-height: 100px;
  color: #999;
  font-size: 14px;
}
button {
  outline: none;
}
/* loadingMsg */
.prompt {
  color: #b2b2b2;
  padding: 0.6em 0;
  font-size: 11px;
  margin-bottom: 1em;
}
</style>
