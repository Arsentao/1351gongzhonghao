<template>
  <div class="post-comment"
       v-wechat-title="this.title">
    <div class="top-box">
      <div class="top-head">
        <span @click="queryReplyPost()">发表评论</span>
      </div>
    </div>
    <!-- 标题 -->
    <div class="comment-content">
      <h3 class="subject">{{ postTitle }}</h3>
      <div class="textbox">
        <textarea class="comment-txt"
                  name="comment"
                  id=""
                  placeholder="来都来了，就简单说两句..."
                  v-model="content"></textarea>
      </div>
      <!-- 上传图片 -->
      <div class="int-box">
        <p class="add-img">添加图片</p>
        <van-uploader v-model="fileList"
                      :max-count="1"
                      multiple
                      :after-read="afterRead" />
      </div>
    </div>
  </div>
</template>

<script>
import { httpupload } from '@/util/httpRequest'
export default {
  data () {
    return {
      postId: this.$route.params.postId, // 帖子ID
      postTitle: '', // 标题
      createTime: '', // 创建时间
      title: '评论帖子',
      fileList: [], // 展示图片
      content: '', // 内容
      filePaths: [] // 存储图片文件
    }
  },
  created () {
    this.tyitle = '评论帖子'
    this.queryPostDetail()
  },
  methods: {
    /**
     * 选择文件回调函数
     */
    afterRead (file) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var formData = new FormData()
      formData.append('file', file.file)
      /**
      * 上传文件接口
      */
      httpupload({
        url: this.$http.adornUrl('/p/file/upload'),
        method: 'POST',
        data: formData
      }).then(({ data }) => {
        this.$toast.clear()
        this.filePaths.push(data)  // 把内容放入filePaths
      }).catch(() => {
        this.fileList.splice(this.fileList.length - 1, 1)
        this.$toast('上传失败~')
      })
    },

    /**
     * 请求接口
     */
    queryReplyPost () {
      console.log(111)
      if (this.content == '') {
        this.$toast('请输入评论内容')
        return
      }
      // 进入加载
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/post/comment'),
        method: 'POST',
        data: this.$http.adornData({
          postId: this.postId, // 帖子ID
          commentPic: this.filePaths[0], // 图片
          content: this.content, // 内容
          parentCommentId: ""
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.$router.go(-1)
      })
    },

    /**
     * 请求帖子详情
     */
    queryPostDetail () {
      this.$http({
        url: this.$http.adornUrl('/p/post/postInfo'),
        method: 'get',
        params: this.$http.adornParams({
          postId: this.postId,
          postCategoryId: this.postCategoryId
        })
      }).then(({ data }) => {
        this.postTitle = data.postTitle
        this.createTime = data.createTime
      })
    }
  }
}
</script>

<style scoped>
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
.top-head span {
  color: #e61900;
  font-size: 14px;
  letter-spacing: 2px;
}
.comment-content {
  box-sizing: border-box;
  padding: 1em;
  background: #fff;
  border-top: 1em solid #f2f2f2;
}
.subject {
  text-align: left;
  font-size: 15px;
  line-height: 1.7em;
  padding-bottom: 0.8em;
  border-bottom: 1px solid #f1f1f1;
}
/* 内容输入框 */
.textbox {
  box-sizing: border-box;
  width: 100%;
  height: 15rem;
  background: #fff;
  margin-bottom: 1em;
  border-bottom: 1px solid #f1f1f1;
}
.textbox > textarea {
  box-sizing: border-box;
  padding: 1em 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
}
.textbox > textarea::placeholder {
  color: #cccccc;
}
/* 上传图片 */
.int-box {
  position: relative;
  text-align: left;
  padding: 1em 2.5em;
  margin-bottom: 1em;
}
.add-img {
  padding-bottom: 1em;
  font-size: 14px;
}
/* 改变input样式 */
.upload-btn {
  max-width: 30vw;
  position: absolute;
  font-size: 21vw;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
  outline: none;
}
</style>
