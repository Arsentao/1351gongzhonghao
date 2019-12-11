<template>
  <div class="song-search">



  <van-dialog
      v-model="popshow" show-confirm-button
      confirm-button-text="继   续">
          <div class="wenxin-div">
        <span class="wenxin-span">告示</span>
        <p class="wenxin-p">本曲库仅提供正版曲目</p>
        <p class="wenxin-p">欢迎拥有版权的人士联系本站提供版权</p>
      </div>
    </van-dialog>




  <van-popup v-model="show" round id="pop" style="width:100%">
    <div class="windows" v-show="ifshow">
       <div class="close">
            <img src="../../assets/images/icon/close.png" @click="leave()">
        </div> 
      <video id="myVideo" autoplay loop poster x5-playsinline="true" preload="auto" 
    x5-video-player-fullscreen="true" webkit-playsinline="true" x-webkit-airplay="true" playsinline="true"
            width="100%" controls style="margin-top:5%"> 
             <source src=""
                type="video/mp4">
      </video>
      <div class="tips"><span style="background-color:#4d79ff;color:white;padding:3px;">温馨提示:</span></br>该曲属琴侣预装曲目</div>
      <router-link to="/goodsDetails/89"><button class="btn_buy">购买琴侣</button></router-link>
      <router-link to="/video"><button class="btn_video">观看琴侣动漫</button></router-link>
    </div>


    <div class="window" v-show="theshow">
       <div class="close">
            <img src="../../assets/images/icon/close.png" @click="leave()">
        </div> 
      <audio controls id="myaudio" style="margin-top:5%"> 
             <source src="">
      </audio>
      <router-link to="/goodsDetails/89"><button class="btn_buy">购买琴侣</button></router-link>
      <router-link to="/video"><button class="btn_video">观看琴侣动漫</button></router-link>
      <div id="info">该视频正在制作中，请先试听歌曲</div>
    </div>
  </van-popup>






    <div class="head-wrap">
      <div class="head-fixed">
        <div class="song-search-ban">
          <a href="/songCart"
             class="car-icon"></a>
          <!-- 搜索框 -->
          <div class="search-box">
            <img src="../../assets/images/icon/search.png"
                 alt=""
                 class="song-search-icon1">
            <input type="text"
                   placeholder="输入关键字"
                   v-model="searchStr"
                   id="serach-int" />
            <img src="../../assets/images/icon/del.png"
                 alt=""
                 class="song-search-icon2"
                 @click="deleteSearchKey">
          </div>
          <span class="song-search-btn"
                v-on:click="search()">搜索</span>
        </div>
        <div class="song-search-tab">
          <ul>
            <li :class="{ 'li-active': method === 0, 'desc':sortType==1 }"
                @click="activeNav(0)">综合<i class="icon-up"></i><i class="icon-down"></i></li>
            <li :class="{ 'li-active': method == 1, 'desc':sortType==1 }"
                @click="activeNav(1)">人气<i class="icon-up"></i><i class="icon-down"></i></li>
            <li :class="{ 'li-active': method == 2, 'desc':sortType==1  }"
                @click="activeNav(2)">难度<i class="icon-up"></i><i class="icon-down"></i></li>
            <li :class="{ 'li-active': method == 3, 'desc':sortType==1  }"
                @click="activeNav(3)">价格<i class="icon-up"></i><i class="icon-down"></i></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="song-search-list">
      <ul>
        <li id="music"
          v-for="(item,index) in records"
          :to="'/player/' + item.musicId"
          :key="item.musicId"
          class="music-score">

          <!-- top前三 -->
          <div :class="['song-search-list-div1','song-search-top'+index]"></div>
          <!-- 排序 -->
          <span class="serial-num">{{ sorting(index+1) }}</span>
          <!-- 曲名价格 -->
          <div class="song-search-list-div2">
            <p class="song-search-list-p1">{{item.musicName}}</p>
            <div class="song-search-list-div2-div">
              <button v-if="item.price!=0" class="song-search-list-btn1">￥{{item.price}}</button>
              <button v-if="item.price==0" class="star">￥{{item.price}}</button>
              <span class="song-search-li1-img3"
                    v-for="idx of item.heat"
                    :key="item.musicId + '-h-' +idx"></span>
              <span class="song-search-li1-img2"
                    v-for="idx2 of item.difficult"
                    :key="item.musicId + '-d-' +idx2"></span>
              <button v-show="item.price==0" class="star">购机赠送</button>
            </div>
          </div>

          <div class="play">
          <img src="../../assets/images/icon/play.png"
                     alt=""
                     @click="showPopup(item.auditionUrl)"
                     class="song-search-li1-img5">
          </div>



       




          <div class="song-search-list-div3">


            <!-- <div :class="['song-search-list-div3-div',{'playing':item.musicId==curMusicId}]">
              <div class="img-cart">
              <button v-on:click.stop="addToCart(item.musicId)"
                      v-if="totalCartNum>=0">
                <img src="../../assets/images/icon/shop.png"
                     alt=""
                     class="song-search-li1-img4">
              </button>
                </div>
            </div> -->


            <button class="song-search-list-btn2" v-if="item.price!=0"
                     v-on:click.stop="buyNow(item.musicId,index)">立即购买</button>
              <router-link to="/goodsDetails/89" v-if="item.price==0">
              <button class="song-search-list-btn2" >立即购买</button>
              </router-link>
          </div>


          <audio :src="item.auditionUrl"
                 :ref="'myAudio'+item.musicId"></audio>
        </li>
      </ul>
    </div>
    <!-- loading -->
    <div class="prompt"
         v-if="totalPage>1">
      <span>{{loadingMsg}}</span>
    </div>
  
    <foot-nav class="foot"></foot-nav>
  </div>

