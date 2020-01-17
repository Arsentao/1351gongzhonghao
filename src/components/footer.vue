<template>
  <div>
    <footer>
      <ul class="foot-nav clearfix">
        <li :class="{'curr':navIndex==1}">
          <router-link to="/index">
            <i class="foot-nav-icon foot-nav-home"></i>
            <span class="foot-nav-text">首页</span>
          </router-link>
        </li>
        <li :class="{'curr':navIndex==2}">
          <router-link to="/personal">
            <i class="foot-nav-icon foot-nav-personal"></i>
            <span class="foot-nav-text">个人中心</span>
          </router-link>
        </li>
        <li :class="{'curr':navIndex==3}">
          <router-link to="/QA">
            <i class="foot-nav-icon foot-nav-forum"></i>
            <span class="foot-nav-text">问询服务</span>
          </router-link>
        </li>
        <li :class="{'curr':navIndex==4}"
            @click="onMenuTouch">
          <router-link to=""
                       href="">
            <i class="foot-nav-icon foot-nav-web"></i>
            <span class="foot-nav-text">网站导航</span>
          </router-link>
        </li>
      </ul>

    </footer>

    <!-- 侧边菜单栏 -->
    <div :class="['side-menu', {'open':leftMenuShow}]">
      <div class="items">
         <a :href="item.path"
                     v-for="item in leftMenus"
                     :key="item.name">
          <span style="margin-left: 50px;">{{item.name}}</span>
          <img src="../assets/images/menu/arrow-right.png"
               alt=""
               class="side-arrow">
          <img :src="item.icon"
               alt=""
               class="side-icon">
         </a>
      </div>
    </div>
    <div :class="['side-bg', {'open':leftMenuShow}]"
         @click="onMenuTouch"></div>
    <!-- /侧边菜单栏 -->
  </div>
</template>

<script>
import { redirectLogin } from '../util/httpRequest'
import indexPic from '@/assets/images/left/index.png'
import songSearchPic from '@/assets/images/left/songSearch.png'
import goodsListPic from '@/assets/images/left/goodsList.png'
import explainPic from '@/assets/images/left/explain.png'
import forumPic from '@/assets/images/left/forum.png'
import personalPic from '@/assets/images/left/personal.png'
import videoPic from '@/assets/images/left/video.png'
export default {
  props: {
    navIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      leftMenuShow: false,
      leftMenus: [
        {
          name: '首页',
          path: '/index',
          icon: indexPic
        }, {
          name: '鸟然谱库',
          path: '/songSearch',
          icon: songSearchPic
        }, {
          name: '琴侣旗舰',
          path: '/goodsList',
          icon: goodsListPic
        }, {
          name: '用户定制',
          path: '/explain1',
          icon: explainPic
        }, {
          name: '问询服务',
          path: '/QA',
          icon: forumPic
        }, {
          name: '个人中心',
          path: '/personal',
          icon: personalPic
        }, {
          name: '琴侣微漫',
          path: '/video',
          icon: videoPic
        },
           {
          name: '丰谱官网',
          path: 'http://www.phonpad.com',
          icon: videoPic
        },
         {
          name: '华工官网',
          path: 'https://www.scut.edu.cn/new/',
          icon: videoPic
        },
      ]
    }
  },
  created () {
    // 非首页页面
    if (this.navIndex != 1) {
      // 检查是否授权登录
      if (!localStorage.getItem('userinfo')) {
        // 没有用户信息，跳转到授权登录
        redirectLogin()
      }
    }
  },
  methods: {
    onMenuTouch () {
      this.leftMenuShow = !this.leftMenuShow
    }
  }
}
</script>
<style>
/* #app {
  padding-bottom: 4.2em;
} */
</style>

<style scoped>

