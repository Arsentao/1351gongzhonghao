<template>
  <!-- 精华列表 -->
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
                   v-for="(item,index) in splendidPost"
                   :key="index">
        <h3>{{ item.postTitle }}</h3>
        <!-- 置顶icon -->
        <i class="top-icon"
           v-show="item.isTop === 1"></i>
        <div class="item-content clearfix">
          <div class="head-img" v-if="item.pic">
            <img :src="item.pic"
                 alt=""></div>
          <div class="article-msg">
            <p class="author">{{ item.userId==0?'管理员':item.nickName }}</p>
            <p class="time">{{ item.createTime }}</p>
          </div>
          <!-- 评论 -->
          <div class="right-comment">
            <i class="comment-icon"></i>
            <span class="number">{{ item.commentCount }}</span>
            <!-- <span class="number">123</span> -->
          </div>
          <!-- 添加好友btn -->
          <span class="add-friend"
                v-on:click.stop="queryAddFriend(item.userId)"
                v-if="userId!=item.userId && item.userId!=0">添加好友</span>
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
      splendidPost: [],
      current: 1,
      size: 10,
      totalPage: 1,
      loading: true,
      loadingMsg: '正在加载...',
      categoryId: 0,
      userId:""
    }
  },
  created () {
    this.title = '精华帖子'
    window.addEventListener('scroll', this.onScroll)
    this.loading = true
    this.querysplendidPost()
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
        this.querysplendidPost()
      }
    },

    /**
     * 精华帖子列表
     */
    querysplendidPost () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/post/listByFine'),
        method: 'GET',
        params: this.$http.adornParams({
          current: this.current,
          size: this.size
        })
      }).then(({ data }) => {
        this.$toast.clear()
        if (data.current == 1) {
          this.splendidPost = data.records
        } else {
          this.splendidPost = this.splendidPost.concat(data.records)
        }
        this.current = data.current
        this.loading = false
        this.totalPage = data.pages
        if (this.totalPage === this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
        this.getUserInfo()
      })
    },

    /**
   * // 判断是否是自己的帖子
   */
    getUserInfo () {
      // 拿到自己的信息
      var userinfoStr = localStorage.getItem("userinfo");
      // 将得到的字符串信息转换回json格式
      var userInfo = JSON.parse(userinfoStr);
      this.userId = userInfo.userId;
    },

    /**
    * 请求添加好友
    */
    queryAddFriend (userId) {
      this.$dialog.confirm({
        title: '',
        message: '添加此用户为好友？'
      }).then(() => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/follower/addUser/' + userId),
          method: 'POST'
        }).then(({ data }) => {
          this.$toast = '添加好友成功'
          this.$toast.clear()
        })
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
.top-head {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 1em 1em;
  text-align: right;
  border-bottom: 1em solid #f2f2f2;
  background: #fff;
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
}
.article-list-item {
  position: relative;
  padding: 1em 1.5em;
  padding-left: 2em;
  border-bottom: 1px solid #f1f1f1;
  text-align: left;
  background: #fff;
}
.article-list-item > h3 {
  margin-bottom: 1em;
  font-weight: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
.item-content {
  position: relative;
}
.head-img {
  display: inline-block;
  width: 13vw;
  height: 13vw;
}
.head-img > img {
  width: 100%;
  border-radius: 50%;
}
.article-msg {
  display: inline-block;
  vertical-align: top;
  padding-left: 1em;
}
.author {
  padding-top: 0.5em;
  font-size: 13px;
  color: rgb(97, 97, 97);
  padding-bottom: 1em;
}
.time {
  color: #b4b4b4;
  font-size: 12px;
}
/* 评论 */
.right-comment {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0.4em;
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
  width: 5em;
  vertical-align: middle;
}
/* 添加好友btn */
.add-friend {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgb(209, 1, 1);
  color: #fff;
  padding: 0.3em 0.7em;
  font-size: 10px;
}
</style>