</template>
<script>
// import { Toast } from 'vant'
import { Popup } from 'vant'
import { Button} from 'vant'
import footNav from '../../components/footer'
export default {
  components: {
    footNav
  },
  totalCartNum: {
    type: Number,
    default: 0
  },
  data () {
    return {
      key: '',
      records: [],
      totalPage: 1,
      current: 1,
      size: 10,
      method: 0,
      prodNum: 1,
      searchStr: '',
      tabarIndex: 1,
      totalCartNum: 0,
      loading: true,
      loadingMsg: '正在加载......',
      auditionUrl: '',
      sortType: 1, // 排序类型(1：降序 0：升序)
      curMusicId: 0, // 当前播放的音乐ID
      nowSec: 0,
      second: 0,
      tiemr: null,
      show: false,
      VideoUrl: '',
      ifshow: false,
      format: '',
      theshow: false,
      popshow: false
    }
  },
  created () {
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' });
    window.addEventListener('scroll', this.onScroll)
    this.loading = true
    this.show = true
    this.popshow = true
    this.queryMusicList(1)
  },
  methods: {
    //弹窗
    showPopup(url) {
      var format = url.slice(-3)
      this.show = true
      if (format=="mp3"){
      this.theshow = true
      this.ifshow = false
      var souceHtml = "<source src='" + url + "'>"
      document.querySelector('#myaudio').innerHTML = souceHtml
      document.querySelector('#myaudio').load()
      document.querySelector('#myaudio').play()
      }
      else {
      this.theshow = false
      this.ifshow = true
      var souceHtml = "<source src='" + url + "' type='video/mp4'>"
      document.querySelector('#myVideo').innerHTML = souceHtml
      document.querySelector('#myVideo').load()
      }
      },

     

    //离开弹窗
    leave(){
    this.show = false
    document.querySelector('#myaudio').pause()
    },


    sorting (index) {
      return index < 10 ? '0' + index : index
    },

    /**
     * 播放试听
     */
    playMusic (musicId) {
      if (this.curMusicId != 0) {
        this.stopMusic(this.curMusicId)
      }
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var audioId = 'myAudio' + musicId
      var audio = this.$refs[audioId][0]
      let playPromise
      playPromise = audio.play()
      var that = this
      if (playPromise) {
        playPromise.then(() => {
          this.curMusicId = musicId
          this.$toast.clear()
          this.second = audio.duration
          this.nowSec = 0
          this.tiemr = setInterval(() => {
            console.log(that.nowSec)
            that.nowSec++
            if (that.nowSec >= that.second) {
              audio.pause()
              audio.load()
              that.nowSec = 0
              that.curMusicId = 0
              clearInterval(that.tiemr)
            }
          }, 1000)
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
    stopMusic (musicId) {
      var audioId = 'myAudio' + musicId
      var audio = this.$refs[audioId][0]
      this.curMusicId = 0
      audio.pause()
      audio.load()
      clearInterval(this.tiemr)
    },

    // 搜索
    search () {
      this.queryMusicList(1)
    },

    // 切换菜单样式
    activeNav (index) {
      if (this.method != index) {
        this.sortType = 1
      } else {
        if (this.sortType == 0) {
          this.sortType = 1
        } else {
          this.sortType = 0
        }
      }
      this.method = index
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })

      this.queryMusicList(1)
    },

    // 搜索（删除按钮）
    deleteSearchKey () {
      this.searchStr = ''
      this.queryMusicList(1)
    },

    // 分页
    onScroll () {
      // 可滚动容器的高度
      let innerHeight = document.querySelector('#app').clientHeight
      // 屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight
      // 可滚动容器超出当前窗口显示范围的高度
      let scrollTop = document.body.scrollTop
      // scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      if (innerHeight < (outerHeight + scrollTop + 100)) {
        if (this.loading || this.current >= this.totalPage) {
          return
        }
        this.current = this.current + 1
        this.loading = true
        this.queryMusicList(this.current)
      }
    },

    queryMusicList (pageNum) {
      // 进入加载
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      // 加载更多操作
      this.$http({
        url: this.$http.adornUrl('/music/queryMusicList'),
        method: 'get',
        params: this.$http.adornParams({
          current: pageNum,
          size: 10,
          method: this.method,
          searchStr: this.searchStr,
          sortType: this.sortType
        })
      }).then(({ data }) => {
        this.$toast.clear()
        if (data.current == 1) {
          this.records = data.records
        } else {
          this.records = this.records.concat(data.records)
        }
        this.show = false
        this.loading = false
        this.totalPage = data.pages
        this.current = data.current
        this.method = this.method
        if (this.totalPage == this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
      })
    },

    /**
    * 加入购物车
    */
    addToCart (musicId) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/musicCart/addMusicItem'),
        method: 'POST',
        data: musicId
      }).then(({ data }) => {
        this.$toast.clear()
        this.$toast('加入购物车成功')
        // this.totalCartNum = this.totalCartNum + this.prodNum
      })
    },

    /**
     * 立即购买
     */
    buyNow (musicId,index) {
        sessionStorage.setItem('price', this.records[index].price)
        sessionStorage.setItem('price1',this.records[index].price1)
        sessionStorage.setItem('musicid',musicId)
        this.$router.push('/priceSearch')
      },
  

    /**
    * 获取购物车数量
    */
    getCartTotalCount () {
      this.$http({
        url: this.$http.adornUrl('/p/shopCart/prodCount'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.totalCartNum = data
      })
    }
  }
}
</script>
<style scoped>
.head-wrap {
  margin-bottom: 6rem;
  z-index: 1000;
}
.head-fixed {
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 1000;
}
.song-search {
  /* position: fixed; */
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  z-index: -99;
  overflow: auto;
}
.song-search-ban {
  position: relative;
  padding: 1em 0;
  background: #e0e0e0;
}
/* 搜索框 */
.search-box {
  display: inline-block;
  width: 60vw;
  left: 4.5em;
  position: relative;
  background: #fff;
  border-radius: 30px;
}
.search-box > input {
  border: none;
}
.song-search-ban input[type="text"] {
  display: inline-block;
  width: 70%;
  height: 30px;
  border: none;
  outline: none;
  font-size: 13px;
}
.song-search-btn {
  font-size: 13px;
  box-sizing: border-box;
  padding-left: 6em;
}
.song-search-icon1 {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 0.5rem;
  top: 6px;
  color: #b2b2b2;
}
.song-search-icon2 {
  width: 1.5em;
  height: 1.5em;
  right: 2.5vw;
  top: 0.5em;
  position: absolute;
  color: #b2b2b2;
}
.car-icon {
  position: absolute;
  left: 2em;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: 2.5em;
  height: 2.5em;
  background: url("../../assets/images/icon/shopping-car.png") no-repeat;
  background-size: 100%;
}
.song-search-li1-img3,
.song-search-li1-img2 {
  display: inline-block;
  width: 4.5vw;
  height: 4.5vw;
  vertical-align: bottom;
  vertical-align: middle;
}
.song-search-li1-img3 {
  background: url("../../assets/images/icon/lajiao.png") no-repeat;
  background-size: 100%;
}
.song-search-li1-img2 {
  background: url("../../assets/images/icon/huasheng.png") no-repeat;
  background-size: 100%;
}
.song-search-tab {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
  position: relative;
  background: #fff;
}
.song-search-tab ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.song-search-tab li {
  position: relative;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 40px;
  display: flex;
  padding: 0 3.2vw;
}
/* 升降序三角 */
.song-search-tab li i {
  width: 0.4em;
  height: 0.4em;
  position: absolute;
  right: 0;
  top: 38%;
  display: none;
  /* transform: translateY(-50%); */
}
.song-search-tab li.li-active i.icon-up {
  background: url("../../assets/images/icon/shengxu_hong@2x.png") no-repeat;
  background-size: 100%;
}
.song-search-tab li.li-active i.icon-down {
  background: url("../../assets/images/icon/jiangxu_hei@2x.png") no-repeat;
  background-size: 100%;
  top: 51%;
}
.song-search-tab li.li-active i {
  display: block;
}
.song-search-tab li.li-active.desc i.icon-up {
  background: url("../../assets/images/icon/shengxu_hei@2x.png") no-repeat;
  background-size: 100%;
}
.song-search-tab li.li-active.desc i.icon-down {
  background: url("../../assets/images/icon/jiangxu_hong@2x.png") no-repeat;
  background-size: 100%;
  top: 51%;
}
/* 列表 */
.li-active {
  border-bottom: 1px solid red;
  color: red;
}
/* .song-search-list {
  margin-bottom: 3em;
} */
.song-search-list ul {
  padding: 0 1em;
  height: 100%;
  background: #fff;
}
.song-search-list li {
  position: relative;
  margin-left: 3em;
  padding-top: 10px;
  padding-bottom: 1em;
  text-align: left;
  border-bottom: 1px solid gainsboro;
  background: #fff;
}
.song-search-list li:last-child {
  border-bottom: none;
}
.song-search-list-div1 {
  width: 3em;
  height: 3em;
  display: inline-block;
  position: absolute;
  left: -3.5em;
  top: 15px;
  z-index: 5;
}
.song-search-top0 {
  background: url("../../assets/images/icon/paiming1.png") no-repeat;
  background-size: 100%;
}
.song-search-top1 {
  background: url("../../assets/images/icon/paiming2.png") no-repeat;
  background-size: 100%;
}
.song-search-top2 {
  background: url("../../assets/images/icon/paiming3.png") no-repeat;
  background-size: 100%;
}
/* 排序 */
.serial-num {
  font-size: 18px;
  position: absolute;
  left: -2em;
  top: 1em;
}
.song-search-list-div2 {
  display: inline-block;
  margin-top: 0.6em;
}
.song-search-list-div2 p {
  padding-bottom: 1em;
  width: 58vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
}
.song-search-list-div3 {
  float: right;
}
.song-search-list-div3-div {
  padding-bottom: 0.2em;
}
button {
  background: transparent;
  border: none;
}