footer {
  z-index: 1000;
}
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
.curr .foot-nav-text {
  color: #e61a01;
}
/* 首页 */
.foot-nav-home {
  background: url("../assets/images/homePage/foot-nav-home_02.png") no-repeat;
  background-size: 100%;
}
.curr .foot-nav-home {
  background: url("../assets/images/homePage/foot-nav-home_01.png") no-repeat;
  background-size: 100%;
}
/* 个人中心 */
.foot-nav-personal {
  background: url("../assets/images/homePage/foot_nav_personal_02.png")
    no-repeat;
  background-size: 100%;
}
.curr .foot-nav-personal {
  background: url("../assets/images/homePage/foot_nav_personal_01.png")
    no-repeat;
  background-size: 100%;
}
/* 交流中心 */
.foot-nav-forum {
  background: url("../assets/images/homePage/foot_nav_com_02.png") no-repeat;
  background-size: 100%;
}
.curr .foot-nav-forum {
  background: url("../assets/images/homePage/foot_nav_com_01.png") no-repeat;
  background-size: 100%;
}
/* 网站导航 */
.foot-nav-web {
  background: url("../assets/images/homePage/foot_nav_map_02.png") no-repeat;
  background-size: 100%;
}
.curr .foot-nav-web {
  background: url("../assets/images/homePage/foot_nav_map_01.png") no-repeat;
  background-size: 100%;
}

/** 侧边菜单栏 */
.side-menu {
  position: fixed;
  left: auto;
  width: 50vw;
  height: 100%;
  top: 0;
  background: #404248;
  color: #fff;
  font-size: 14px;
  z-index: 999;
  box-shadow: 1px 1px 1px #f2f2f2;

  visibility: hidden;
  -webkit-transform: translate(-50vw, 0);
  -ms-transform: translate(-50vw, 0);
  -moz-transform: translate(-50vw, 0);
  -o-transform: translate(-50vw, 0);
  transform: translate(-50vw, 0);
  -webkit-transition: all 350ms;
  -ms-transition: all 350ms;
  -moz-transition: all 350ms;
  -o-transition: all 350ms;
  transition: all 350ms;
  -webkit-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translate(-50vw, 0);
  -ms-transform: translate(-50vw, 0);
  -moz-transform: translate(-50vw, 0);
  -o-transform: translate(-50vw, 0);
  transform: translate(-50vw, 0);
}

.side-menu.open {
  visibility: visible;
  -webkit-transform: translate(0, 0);
  -ms-transform: translate(0, 0);
  -moz-transform: translate(0, 0);
  -o-transform: translate(0, 0);
  transform: translate(0, 0);
  width: 50vw;
  -webkit-transition: all 350ms;
  -ms-transition: all 350ms;
  -moz-transition: all 350ms;
  -o-transition: all 350ms;
  transition: all 350ms;
  -webkit-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
}

.side-menu .items a {
  text-align: left;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #4a4d54;
  display: block;
  color: #fff;
  opacity: 0;
  -webkit-transition: all 0.4s;
  -ms-transition: all 0.4s;
  -moz-transition: all 0.4s;
  -o-transition: all 0.4s;
  transition: all 0.4s;
  -webkit-transform: translateX(-100%);
  -ms-transform: translateX(-100%);
  -moz-transform: translateX(-100%);
  -o-transform: translateX(-100%);
  transform: translateX(-100%);
}

.side-menu.open .items a {
  display: block;
  opacity: 1;
  color: #fff;
  -webkit-transform: translateX(0);
  -ms-transform: translateX(0);
  -moz-transform: translateX(0);
  -o-transform: translateX(0);
  transform: translateX(0);
}

.side-menu .side-arrow {
  position: absolute;
  width: 15px;
  right: 20px;
  top: 12px;
}

.side-menu .side-icon {
  position: absolute;
  width: 20px;
  left: 20px;
  top: 10px;
}

.open a:nth-child(2) {
  transition-delay: 160ms;
}

.open a:nth-child(3) {
  transition-delay: 240ms;
}

.open a:nth-child(4) {
  transition-delay: 320ms;
}

.open a:nth-child(5) {
  transition-delay: 400ms;
}

.open a:nth-child(6) {
  transition-delay: 480ms;
}

.open a:nth-child(7) {
  transition-delay: 560ms;
}

.open a:nth-child(8) {
  transition-delay: 640ms;
}

.open a:nth-child(9) {
  transition-delay: 720ms;
}


.side-bg {
  display: none;
  position: fixed;
  left: 50vw;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
}

.side-bg.open {
  display: block;
}
</style>
