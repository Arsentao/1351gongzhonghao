<template>
  <!-- 帖子详情(列表) -->
  <div class="post-list"
       v-wechat-title="this.title">
    <!-- top -->
    <div class="top-box">
      <div class="top-head clearfix">
        <router-link tag="span"
                     :to="'/postComment/'+ postId"
                     class="reply">评论</router-link>
        <span class="del"
              v-if="isSelfPost"
              @click="queryDeletePost(postId)">删除</span>
        <span class="alt"
              v-if="isSelfPost"
              v-on:click.stop="toAlterPost()">修改</span>
      </div>
    </div>
    <!-- 帖子 -->
    <div class="post-title">
      <h3>{{ postTitle }}</h3>
      <p class="create-time">创建于&nbsp;&nbsp;{{ createTime }}</p>
      <p v-for="(item,index) in postPic" :key="index"><img class="post-pic"
             :src="item" /> </p>
      <p class="details-txt">{{ postContent }}</p>
      <p class="update-time">更新于&nbsp;&nbsp;{{ updateTime }}</p>
    </div>
    <!-- 评论列表 -->
    <ul class="post-content">
      <li class="content-item"
          v-for="(item,index) of comments"
          :key="index">
        <div class="item-top clearfix">
          <div class="head-img">
            <!-- 用户头像 -->
            <img :src="item.pic"
                 alt=""></div>
          <div class="article-msg">
            <!-- 昵称 -->
            <p class="author">{{ item.nickName }}</p>
            <!-- 创建时间 -->
            <p class="time">{{ item.createTime }}</p>
          </div>
          <!-- 添加好友btn -->
          <div class="right-btn">
            <span class="add-friend"
                  v-if="!isSelfComment"
                  @click="queryAddFriend(item.userId)">添加好友</span>
          </div>
        </div>
        <!-- 评论内容 -->
        <p class="content">{{ item.commentContent }}</p>
        <!-- 评论图片 -->
        <div class="commnet-img"><img :src="item.commentPic" /></div>
        <!-- 删除btn -->
        <div class="fel-btn"
             v-if="isSelfComment"
             @click="queryDeleteComment(item.commentId)">删除</div>
      </li>
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
      title: '帖子详情',
      postId: this.$route.params.postId,
      userId: '', // 用户id
      postTitle: '', // 标题
      postContent: '', // 内容
      postPic: [], // 图片
      postCategoryId: 0, // 帖子分类Id
      createTime: '', // 创建时间
      updateTime: '', // 更新时间
      comments: [], // 评论列表
      totalPage: 2,
      current: 1,
      size: 10,
      loading: true,
      loadingMsg: '正在加载...',
      // sectionList: [],
      isSelfPost: false, // 是否是自己的帖子
      isSelfComment: false  // 是否是自己的评论
    }
  },
  created () {
    this.title = '帖子详情'
    window.addEventListener('scroll', this.onScroll)
    this.loading = true
    this.queryPostDetail()  // 帖子详情
    this.queryComments()   // 评论列表
  },

  methods: {
    /**
     * 请求帖子详情
     */
    queryPostDetail () {
      this.$http({
        url: this.$http.adornUrl('/p/post/postInfo'),
        method: 'get',
        params: this.$http.adornParams({
          postId: this.postId,
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.postCategoryId = data.postCategoryId
        this.postTitle = data.postTitle
        if(data.postPic){
          this.postPic = data.postPic.split(',');
        }
        this.postContent = data.postContent
        this.createTime = data.createTime
        this.updateTime = data.updateTime
        this.userId = data.userId
        this.getUserInfo()
      })
    },
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
        this.queryComments()
      }
    },

    /**
     * 评论列表
     */
    queryComments () {
      this.$http({
        url: this.$http.adornUrl('/p/post/comment/listByPostId'),
        method: 'GET',
        params: this.$http.adornParams({
          postId: this.postId,
          // postCategoryId: this.postCategoryId,
          current: this.current,
          size: 10
        })
      }).then(({ data }) => {
        this.$toast.clear()
        if (data.current == 1) {
          this.comments = data.records
        } else {
          this.comments = this.comments.concat(data.records)
        }
        this.current = data.current
        this.loading = false
        this.totalPage = data.pages
        this.getUserInfo()
        if (this.totalPage === this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
      })
    },

    /**
     * // 判断是否是自己的帖子
     */
    getUserInfo (index) {
      // 拿到自己的信息
      var userinfoStr = localStorage.getItem("userinfo");
      // 将得到的字符串信息转换回json格式
      var userInfo = JSON.parse(userinfoStr);
      if (this.userId == userInfo.userId) {
        this.isSelfPost = true;
      }
      if (this.comments[index].userId == userInfo.userId) {
        this.isSelfComment = true
      }
    },

    /**
     * 删除帖子
     */
    queryDeletePost (postId) {
      this.$dialog.confirm({
        title: '',
        message: '确认要删除此帖子？'
      }).then(() => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/post/' + postId),
          method: 'DELETE',
          params: this.$http.adornParams({})
        }).then(({ data }) => {
          this.$toast('删除成功')
          this.$router.go(-1)
        })
      })
    },

    /**
     * 删除评论
     */
    queryDeleteComment (commentId) {
      this.$dialog.confirm({
        title: '',
        message: '确认要删除此评论？'
      }).then(() => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/post/comment/' + commentId),
          method: 'DELETE',
          params: this.$http.adornParams({})
        }).then(({ data }) => {
          this.$toast('删除成功')
          this.$toast.clear()
          // this.$router.go(-1)
          this.queryComments()
        })
      })
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
    },

    // 修改
    toAlterPost () {
      this.$router.push('/posting?postId=' + this.postId)
    }

  }
}
</script>