.song-search-list-div3-div > button.stop-btn {
  display: none;
}
.song-search-list-div3-div.playing button.play-btn {
  display: none;
}
.song-search-list-div3-div.playing button.stop-btn {
  display: inline-block;
}
.song-search-list-btn1 {
  color: red;
  font-size: 12px;
  border: 1px solid red;
  border-radius: 10%;
  background-color: white;
  padding: 0 0.5em;
  height: 1.5em;
  line-height: 1.5em;
  vertical-align: middle;
}
.song-search-list-btn2 {
  width: 75px;
  height: 28px;
  font-size: 12px;
  color: white;
  border: 1px solid #d6122cd8;
  border-radius: 3px;
  background-color: #d6122cd8;
  font-weight: bold;
  margin-top: 20px;
}

/* 价格/热度/难度 */
.song-search-list-div2-div {
  line-height: 1.5em;
}

.windows {
  width: 100%;
  height: 100%;
  background: white;
  }
.window {
  width: 100%;
  height: 100%;
  background: white;
}

.btn_video {
  width: 35%;
  height: 3rem;
  font-size: 18px;
  color: white;
  border: 1px solid #077210;
  border-radius: 8px;
  background-color: #077210;
  margin-top: 5%;
  margin-left: 1em;
  margin-bottom: 5%;

}

