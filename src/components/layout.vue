<template>
  <div>
    <!-- 头部 -->
    <!-- <header class="top-head"
            v-html="headtitle"></header> -->

    <!-- 主体 -->
    <router-view></router-view>

    <!-- 脚部 -->
    <footer class="foot">
      <ul class="foot-nav clearfix">
        <li class="foot-item-active">
          <a href="">
            <img src="../assets/images/homePage/foot-nav-home_01.png"
                 alt="首页"
                 class="foot-nav-icon">
            <span class="foot-nav-text red">首页</span>
          </a>
        </li>
        <li>
          <a href="">
            <img src="../assets/images/homePage/foot_nav_personal_02.png"
                 alt="个人中心"
                 class="foot-nav-icon">
            <span class="foot-nav-text">个人中心</span>
          </a>
        </li>
        <li>
          <a href="">
            <img src="../assets/images/homePage/foot_nav_com_02.png"
                 alt="交流中心"
                 class="foot-nav-icon">
            <span class="foot-nav-text">交流中心</span>
          </a>
        </li>
        <li>
          <a href="">
            <img src="../assets/images/homePage/foot_nav_map_02.png"
                 alt="网站导航"
                 class="foot-nav-icon">
            <span class="foot-nav-text">网站导航</span>
          </a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      headtitle: '<p>丰谱信息科技</p>'
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
body {
  font-family: serif;
  font-size: 12px;
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
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.top-head {
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
/* 脚部 */
/* footer {
  margin-top: 50px;
} */
ul.foot-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
}
ul.foot-nav::before {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #f7f7f7;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
ul.foot-nav > li {
  width: 25%;
  float: left;
  padding: 0.5em 0;
}
.foot-nav > li a {
  display: block;
}
.red {
  color: #e61a01;
}
.foot-nav-icon {
  display: block;
  width: 2.2em;
  height: 2.2em;
  margin: 0 auto;
}
</style>
