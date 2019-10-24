<template>
  <div class="video-main"
       v-wechat-title="this.title">
    <!-- 视频标题 -->
    <div class="video-title">
      <p>{{ videoTitle }}</p>
    </div>
    <!-- 正在播放的视频 -->
    <div class="video-box">
      <video controls
             id="myVideo" @ended="videoEnded()">
        <source src=""
                type="video/mp4">
      </video>
    </div>
    <!-- 视频列表 -->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide slide-item"
             v-for="(item,index) of videoList"
             @click="changeVideo(index)"
             :key="index">
          <img :src="item.videoLink + '?vframe/jpg/offset/1/w/120/h/90'"
               :class="isactive == index ? 'current-red' : '' " />
          <p class="links-tit">{{ item.videoTitle }}</p>
        </div>
      </div>
    </div>
    <!-- 视频列表end -->

    <!-- 友情链接 -->
    <div class="links-box">
      <div class="friendship-links">
        <p class="links-title">友情链接</p>
        <ul class="links-list">
          <li v-for="(items,index) of linkList"
              class="links-list-item"
              :key="index">
            <a :href="items.link">
              <img :src="items.pic"
                   alt="">
              <p class="links-tit">{{ items.title }}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <v-footer></v-footer>
  </div>

</template>
<script>
import vFooter from '../../components/footer.vue'

export default {
  components: {
    vFooter
  },
  data () {
    return {
      title: '视频展示',
      current: 1,
      size: 50,
      videoTitle: '',
      videoList: [], // 视频列表
      linkList: [],
      isactive: 0
    }
  },
  created () {
    this.title = '视频展示'
    this.queryVideoDetail() // 视频接口
    this.queryFriendshipLinks() // 友情链接接口
  },
  methods: {
    /**
     * 点击视频
     */
    changeVideo (index) {
      var souceHtml = "<source src='" + this.videoList[index].videoLink + "' type='video/mp4'>"
      document.querySelector('#myVideo').innerHTML = souceHtml
      this.videoTitle = this.videoList[index].videoTitle
      document.querySelector('#myVideo').load()
      this.isactive = index
      document.querySelector('#myVideo').play();
    },

    videoEnded(){
      var curr = this.isactive;
      curr++;
      if(curr == this.videoList.length){
        curr = 0;
      }
      this.changeVideo(curr);
    },

    /**
    * 请求视频数据
    */
    queryVideoDetail () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/vedio/list'),
        method: 'GET',
        params: this.$http.adornParams({
          current: this.current,
          size: 50
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.videoList = data.records.reverse()
        var souceHtml = "<source src='" + this.videoList[0].videoLink + "' type='video/mp4'>"
        document.querySelector('#myVideo').innerHTML = souceHtml
        document.querySelector('#myVideo').load()
        this.videoTitle = this.videoList[0].videoTitle
      })
    },

    /**
    * 友情链接
    */
    queryFriendshipLinks () {
      this.$http({
        url: this.$http.adornUrl('/friendshipLink/list'),
        method: 'GET',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.linkList = data
      })
    }

  }
}
</script>
<style scoped>
.video-main {
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
}
.foot {
  margin-top: 0;
}
.video-main {
  padding: 0;
  margin: 0;
}
.video-box {
  box-sizing: border-box;
  width: 100%;
  height: 70vw;
  border-bottom: 1px solid rgb(228, 228, 228);
  background: #000;
}
.video-box > video {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.video-title {
  padding: 10px 1em;
  color: black;
  font-size: 13px;
  text-align: center;
}
.video-title > p {
  line-height: 1em;
  font-size: 15px;
}
.swiper-container {
  box-sizing: border-box;
  width: 100%;
  height: 125px;
  margin-top: 2em;
  z-index: 0;
  overflow: hidden;
}
.swiper-wrapper {
  width: 100%;
  text-align: left;
  flex-wrap: nowrap;
  flex-direction: row;
  /* 强制不换行 */
  white-space: nowrap;
  padding-left: 0.3em;
  /* 横向滑动 */
  overflow-x: scroll;
}
.slide-item {
  display: inline-block;
  width: 23.6vw;
  margin-right: 5px;
  margin-bottom: 1.5em;
}
.slide-item > img {
  width: 100%;
  height: 100%;
}
.current-red {
  box-sizing: border-box;
  border: 2px solid rgb(218, 47, 47);
  width:calc(100% - 2px)
}
/* 友情链接 */
.links-box {
  display: block;
  position: fixed;
  bottom:5em;
}
@media screen and (max-height: 600px) {
  .links-box {
    display: block;
    position: relative;
    bottom:5em;
  }
}
.friendship-links {
  box-sizing: border-box;
  /* position: fixed; */
  /* 解决position: fixed;状态下overflow-x: scroll;失效问题 */
  width: 100%;
  /* bottom: 56px; */
  margin-top: calc(50vh - 68vw);
  /* margin-bottom: 5em; */
  overflow-x: auto;
  background: #fff;
}
.links-title {
  text-align: left;
  line-height: 1.5em;
  padding-bottom: 1em;
  color: #333;
  font-size: 13px;
  font-weight: bold;
  margin-left: 5px;
}
.links-list {
  justify-content: flex-start;
  text-align: left;
  flex-wrap: nowrap;
  flex-direction: row;
  /* 强制不换行 */
  white-space: nowrap;
  padding-left: 0.3em;
  /* 横向滑动 */
  overflow-x: scroll;
}
.links-list-item {
  display: inline-block;
  width: 15.1vw;
  margin-bottom: 1.5em;
  margin-right: 0.5em;
  vertical-align: top;
}
.links-list-item > a {
  display: block;
}
.links-list-item > a > img {
  width: 100%;
  height: 10vw;
}
.links-tit {
  height: 1.5em;
  line-height: 1.5em;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