.btn_buy {
  width: 35%;
  height: 3rem;
  font-size: 18px;
  color: white;
  border: 1px solid #d63636;
  border-radius: 8px;
  background-color: #d63636;
  margin-top: 5%;
  margin-right: 1em;
  margin-bottom: 5%;

}


@keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.4;
    }
    to {
        opacity: 1.0;
    }
}

@-webkit-keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.4;
    }
    to {
        opacity: 1.0;
    }
}

.star {
color: red;
font-size: 12px;
border: 1px solid red;
border-radius: 10%;
background-color: white;
padding: 0 0.5em;
height: 1.5em;
line-height: 1.5em;
vertical-align: middle;
animation: fade 600ms infinite;
-webkit-animation: fade 600ms infinite;
}
#info {
  margin-top: 5%;
  font-size: 20px;
  color: crimson;
  font-weight: bold;
  padding-bottom: 30px;
}

.play{
  position: absolute;
  z-index: 100;
  left: 14em;
  top: 2.3em;

}
.play img{
  width: 3em;
  height: 3em;
}
.word-cart{
width: 1.5em;
height: 3em;
background-color: #02a1e9;
color: white;
font-size: 13px;
display: inline-block;
-webkit-writing-mode: vertical-rl;
writing-mode: vertical-rl;
padding: 0.2em
}
.img-cart{
display: inline-block;
text-align: center;
margin-left: 1em;
}

.song-search-li1-img4{
width: 4em;
height: 3em;
}


.close{
text-align: left;
margin-top: 15px;
margin-left: 15px;
}
.close img{
width: 40px;
height: 40px;
}

.tips {
margin-top: 5%;
font-size: 18px;
color: rgb(64,79,219);
line-height: 200%;
width: 50%;
margin-left: 25%;
border: 2px dashed rgb(80, 121, 209);



}
</style>
<style>
/* .van-dialog__confirm .van-button__text{
padding-left: 30px;
padding-right: 30px;
}
.van-dialog{
width: 95%;
} */
</style>