<template>
  <div v-wechat-title="$route.meta.title">
    <!-- 头部搜索框 -->
    <div class="head-fixed">
      <div class="song-search-ban">
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
    </div>
    <!-- /头部搜索框 -->



    <ul class="goods">
      <router-link tag="li"
                   :to="'/goodsDetails/' + items.prodId"
                   v-for="(items, index) in prodList"
                   :key="index"
                   class="clearfix">
        <div class="goods-img">
          <img :src="items.pic"
               alt="" />
        </div>
        <div class="item-cnt clearfix">
          <p class="cnt-tit">{{ items.prodName }}</p>
          <p class="cnt-brief">{{ items.brief }}</p>
          <p class="item-bottom clearfix">
            <span class="goods-price">
              <i class="sub">￥</i>
              {{ items.price }}
            </span>
          </p>
          <span class="buynow">立即购买</span>
        </div>
      </router-link>
    </ul>
    <div class="info">
      <p class="detail">两件以上包邮</p>
      <p class="detail">十件95折</p>
      <p class="detail">二十件92折</p>
    </div>
    <div class="prompt"
         v-if="totalPage>1">
      <span>{{loadingMsg}}</span>
    </div>

    <!-- 脚部 -->
    <foot-nav></foot-nav>
  </div>
</template>

<script>
// import topHead from '../../components/header'
import footNav from '../../components/footer'
export default {
  components: {
    // topHead,
    footNav
  },
  data () {
    return {
      prodList: [],
      totalPage: 1,
      current: 1,
      loading: true,
      loadingMsg: '正在加载...',
      searchStr: ''
      // tabarIndex: 1

    }
  },
  created () {
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' });
    window.addEventListener('scroll', this.onScroll)
    this.loading = true
    this.getDataList()
  },
  methods: {
    onScroll () {
      // 可滚动容器的高度
      let innerHeight = document.querySelector('#app').clientHeight
      // 屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight
      // 可滚动容器超出当前窗口显示范围的高度
      let scrollTop = document.body.scrollTop
      // scrollTop在页面未滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      if (innerHeight < (outerHeight + scrollTop + 100)) {
        if (this.loading || this.current >= this.totalPage) {
          return
        }
        this.current = this.current + 1
        this.loading = true
        this.getDataList()
      }
    },

    // 搜索
    search () {
      this.loading = true
      this.current = 1
      this.getDataList()
    },

    // 搜索（删除按钮）
    deleteSearchKey () {
      this.searchStr = ''
      this.loading = true
      this.current = 1
      this.getDataList()
    },

    getDataList () {
      // 加载更多操作
      this.$http({
        url: this.$http.adornUrl('/prod/list'),
        method: 'get',
        params: this.$http.adornParams({
          current: this.current,
          size: 10,
          prodName: this.searchStr
        })
      }).then(({ data }) => {
        if (data.current == 1) {
          this.prodList = data.records
        } else {
          this.prodList = this.prodList.concat(data.records)
        }
        this.current = data.current
        this.loading = false
        this.totalPage = data.pages
        if (this.totalPage === this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
      })
    }

  }
}
</script>

<style scoped>
.head-fixed {
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 11;
  top: 0;
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
  width: 77vw;
  left: 2em;
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
  padding-left: 2em;
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

.goods {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: left;
  background: #fff;
  padding: 0.5em;
  margin-top: calc(2em + 30px);
}
.goods > li {
  display: block;
  background: #fff;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
  padding: 1em;
  /* box-shadow: 0 2px 3px 0 rgb(219, 219, 219); */
}
.goods > li:last-child {
  border-bottom: none;
}
.goods-img {
  float: left;
  width: 7.5rem;
  height: 7.5rem;
  padding-right: 1em;
}
.goods-img > img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  text-align: center;
}
.item-cnt {
  position: relative;
}
.cnt-tit {
  text-align: left;
  padding-bottom: 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 20px;
}
.cnt-brief {
  font-size: 11px;
  color: rgb(197, 197, 197);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.item-bottom {
  /* position: absolute;
  display: inline-block; */
  margin-top: 2em;
}
.buynow {
  padding: 0.5em 0.5em;
  color: #fff;
  background: #ee2929;
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 18px;
}
.goods-price {
  float: left;
  padding-top: 1em;
  color: rgb(185, 0, 0);
  font-size: 22px;
}
.goods-price > i {
  font-style: normal;
  font-size: 22px;
}
.info{
margin-top: 10%;
font-size: 18px;
color: rgb(29, 82, 179);
width: 60%;
border: 2px dashed rgb(29, 82, 179);
text-align: center;
line-height: 200%;
margin-left: 20%;
}
</style>
