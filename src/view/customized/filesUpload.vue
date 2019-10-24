<template>
  <div class="files-upload"
       v-wechat-title="this.title">
    <p class="tips">上传定制曲谱的相关材料</p>
    <!-- 上传文件 -->
    <div class="upload">
      <div class="int-box">
        <van-uploader v-model="fileList"
                      :max-count="5"
                      accept="*"
                      :after-read="afterRead" />
      </div>
      <p class="rule-txt">支持扩展名：.doc .jpg .mp3 .mp4 .png .gif .pdf .zip .docx .txt .jpeg .mpeg</p>
      <p class="rule-txt">最多不能超过5个文件</p>
      <!-- 按钮 -->
      <div :class="['conserve-btn',{'conserve-btn-red':fileList.length > 0}]"
           @click="queryFilesSubmit()">提交</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Uploader } from 'vant'
import { httpupload } from '@/util/httpRequest'

Vue.use(Uploader)
export default {
  data () {
    return {
      title: '曲谱定制-材料上传',
      fileList: [],
      customizedNo: sessionStorage.getItem('customOrderNo')
    }
  },
  created () {
    this.title = '曲谱定制-材料上传'
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
        this.fileList[this.fileList.length - 1].path = data;
      }).catch(() => {
        this.fileList.splice(this.fileList.length - 1, 1)
        this.$toast('上传失败~')
      })
    },
    /**
     * 请求接口
     */
    queryFilesSubmit () {
      if (this.fileList.length == 0) {
        return
      }
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var filePaths = [];
      this.fileList.forEach(function(item){
        filePaths.push(item.path);
      })
      this.$http({
        url: this.$http.adornUrl('/p/musicCustomized/uploadMusicSource'),
        method: 'POST',
        data: {
          fileList: filePaths,
          customizedNo: this.customizedNo
        }
      }).then(({ data }) => {
        this.$toast.clear()
        this.$dialog.alert({
          message: '上传成功，等待平台评估费用~'
        }).then(() => {
          this.$router.replace("/index");
          this.$router.push('/songOrderList')
        });
      })
    }

  }
}
</script>

<style scoped>
.files-upload {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -99;
}
.van-uploader__wrapper {
  justify-content: space-around !important;
}
.tips {
  font-size: 15px;
  padding: 1.5em 0;
  margin-bottom: 10vw;
}
.upload {
  margin-top: 15vw;
  text-align: center;
}
.int-box {
  box-sizing: border-box;
  padding-left: 3em;
  padding-right: 1.5em;
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
/* 文字 */
.rule-txt {
  display: inline-block;
  width: 60%;
  text-align: left;
  color: #adadad;
  line-height: 1.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 提交按钮 */
.conserve-btn {
  width: 15rem;
  height: 2.5em;
  margin: 0 auto;
  margin-top: 3em;
  line-height: 2.5em;
  color: #fff;
  letter-spacing: 0.5em;
  font-size: 14px;
  border-radius: 20px;
  font-size: 14px;
  background: #999999;
}
.conserve-btn-red {
  background: #e60101;
}
/* 文件展示 */
.files-selected {
  box-sizing: border-box;
  padding: 0 1.5em;
}
.file {
  position: relative;
}
.link-icon {
  position: absolute;
  left: 0;
  top: 0.8em;
  display: inline-block;
  width: 1.7em;
  height: 1.7em;
  background: url("../../assets/images/icon/link-icon.png") no-repeat;
  background-size: 1.7em 1.7em;
}
.file-type {
  position: relative;
  font-size: 15px;
  text-align: left;
  margin-left: 2em;
  padding-left: 0.5em;
  line-height: 2.5em;
  color: #adadad;
  border-bottom: 1px solid #e2e2e2;
}
.colse-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  background: url("../../assets/images/icon/close-icon.png") no-repeat;
  background-size: 1.5em 1.5em;
}
</style>
