<template>
  <!-- 主体 -->
  <div class="wrap-bg">

    <div class="top-logo">
      <img src="../assets/images/homePage/logo1.png"
           alt="" height="30rem">
    </div>
    <!-- 菜单 -->
    <ul class="menu clearfix"
        id="menu">
      <li v-for="(item,index) in pages"
          :key="item.name"
          @click="toPage(item.path,index)">
        <img :src="item.img"
             alt=""
             class="menu-btn">
        <!-- 水波纹效果 -->
        <div class="wave wave5"
             :class="'wavebg-'+index"
             v-if="waveShow[index]"></div>
        <div class="wave wave4"
             :class="'wavebg-'+index"
             v-if="waveShow[index]"></div>
        <div class="wave wave3"
             :class="'wavebg-'+index"
             v-if="waveShow[index]"></div>
        <div class="wave wave2"
             :class="'wavebg-'+index"
             v-if="waveShow[index]"></div>
        <div class="wave wave1"
             :class="'wavebg-'+index"
             v-if="waveShow[index]"></div>
        <div class="wave wave0"
             :class="'wavebg-'+index"
             v-if="waveShow[index]"></div>
        <!-- /水波纹效果 -->
      </li>
    </ul>



    <footer style="color:black;padding-bottom:20px;">
<p>备案号:<a class="beian" style="color:red;display:inline;" href="http://beian.miit.gov.cn">粤ICP备13069893号-5</a></p>
  <p>Copyright © 2009-2018,www.phonpad.com<br/>版权所有 © 广州丰谱信息技术有限公司 未经许可 严禁复制</p>
    </footer>


  </div>
</template>
<script>
import footNav from '../components/footer'
export default {
  components: {
    footNav
  },
  data () {
    return {
      waveShow: [false, false, false, false, false, false],
      nowIndex: 0,
      pages: [
         {
          path: '/video',
          img: require('../assets/images/homePage/btn_video1.png')
        },{
          path: '/personal',
          img: require('../assets/images/homePage/btn_personal1.png')
        },
        {
          path: '/knowledge',
          img: require('../assets/images/homePage/btn_order.png')
        },  {
          path: '/explain1',
          img: require('../assets/images/homePage/btn_make.png')
        },
        {
          path: '/goodsList',
          img: require('../assets/images/homePage/btn_qinlv.png')
        },
        {
          path: '/QA',
          img: require('../assets/images/homePage/btn_com.png')
        }
      ]
    }
  },
  created () {
  },

  methods: {
    toPage (path, index) {
      var waveShow = [false, false, false, false, false, false]
      waveShow[index] = true
      this.waveShow = waveShow
      var that = this
      setTimeout(() => {
        that.waveShow = [false, false, false, false, false, false]
        that.$router.push(path)
      }, 800)
    }
  }
}
</script>

<style scoped>
/* 内容 */
.top-logo {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding: 1em 0 1em 0;
}
.top-logo > img {
  width: 70%;
  text-align: center;
}
.wrap-bg {
  /* 背景自动适应屏幕大小 */
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  /* top: 45px; */
  display: block;
  background: url("../assets/images/homePage/blue.jpg");
  background-size: 100% 100%;
  z-index: -100;
  overflow: auto;
}
/* 菜单 */
ul.menu {
  width: 100%;
  height: auto;
}
ul.menu > li:nth-child(2n) {
  margin-left: 3vw;
}
ul.menu > li {
  display: inline-block;
  width: 40%;
  height: 40vw;
  cursor: pointer;
  margin-top: calc(25vh - 33vw - 2em);
  position: relative;
}
img.menu-btn {
  width: 100%;
}

/** 水波纹 */
.wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 40vw;
  height: 40vw;
  border-radius: 40vw;
}
.wavebg-0 {
  background: url("../assets/images/homePage/btn_video1.png");
  background-position: center center;
  background-size: 40vw 40vw;
  background-repeat: no-repeat;
  background-color: #f7fdfd;
}
.wavebg-1 {
  background: url("../assets/images/homePage/btn_personal1.png");
  background-position: center center;
  background-size: 40vw 40vw;
  background-repeat: no-repeat;
  background-color: #f7fdfd;
}
.wavebg-2 {
  background: url("../assets/images/homePage/btn_order.png");
  background-position: center center;
  background-size: 40vw 40vw;
  background-repeat: no-repeat;
  background-color: #f7fdfd;
}
.wavebg-3 {
  background: url("../assets/images/homePage/btn_make.png");
  background-position: center center;
  background-size: 40vw 40vw;
  background-repeat: no-repeat;
  background-color: #f7fdfd;
}
.wavebg-4 {
  background: url("../assets/images/homePage/btn_qinlv.png");
  background-position: center center;
  background-size: 40vw 40vw;
  background-repeat: no-repeat;
  background-color: #f7fdfd;
}
.wavebg-5 {
  background: url("../assets/images/homePage/btn_com.png");
  background-position: center center;
  background-size: 40vw 40vw;
  background-repeat: no-repeat;
  background-color: #f7fdfd;
}
.wave0 {
  z-index: 2;
  background-size: 46vw 46vw;
  animation: w 1s forwards;
  opacity: 0;
  }
.wave1 {
  z-index: 3;
  background-size: 42vw 42vw;
  animation: w 1s 0.2s forwards;
  opacity: 0;
}
.wave2 {
  z-index: 4;
  background-size: 44vw 44vw;
  animation: w 1s 0.4s forwards;
  opacity: 0;
}
.wave3 {
  z-index: 5;
  background-size: 41vw 41vw;
  animation: w 1s 0.6s forwards;
  opacity: 0;
}
.wave4 {
  z-index: 6;
  background-size: 42vw 42vw;
  animation: w 1s 0.8s forwards;
  opacity: 0;
}
.wave5 {
  z-index: 7;
  background-size: 40vw 40vw;
  animation: w 1s 1s forwards;
  opacity: 0;
}
@keyframes w {
  0% {
    top: calc((100% - 4vw) / 2);
    left: calc((100% - 4vw) / 2);
    width: 4vw;
    height: 4vw;
    opacity: 1;
  }
  100% {
    top: calc((100% - 33vw) / 2);
    left: calc((100% - 33vw) / 2);
    width: 33vw;
    height: 33vw;
    opacity: 1;
  }
}
/** 水波纹end */



</style>
