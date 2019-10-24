<template>
  <div class="forum-center"
       v-wechat-title="this.title">
    <!-- 搜索/发帖 -->
    <div class="top-box">
      <div class="top-head">
        <router-link class="serch"
                     to="/search">
          <i class="serch-icon"></i>
          <span class="top-head-txt">搜索</span>
        </router-link>
        <router-link class="posting"
                     to="/posting">
          <i class="write-icon"></i>
          <span class="top-head-txt">发帖</span>
        </router-link>
      </div>
    </div>

    <!-- 悬赏/精华 -->
    <ul class="plate-lst plate-lst-first">
      <router-link tag="li"
                   to="/rewardPostList"
                   class="plate-lst-item clearfix">
        <img class="ec-icon"
             src="../../assets/images/forum/reward.png"
             alt="">
        <span class="plate-lst-txt">悬赏版块</span>
        <i class="open-icon"></i>
      </router-link>
      <router-link tag="li"
                   to="/splendidPostList"
                   class="plate-lst-item clearfix">
        <img class="ec-icon"
             src="../../assets/images/forum/professional.png"
             alt="">
        <span class="plate-lst-txt">精华版块</span>
        <i class="open-icon"></i>
      </router-link>
    </ul>

    <!-- 分类板块 -->
    <ul class="plate-lst">
      <router-link v-for="(item,index) of sectionList"
                   :key="index"
                   tag="li"
                   :to="'/postList/' + item.postCategoryId"
                   class="plate-lst-item clearfix">
        <img class="ec-icon"
             :src="item.categoryIcon"
             alt="">
        <span class="plate-lst-txt">{{ item.categoryName }}</span>
        <i class="open-icon"></i>
      </router-link>
    </ul>

    <!-- 脚部 -->
    <foot-nav :navIndex="3"></foot-nav>
  </div>
</template>

<script>
import footNav from '../../components/footer'
export default {
  components: {
    footNav
  },
  data () {
    return {
      title: '交流中心',
      sectionList: []
    }
  },
  created () {
    this.title = '交流中心'
    this.queryPostSort()
  },
  methods: {
    /**
     * 请求帖子分类版块接口
     */
    queryPostSort () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/post/category/list'),
        method: 'GET',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.sectionList = data
        this.$toast.clear()
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
.foot {
  margin-top: 0;
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
/* 板块列表 */
.plate-lst-first {
  border-bottom: 1em solid #f2f2f2;
  border-top: 1em solid #f2f2f2;
}
.plate-lst {
  width: 100%;
  padding: 0 1em;
  background: #fff;
}
.plate-lst-item {
  padding: 1.3em 0;
  border-bottom: 1px solid #f3f3f3;
  text-align: left;
  font-size: 14px;
}
ul > .plate-lst-item:last-child {
  border-bottom: none;
}
.plate-lst-txt {
  letter-spacing: 2px;
  font-size: 15px;
}
.ec-icon {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: bottom;
  padding-right: 1em;
}
.open-icon {
  box-sizing: border-box;
  display: block;
  float: right;
  width: 0.5em;
  height: 0.8em;
  background: url("../../assets/images/icon/open-icon.png") no-repeat;
  background-size: 0.5em 0.8em;
}
</style>
