<template>
  <div class="player-mian">
    <!-- <div class="player-img">
      <img src="../../assets/images/icon/playertp.png"
           alt="">
    </div> -->
    <div class="player-title">
      <h3 class="player-titlename">{{musicInfo.musicName}}</h3>
      <br />
      <h3 class="player-author">{{musicInfo.musicBrief}}</h3>
    </div>
    <div class="opt-main">
      <div class="fun-nav">
        <div class="player-price">
          <p class="player-p1">￥</p>
          <p class="player-p2">{{musicInfo.price}}</p>
        </div>

        <div class="player-shop">
          <div class="player-shop-icon1"
               @click="buyNow">
            <img src="../../assets/images/icon/playergoumai.png"
                 alt="">
            <p>立即购买</p>
          </div>
          <div class="player-shop-icon2"
               @click="addToCart">
            <img src="../../assets/images/icon/player-gouwuche.png"
                 alt="">
            <p>加入购物车</p>
          </div>
          <div class="player-shop-icon3"
               @click="toCart">
            <img src="../../assets/images/icon/qupugouwuche.png"
                 alt="">
            <p>曲谱购物车</p>
          </div>
        </div>

      </div>
      <div class="player-shop-pmgressbar">
        <div class="pmgressbar-div1">
          <!-- <div class="pmgressbar-div2"></div> -->
          <van-progress :percentage="getPercentage()"
                        pivot-text="" />
        </div>
        <div class="pmgressbar-p">
          <p class="pmgressbar-p1">{{toSecondStr(nowSec)}}</p>
          <p class="pmgressbar-p2">{{toSecondStr(second)}}</p>
        </div>
      </div>
      <div class="player-icon">
        <img src="../../assets/images/icon/up.png"
             alt=""
             class="player-icon1"
             @click="prevMusic()">
        <img src="../../assets/images/icon/start.png"
             alt=""
             class="player-icon2"
             @click="playMusic"
             v-if="!playing">
        <img src="../../assets/images/icon/stop.png"
             alt=""
             class="player-icon2"
             @click="stopMusic"
             v-if="playing">
        <img src="../../assets/images/icon/next.png"
             alt=""
             class="player-icon3"
             @click="nextMusic()">
      </div>
    </div>
    <!-- 价格栏 -->
    <audio :src="musicInfo.auditionUrl"
           ref="myAudio"></audio>
  </div>
