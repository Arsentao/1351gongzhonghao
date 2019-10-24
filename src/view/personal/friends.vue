<template>
  <div v-wechat-title="this.title">
    <ul class="friends">
      <li class="friend-item"
          v-for="(item,index) of friendsList"
          :key="index">
        <div class="head-portrait">
          <img :src="item.pic"
               alt="">
        </div>
        <div class="friends-name">
          <span>{{ item.nickName }}</span>
        </div>
        <!-- 删除按钮 -->
        <i class="del-icon"
           @click="queryDeleteFriend(item.userId)"></i>
      </li>
    </ul>
    <div class="empty"
         v-if="friendsList.length==0">还没有添加好友哦~</div>
    <!-- loading -->
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
      title: '好友列表',
      current: 1,
      size: 10,
      totalPage: 1,
      loading: true,
      loadingMsg: '正在加载......',
      friendsList: []
    }
  },
  created () {
    this.title = '好友列表'
    window.addEventListener('scroll', this.onScroll)
    this.queryFriendsList() // 请求好友列表
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
      // scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      if (innerHeight < (outerHeight + scrollTop + 100)) {
        if (this.loading || this.current >= this.totalPage) {
          return
        }
        this.current = this.current + 1
        this.loading = true
        this.queryFriendsList()
      }
    },

    /**
     * 请求好友列表
     */
    queryFriendsList () {
      this.$http({
        url: this.$http.adornUrl('/p/follower/myFollowerList'),
        method: 'GET',
        params: this.$http.adornParams({
          current: 1,
          size: 10
        })
      }).then(({ data }) => {
        if (this.current == 1) {
          this.friendsList = data.records
        } else {
          this.friendsList = this.friendsList.concat(data.records)
        }
        this.current = data.current
        this.size = data.size
        this.totalPage = data.pages
        if (this.totalPage == this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
      })
    },

    /**
     * 请求删除好友
     */
    queryDeleteFriend (userId) {
      this.$dialog.confirm({
        title: '',
        message: '确定删除此用户？'
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
          url: this.$http.adornUrl('/p/follower/delUser/' + userId),
          method: 'DELETE'
        }).then(({ data }) => {
          this.$toast('删除成功')
          this.queryFriendsList()
        })
      })
    },

  }
}
</script>

<style scoped>
img {
  width: 100%;
}
ul.friends {
  box-sizing: border-box;
  padding: 0 1em;
  color: black;
  background: #fff;
}
li.friend-item {
  position: relative;
  box-sizing: border-box;
  padding: 0.85em 0;
  text-align: left;
  border-bottom: 1px solid #eeeeee;
}
.head-portrait {
  display: inline-block;
  width: 2.2rem;
  height: 2.2rem;
  padding-right: 1em;
  overflow: hidden;
}
.head-portrait > img {
  border-radius: 50%;
}
.friends-name {
  display: inline-block;
  /* 溢出省略号 */
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-bottom: 0.5em;
}
.friends-name > span {
  font-size: 14px;
  letter-spacing: 1px;
}

.del-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.del-icon {
  right: 0;
  display: inline-block;
  width: 1.7em;
  height: 1.7em;
  background: url("../../assets/images/personal/del-icon.png") no-repeat;
  background-size: 1.7em 1.7em;
}
</style>
