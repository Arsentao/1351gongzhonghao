<template>
  <!-- 悬赏列表 -->
  <div class="special-edition"
       v-wechat-title="this.title">
    <!-- 上部 -->
    <div class="top-box">
      <div class="top-head">
        <router-link tag="div"
                     to="/search"
                     class="serch">
          <i class="serch-icon"></i>
          <span class="top-head-txt">搜索</span>
        </router-link>
      </div>
    </div>
    <!-- 帖子列表 -->
    <ul class="article-list">
      <router-link tag="li"
                   :to="'/postDetail/' + item.postId"
                   class="article-list-item"
                   v-for="(item,index) in rewardPostList"
                   :key="index">
        <h3>{{ item.postTitle }}</h3>
        <!-- 置顶icon -->
        <i class="top-icon"
           v-show="item.isTop === 1"></i>
        <div class="item-content clearfix">
          <div class="head-img">
            <p class="time">{{ item.createTime }}</p>
          </div>
          <div class="right-comment">
            <i class="comment-icon"></i>
            <span class="number">{{ item.commentCount }}</span>
          </div>
        </div>
      </router-link>
    </ul>
    <div class="prompt"
         v-if="totalPage>1">
      <span>{{loadingMsg}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      postCategoryId: this.$route.params.postCategoryId,
      rewardPostList: [],
      current: 1,
      size: 10,
      totalPage: 1,
      loading: true,
      loadingMsg: '正在加载...',
      categoryId: 0
    }
  },
  created () {
    this.title = '悬赏列表'
    window.addEventListener('scroll', this.onScroll)
    this.loading = true
    this.queryRewardPost()
  },
  methods: {
    /**
     * 分页
     */
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
        this.queryRewardPost()
      }
    },

    /**
     * 悬赏帖子列表
     */
    queryRewardPost () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/post/listByReward'),
        method: 'GET',
        params: this.$http.adornParams({
          current: this.current,
          size: this.size
        })
      }).then(({ data }) => {
        this.$toast.clear()
        if (data.current == 1) {
          this.rewardPostList = data.records
        } else {
          this.rewardPostList = this.rewardPostList.concat(data.records)
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
ul,
li {
  box-sizing: border-box;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
/* 上部 */
.top-box {
  display: block;
  margin-bottom: 43px;
}
.top-head {
  position: fixed;
  top: 0;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 1em;
  text-align: right;
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
  z-index: 111;
}
.serch,
.posting {
  display: inline-block;
  margin-left: 1.5em;
  font-size: 14px;
}
.serch-icon,
.write-icon {
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
}
.serch-icon {
  background: url("../../assets/images/icon/search_black.png") no-repeat;
  background-size: 1.3em 1.3em;
  vertical-align: middle;
}
.write-icon {
  background: url("../../assets/images/icon/write_black.png") no-repeat;
  background-size: 1.3em 1.3em;
  vertical-align: middle;
}
/* 列表 */
.article-list {
  background: #fff;
  border-top: 1em solid #f2f2f2;
}
.article-list-item {
  position: relative;
  padding: 1em 1.5em;
  border-bottom: 1px solid #f1f1f1;
  text-align: left;
  background: #fff;
}
.article-list-item > h3 {
  margin-bottom: 1em;
  font-weight: normal;
  text-align: justify;
  /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
  font-size: 15px;
}
.top-icon {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 2.7em;
  height: 2.7em;
  background: url("../../assets/images/forum/top-icon.png") no-repeat;
  background-size: 100%;
}
.article-msg {
  display: inline-block;
  vertical-align: top;
  padding-left: 1em;
}
.author {
  padding-top: 0.6em;
  font-size: 13px;
  color: rgb(97, 97, 97);
  padding-bottom: 0.7em;
}
.time {
  color: #b4b4b4;
  font-size: 12px;
}
/* 评论 */
.right-comment {
  display: inline-block;
  position: absolute;
  right: 1.5em;
  bottom: 1.3em;
}
.comment-icon {
  display: inline-block;
  width: 1.2em;
  height: 1em;
  background: url("../../assets/images/forum/comment-icon.png") no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
}
.number {
  color: #b4b4b4;
}
</style>