<style scoped>
ul,
li {
  box-sizing: border-box;
}
/* 清除浮动 */
.clearfix::after {
  display: block;
  content: "";
  clear: both;
}
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
.tit {
  font-size: 14px;
  float: left;
}
.reply {
  float: right;
  color: #e61900;
  font-size: 14px;
  color: rgb(1, 60, 116);
}
.del,
.alt {
  float: left;
  font-size: 14px;
}
.del {
  margin-right: 2em;
  color: #e61900;
}
.alt {
  color: rgb(1, 60, 116);
}
/* 帖子 */
.post-title {
  box-sizing: border-box;
  padding: 1em;
  border-bottom: 1px solid #f4f4f4;
  text-align: left;
  background: #fff;
  margin-top: 4.5em;
}
.post-pic {
  width: 100%;
}
.details-txt {
  margin-top: 0.5em;
  font-size: 15px;
  line-height: 1.7em;
  text-align: justify;
}
.post-title > h3 {
  line-height: 1.5em;
  font-size: 17px;
  letter-spacing: 1px;
  margin-bottom: 0.5em;
  text-align: justify;
}
.create-time {
  margin-bottom: 1em;
}
.create-time,
.update-time {
  font-size: 13px;
  color: #bbbbbb;
}
.update-time {
  text-align: right;
  margin-top: 2em;
}
.label {
  display: inline-block;
  margin-top: 1em;
  background: #f2f2f2;
  color: #999;
  padding: 3px 1em;
  border-radius: 35px;
}
/* 内容 */
.post-content {
  box-sizing: border-box;
  padding: 1em;
  background: #fff;
}
.content-item {
  box-sizing: border-box;
  position: relative;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 1em;
  background: #fff;
  text-align: right;
}
.item-top {
  box-sizing: border-box;
  position: relative;
  text-align: left;
  margin-bottom: 1em;
}
.head-img {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
}
.head-img > img {
  border-radius: 50%;
  width: 100%;
}
.article-msg {
  display: inline-block;
  vertical-align: top;
  padding-left: 1em;
}
.author {
  padding-top: 0.6em;
  font-size: 12px;
  color: rgb(97, 97, 97);
  padding-bottom: 0.7em;
}
.time {
  color: #b4b4b4;
  font-size: 11px;
}
.commnet-img {
  text-align: center;
  margin-bottom: 0.5em;
}
.commnet-img > img {
  width: 60%;
}
/* 添加好友 */
.right-btn {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0.5em;
}
.add-friend {
  /* 添加 */
  display: block;
  width: 5em;
  padding: 0.2em 0;
  text-align: center;
  background: #e61900;
  color: #fff;
  font-size: 11px;
}

/* 删除 */
.fel-btn {
  display: inline-block;
  color: #e61900;
  /* margin-top: 0.5em; */
  margin-bottom: 1em;
  padding-right: 1em;
}
.content {
  font-size: 14px;
  line-height: 1.5em;
  letter-spacing: 1px;
  text-align: justify;
  padding-bottom: 0.5em;
}
</style>
