<template>
  <div class="posting"
       v-wechat-title="this.title">
    <div class="top-box">
      <div class="top-head">
        <span @click="queryIssuePost()">发布</span>
      </div>
    </div>
    <!-- 标题 -->
    <div class="posting-title">
      <!-- 标题 -->
      <div class="tit-int">
        <input type="text"
               placeholder="帖子标题"
               v-model="postTitle">
      </div>
      <div class="select-theme">
        <select class="theme"
                name="theme"
                id="theme"
                @change="changeCategory(catId)"
                v-model="catId">
          <option :value="item.postCategoryId"
                  v-for="(item,index) of classify"
                  :key="index">{{item.categoryName}}</option>
        </select>
      </div>
    </div>
    <!-- 帖子内容 -->
    <div class="textbox">
      <textarea class="text-content"
                name="content"
                id=""
                placeholder="这一刻你想说什么..."
                v-model="postContent"></textarea>
    </div>
    <!-- 上传图片 -->
    <div class="int-box">
      <p class="add-img">添加图片</p>
      <!-- <input class="upload-btn"
             type="file"
             multiple="multiple"
             accept="image/png,image/gif,image/jpg,image/jpeg"
             name="file" /> -->
      <van-uploader v-model="fileList"
                    :max-count="3"
                    multiple
                    :after-read="afterRead" />
    </div>
  </div>
</template>

<script>
import { httpupload } from '@/util/httpRequest'
export default {
  data () {
    return {
      title: '编辑帖子',
      fileList: [], // 展示图片
      postId: this.$route.query.postId, // 帖子ID
      postTitle: '', // 标题
      postContent: '', // 内容
      classify: [], // 分类
      catId: 0
    }
  },
  created () {
    this.title = '编辑帖子'
    this.uqeryPostClassify()  // 发布帖子
  },
  methods: {
    /**
     * 选择分类
     */
    changeCategory (e) {
      console.log(e)
    },

    /**
    * 进入页面时获取页面已有信息
    */
    init () {
      if (this.postId) {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/post/postInfo'),
          method: 'GET',
          params: this.$http.adornParams({
            postId: this.postId
          })
        }).then(({ data }) => {
          this.$toast.clear()
          this.postCategoryId = data.postCategoryId
          this.postTitle = data.postTitle
          this.postContent = data.postContent
          if(data.postPic){
            var postPics = data.postPic.split(",");
            var hasNoDomainNamePostPics = data.hasNoDomainNamePostPic.split(",");
            for(var i = 0; i < postPics.length; i++){
              this.fileList.push({ 'url': postPics[i], 'path': hasNoDomainNamePostPics[i] });
            }
          }
          this.catId = data.postCategoryId;
        })
      }
    },

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
        this.fileList[this.fileList.length - 1].path = data;
      }).catch(() => {
        this.fileList.splice(this.fileList.length - 1, 1)
        this.$toast('上传失败~')
      })
    },

    /**
     * 发布帖子
     */
    queryIssuePost () {
      if (this.postTitle == '') {
        this.$toast('请输入标题')
        return
      } else if (this.postContent == '') {
        this.$toast('请输入内容')
        return
      }
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var postPic = '';
      this.fileList.forEach(function(item){
        postPic += item.path + ',';
      })
      if(postPic.length > 0){
        postPic = postPic.substr(0, postPic.length - 1)
      }
      // 接口开始
      this.$http({
        url: this.$http.adornUrl(this.postId ? '/p/post/update' : '/p/post/submitPost'),
        method: this.postId ? 'PUT' : 'POST',
        data: this.$http.adornData({
          postId: this.postId || undefined, // 帖子ID
          postCategoryId: this.catId, // 帖子分类ID
          postTitle: this.postTitle, // 标题
          postContent: this.postContent, // 内容
          postPic: postPic// 图片
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.$dialog.alert({
          message: '提交成功，等待后台审核'
        }).then(() => {
          this.$router.push('/forum')
        });
      })
    },

    /**
     * 帖子分类
     */
    uqeryPostClassify () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/post/category/list'),
        method: 'GET',
        params: this.$http.adornParams({
          postId: this.postId
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.classify = data
        this.catId = this.classify[0].postCategoryId
        this.init()
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
/* 主题 */
.posting-title {
  box-sizing: border-box;
  padding: 1em;
  background: #fff;
  border-top: 1em solid #f2f2f2;
  border-bottom: 1em solid #f2f2f2;
}
.tit-int {
  height: 2em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #f4f4f4;
}
.tit-int > input,
.select-theme > select,
.textbox > textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
}
.tit-int > input::placeholder,
.textbox > textarea::placeholder {
  color: #d4d4d4;
}
.select-theme {
  height: 2em;
  padding-top: 1em;
}
.select-theme > select {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: #fff;
  background: url("../../assets/images/icon/pulldown.png") no-repeat scroll
    right center transparent;
  background-size: 0.8em 0.4em;
  padding-right: 1em;
}
/*清除ie的默认选择框样式清除，隐藏下拉箭头*/
select::-ms-expand {
  display: none;
}
/* 帖子内容 */
.textbox {
  box-sizing: border-box;
  width: 100%;
  height: 15rem;
  background: #fff;
  padding: 1em;
  border-bottom: 1px solid #f2f2f2;
}
.textbox > textarea {
  box-sizing: border-box;
  padding: 0 1em;
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