</template>
<script>
import Vue from 'vue'
import { Progress } from 'vant'
Vue.use(Progress)
export default {
  data () {
    return {
      musicId: this.$route.params.musicId,
      musicInfo: {},
      tiemr: null,
      second: 0,
      nowSec: 0,
      tempSec: 0,
      playing: false
    }
  },
  created () {
    this.info()
  },
  methods: {
    /**
     * 秒数转换
     */
    toSecondStr (num) {
      return '00:' + (num < 10 ? '0' + num : num)
    },

    /**
     * 计算百分比
     */
    getPercentage () {
      if (this.second == 0) {
        return 0
      }
      return this.tempSec * 10 / this.second
    },

    /**
     * 播放试听
     */
    playMusic () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var audio = this.$refs.myAudio
      // console.log(audio);
      let playPromise
      playPromise = audio.play()
      var that = this
      if (playPromise) {
        playPromise.then(() => {
          this.$toast.clear()
          that.playing = true
          console.log(audio.duration)
          that.tiemr = setInterval(() => {
            that.tempSec++
            if (that.tempSec % 10 == 0) {
              that.nowSec++
            }
            if (that.nowSec >= that.second) {
              that.playing = false
              audio.pause()
              audio.load()
              that.nowSec = 0
              that.tempSec = 0
              clearInterval(that.tiemr)
            }
          }, 100)
        }).catch((e) => {
          // 音频加载失败
          this.$toast.clear()
          this.$toast('未找到播放资源~')
          // console.error(e);
        })
      }
    },

    /**
     * 停止播放
     */
    stopMusic () {
      var audio = this.$refs.myAudio
      audio.pause()
      audio.load()
      this.nowSec = 0
      this.tempSec = 0
      this.playing = false
      clearInterval(this.tiemr)
    },

    /**
     * 上一首
     */
    prevMusic () {
      if (this.playing) {
        this.stopMusic()
      }
      if (this.musicInfo.lastMusicId) {
        this.musicId = this.musicInfo.lastMusicId
        this.$router.replace('/player/' + this.musicInfo.lastMusicId)
        this.info()
      }
    },

    /**
     * 下一首
     */
    nextMusic () {
      if (this.playing) {
        this.stopMusic()
      }
      if (this.musicInfo.nextMusicId) {
        this.musicId = this.musicInfo.nextMusicId
        this.$router.replace('/player/' + this.musicInfo.nextMusicId)
        this.info()
      }
    },

    /**
     * 获取曲谱信息
     */
    info () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/music/info'),
        method: 'get',
        params: this.$http.adornParams({
          musicId: this.musicId
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.musicInfo = data
        var that = this
        setTimeout(() => {
          var audio = this.$refs.myAudio
          audio.load()
          audio.oncanplay = function () {
            that.second = Math.round(audio.duration)
          }
        }, 200)
      })
    },

    /**
    * 加入购物车
    */
    addToCart () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/musicCart/addMusicItem'),
        method: 'POST',
        data: this.musicId
      }).then(({ data }) => {
        this.$toast.clear()
        this.$toast('加入购物车成功')
        // this.totalCartNum = this.totalCartNum + this.prodNum
      })
    },

    /**
     * 立即购买
     */
    buyNow () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/music/order/buy'),
        method: 'POST',
        data: this.musicId
      }).then(({ data }) => {
        this.$toast.clear()
        console.log(data)

        sessionStorage.setItem('orderNo', data.orderNo)
        sessionStorage.setItem('songTotal', this.musicInfo.price)
        this.$router.push('/songpay')
        // this.totalCartNum = this.totalCartNum + this.prodNum
      })
    },

    /**
     * 去购物车页面
     */
    toCart () {
      this.$router.push('/songCart')
    }
  }

}
</script>
<style scoped>
.opt-main {
  position: fixed;
  bottom: 40px;
  width: 100%;
}
.player-mian {
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  background: url(../../assets/images/icon/playerbg.png) no-repeat center;
}
.player-img img {
  height: 120px;
  margin-top: 3rem;
}
.player-title {
  display: block;
  margin: 1.5em 0;
}
.player-titlename {
  font-size: 16px;
  /* margin-top: 30px; */
  letter-spacing: 5px;
  color: white;
  font-weight: lighter;
}
.player-author {
  font-size: 12px;
  letter-spacing: 5px;
  color: white;
  font-weight: lighter;
  padding: 0 20px;
  line-height: 2em;
}
.player-price {
  display: inline-block;
  color: red;
  text-align: center;
  padding-bottom: 1.5em;
}
.player-p1 {
  float: left;
  position: absolute;
  padding-top: 5px;
}
.player-p2 {
  font-size: 22px;
  margin-left: 12px;
  display: flex;
}
.player-p1 {
  float: left;
  font-size: 13px;
}
.fun-nav {
  margin-top: 2.5rem;
}
.player-shop {
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  margin: 0 1em;
  font-size: 15px;
}
.player-shop img {
  width: 40px;
  height: 40px;
}
.pmgressbar-div1 {
  width: 85%;
  height: 5px;
  border-radius: 20px;
  margin: auto;
  margin-top: 20px;
}
.pmgressbar-div2 {
  left: 100%;
  top: 5px;
  width: 10px;
  height: 5px;
  background: gainsboro;
  border-radius: 20px;
}
.pmgressbar-p {
  color: aliceblue;
}
.pmgressbar-p1 {
  float: left;
  padding-left: 8%;
  margin-top: 15px;
}
.pmgressbar-p2 {
  float: right;
  padding-right: 8%;
  margin-top: 15px;
}
.player-icon1 {
  width: 1.8rem;
  height: 1.8rem;
  padding: 10px;
}
.player-icon3 {
  width: 1.8rem;
  height: 1.8rem;
  padding: 10px;
}
.player-icon2 {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 30px;
}
.player-icon {
  margin-top: 2rem;
  text-align: center;
}
</style>
