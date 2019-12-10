<template>
  <div class="video-main">
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
    

    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide slide-item"
             v-for="(item,index) of videoList"
             @click="changeVideo(index)"
             :key="index">
          <!-- <div :class="{'current-red':index == isactive}" :id="'vcenter' + index"><span class="title">&nbsp;&nbsp;{{ item.videoTitle }}&nbsp;&nbsp;</span></div> -->
        <img :src="poster[index]" width="100px"  :class="{'current-red':index == isactive}">
        </div>
      </div>
    </div> 




       <div class="garden">
      <router-link to="garden">
      <img src="https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/5.png" width="100px" height="75px">
      </router-link>
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
      current: 1,
      size: 50,
      videoTitle: '',
      videoList: [],
      linkList: [],
      isactive: 0,
      gardenactive: 0,
      gardenList: [
        {videoLink: "http://www.13511351.com/resources/2019/11/f39d735b71624f28ad972c455f739a8e.mp4",
         videoTitle: "金秋华园",
         imgLink: "https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/huayuan.png"
        }
      ],
      poster: [
      "https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/1.png",
      "https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/2.png",
      "https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/3.png",
      "https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/4.png"
      ]
    }
  },
  created () {
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' });
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


 changeGarden (index) {
      var souceHtml = "<source src='" + this.gardenList[index].videoLink + "' type='video/mp4'>"
      document.querySelector('#myVideo').innerHTML = souceHtml
      this.videoTitle = this.gardenList[index].videoTitle
      document.querySelector('#myVideo').load()
      this.gardenactive = index
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
  overflow: scroll;
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
  /* height: 70vw; */
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
  margin-top: 0.5em;
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
  margin-right: 25px;
  margin-bottom: 1.5em;
}
.slide-item > img {
  width: 100%;
  height: 100%;
}
.current-red {
  border: 2px solid rgb(218, 47, 47)
}
/* 友情链接 */
.links-box {
  display: block;
  position: fixed;
  bottom: 5em;
}
/* @media screen and (max-height: 600px) {
  .links-box {
    display: block;
    position: relative;
    bottom:5em;
  }
} */
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
  font-size: 13px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.friend{
position: absolute;
right: 10px;
bottom: 10px;
}

.friend-link{
font-size: 13px;
font-weight: bold;
}


.list {
margin-left: 0.3em;
width: 90px;
height: 50px;
background: url('https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/1.png');
background-size: 100px;
background-repeat: no-repeat;
}

.type{
font-weight: bold;
font-size: 16px;
text-align: center;
background: url('https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/1.png');
background-size: 100px;
width: 100px;
height: 100px;
background-repeat: no-repeat;
background-position: 50%;


}

#vcenter{
width: 100px;
height: 50px;
background: url("https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/huayuan.png");
background-size: 100% 100%;
padding-top: 25px;
font-weight: bold;
text-align: center;
}


#vcenter0{
width: 100px;
height: 50px;
background: url("https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/1.png");
background-size: 100% 100%;
padding-top: 25px;
font-weight: bold;
text-align: center;
}


#vcenter1{
width: 100px;
height: 50px;
background: url("https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/2.png");
background-size: 100% 100%;
padding-top: 25px;
font-weight: bold;
text-align: center;
}


#vcenter2{
width: 100px;
height: 50px;
background: url("https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/3.png");
background-size: 100% 100%;
padding-top: 25px;
font-weight: bold;
text-align: center;
}

#vcenter3{
width: 100px;
height: 50px;
background: url("https://fengpu1351-1300303301.file.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/4.png");
background-size: 100% 100%;
padding-top: 25px;
font-weight: bold;
text-align: center;
}


.garden{
text-align: left;
padding-left:0.3em;
margin-top:2em;
}


.title{
background-color: #fff;
color: rgb(43, 31, 218);
font-size: 16px;
}
</style>
