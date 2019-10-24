<template>
  <div class="forum-search"
       v-wechat-title="this.title">
    <!-- 搜索栏 -->
    <div class="search-box">
      <input class="search-int"
             type="text"
             placeholder="请输入关键字"
             v-model="keyword"
             ref="intValue">
      <span class="search-btn"
            @click="querySearch()">搜索</span>
    </div>
    <!-- 大家都在搜 -->
    <p class="every">大家都在搜：</p>
    <ul class="entry-box">
      <li :class="['entry',item.checked?'entry-current':'']"
          v-for="(item,index) of hotWords"
          :key="index"
          @click="changeWords(item.title)"
          ref="menuItem">{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import { Toast } from 'vant'

Vue.use(Toast)
export default {
  data () {
    return {
      title: '搜索',
      number: 20, // 获取热搜词数量
      sort: 1, // 默认后台排序
      hotWords: [], // 热搜词
      current: 1,
      size: 10,
      totalPage: 2,
      loading: true,
      loadingMsg: '正在加载...',
      keyword: '',
      searchPostList: [] // 搜索内容列表
    }
  },
  created () {
    this.queryHotWords()
  },
  methods: {
    /**
     * 查询帖子热搜词
     */
    queryHotWords () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/post/search/list'),
        method: 'GET',
        params: this.$http.adornParams({
          number: this.number,
          sort: this.sort
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.hotWords = data
      })
    },

    /**
     * 选择热词替换
     */
    changeWords (title) {
      this.keyword = title
      this.querySearch()
    },

    /**
     * 帖子搜索接口
     */
    querySearch () {
      if (this.keyword == '') {
        this.$toast('请输入关键字')
        return
      }
      this.$router.replace("/forum");
      this.$router.push('/searchPostList/' + this.keyword)
    }
  }
}
</script>

<style scoped>
.search-box {
  box-sizing: border-box;
  width: 100%;
  padding: 1.5em 1em;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
}
.search-int {
  width: 65%;
  height: 2.5em;
  margin-right: 1em;
  padding: 0 1.5em;
  font-size: 14px;
  border-radius: 30px;
  border: none;
  outline: none;
  background: #f3f3f3;
}
input.search-int::placeholder {
  color: #b9b9b9;
}
.search-btn {
  font-size: 14px;
}
/* 大家都在搜 */
.every {
  padding: 1em 1em;
  text-align: left;
  letter-spacing: 1px;
  font-size: 14px;
}
.entry-box {
  padding: 0 1em;
  text-align: left;
}
.entry {
  display: inline-block;
  height: 1.8em;
  line-height: 2em;
  padding: 0 1em;
  border: 1px solid rgb(165, 165, 165);
  color: rgb(155, 155, 155);
  /* background-color: rgb(228, 228, 228); */
  border-radius: 5px;
  margin: 0.2em;
  letter-spacing: 1px;
  font-size: 14px;
}
.entry-current {
  border: skyblue;
  color: skyblue;
}
</style>
