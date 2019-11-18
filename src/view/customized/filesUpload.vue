<template>
  <div class="files-upload"
       v-wechat-title="this.title">



    <van-dialog
      v-model="show1"
      title="上传成功" @confirm="skip">

      <div class="wenxin-div">
        <span class="wenxin-span">温馨提示</span>
        <p class="wenxin-p">由于您上次评估后未购买</p>
        <p class="wenxin-p">此次需要支付{{fee}}元评估费</p>
      </div>
    </van-dialog>


    <van-dialog
      v-model="show2"
      title="上传成功" @confirm="skip">

      <div class="wenxin-div">
        <span class="wenxin-span">温馨提示</span>
        <p class="wenxin-p">我们将在1个工作日内</p>
        <p class="wenxin-p">通知您定制费用</p>
      </div>
    </van-dialog>




    <p class="tips">轻点<span class="icon">+</span>号选择乐谱文件</p>
    
    <div class="upload">
      <div class="int-box">
        
        
        <van-uploader v-model="fileListA"
                      :max-count="1"
                      accept="*"
                      :after-read="afterReadA"
                      :preview-image="true"
                      :disabled="ShowIndex!=0"
                       preview-size="70px"
                      :preview-full-image="false">
         
          <img class="plus" v-show="ShowIndex == 0" src="../../assets/images/icon/plus.png"/>
          <img class="square" v-show="ShowIndex != 0" src="../../assets/images/icon/square.png"/>
          
        
        </van-uploader>


        <van-uploader v-model="fileListB"
                      :max-count="1"
                      accept="*"
                      :after-read="afterReadB"
                      :preview-image="true"
                      :disabled="ShowIndex!=1"
                       preview-size="70px"
                      :preview-full-image="false">
    
          <img class="plus" v-show="ShowIndex == 1" src="../../assets/images/icon/plus.png"/>
          <img class="square" v-show="ShowIndex != 1" src="../../assets/images/icon/square.png"/>
      
     
        </van-uploader>

            <van-uploader v-model="fileListC"
                      :max-count="1"
                      accept="*"
                      :after-read="afterReadC"
                      :preview-image="true"
                      :disabled="ShowIndex!=2"
                       preview-size="70px"
                      :preview-full-image="false">
        
         <img class="plus" v-show="ShowIndex == 2" src="../../assets/images/icon/plus.png"/>
         <img class="square" v-show="ShowIndex != 2" src="../../assets/images/icon/square.png"/>
       
     
        </van-uploader>


            <van-uploader v-model="fileListD"
                      :max-count="1"
                      accept="*"
                      :after-read="afterReadD"
                      :preview-image="true"
                      :disabled="ShowIndex!=3"
                       preview-size="70px"
                      :preview-full-image="false">
       
          <img class="plus" v-show="ShowIndex == 3" src="../../assets/images/icon/plus.png"/>
          <img class="square" v-show="ShowIndex != 3" src="../../assets/images/icon/square.png"/>
        
        
        </van-uploader>


            <van-uploader v-model="fileListE"
                      :max-count="1"
                      accept="*"
                      :after-read="afterReadE"
                      :preview-image="true"
                      :disabled="ShowIndex!=4"
                       preview-size="70px"
                      :preview-full-image="false">
         
          <img class="plsus" v-show="ShowIndex == 4" src="../../assets/images/icon/plus.png"/>
          <img class="square" v-show="ShowIndex != 4" src="../../assets/images/icon/square.png"/>
        
        
        </van-uploader>

      </div>


      <div class="conserve-btn" @click="queryFilesSubmit()">提交</div>
      

    </div>

      <div class="form">
    <p class="rule-tip"><span style="background-color:#4d79ff;color:white;padding:3px;">温馨提示:</span></br>由于格式不同，定制的鸟然谱</br>与上传的乐谱可能存在差异</p>
    <p class="rule-txt">支持图片格式：jpg jpeg png gif</p>
    <p class="rule-txt">支持视频格式：mov mp4</p>
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
      title: '用户定制1 — 上传原始乐谱',
      fileListA: [],
      fileListB: [],
      fileListC: [],
      fileListD: [],
      fileListE: [],
      fileList: [0,0,0,0,0],
      customizedNo: sessionStorage.getItem('customOrderNo'),
      fee: 0,
      show1: false,
      show2: false
    }
  },

  watch:{

    fileListA(newlist, oldlist){
       if(newlist.length == 1){
         this.fileList.splice(0, 1, 1)
       }
       else{
          this.fileList.splice(0, 1, 0)
       }
    },
    fileListB(newlist, oldlist){
       if(newlist.length == 1){
          this.fileList.splice(1, 1, 1)
       }
       else{
          this.fileList.splice(1, 1, 0)
       }
    },
    fileListC(newlist, oldlist){
       if(newlist.length == 1){
         this.fileList.splice(2, 1, 1)
       }
       else{
          this.fileList.splice(2, 1, 0)
       }
    },
    fileListD(newlist, oldlist){
       if(newlist.length == 1){
        this.fileList.splice(3, 1, 1)
       }
       else{
        this.fileList.splice(3, 1, 0)
       }
    },
    fileListE(newlist, oldlist){
       if(newlist.length == 1){
       this.fileList.splice(4, 1, 1)
       }
       else{
      this.fileList.splice(4, 1, 0)
       }
    },


  },

  computed:{
   ShowIndex(){
     return this.fileList.indexOf(0)
   }
  },



  created () {
     this.$http({
        url: this.$http.adornUrl('/p/musicCustomized/list'),
        method: 'GET',
        params: this.$http.adornParams({
          status: this.status == -1 ? undefined : this.status,
          current: this.current,
          size: 10
        })
      }).then(({ data }) => {
        this.$toast.clear()
        if (data.current == 1) {
          this.myCustomOrder = data.records
        } else {
          this.myCustomOrder = this.myCustomOrder.concat(data.records)
        }
        this.fee = this.myCustomOrder[0].assessmentFee
        this.loading = false
        this.current = data.current
        this.totalPage = data.pages
        if (this.totalPage == this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
      })
  },
  methods: {


    skip(){
        this.$router.replace("/index");
        this.$router.push('/songOrderList')
    },




    afterReadA (file) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var formData = new FormData()
      formData.append('file', file.file)
      httpupload({
        url: this.$http.adornUrl('/p/file/upload'),
        method: 'POST',
        data: formData
      }).then(({ data }) => {
        this.$toast.clear()
        this.fileListA[this.fileListA.length - 1].path = data;
      }).catch(() => {
        this.fileListA.splice(this.fileListA.length - 1, 1)
        this.$toast('上传失败~')
      })
        
      
    },

    afterReadB (file) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var formData = new FormData()
      formData.append('file', file.file)
      httpupload({
        url: this.$http.adornUrl('/p/file/upload'),
        method: 'POST',
        data: formData
      }).then(({ data }) => {
        this.$toast.clear()
        this.fileListB[this.fileListB.length - 1].path = data;
      }).catch(() => {
        this.fileListB.splice(this.fileListB.length - 1, 1)
        this.$toast('上传失败~')
      })
     
    },

    afterReadC (file) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var formData = new FormData()
      formData.append('file', file.file)
      httpupload({
        url: this.$http.adornUrl('/p/file/upload'),
        method: 'POST',
        data: formData
      }).then(({ data }) => {
        this.$toast.clear()
        this.fileListC[this.fileListC.length - 1].path = data;
      }).catch(() => {
        this.fileListC.splice(this.fileListC.length - 1, 1)
        this.$toast('上传失败~')
      })
    
    },

    afterReadD (file) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var formData = new FormData()
      formData.append('file', file.file)
      httpupload({
        url: this.$http.adornUrl('/p/file/upload'),
        method: 'POST',
        data: formData
      }).then(({ data }) => {
        this.$toast.clear()
        this.fileListD[this.fileListD.length - 1].path = data;
      }).catch(() => {
        this.fileListD.splice(this.fileListD.length - 1, 1)
        this.$toast('上传失败~')
      })
     
    },

    afterReadE (file) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var formData = new FormData()
      formData.append('file', file.file)
      httpupload({
        url: this.$http.adornUrl('/p/file/upload'),
        method: 'POST',
        data: formData
      }).then(({ data }) => {
        this.$toast.clear()
        this.fileListE[this.fileListE.length - 1].path = data;
      }).catch(() => {
        this.fileListE.splice(this.fileListE.length - 1, 1)
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
     
 
      if (this.fileListA.length == 1){
       filePaths.push(this.fileListA[0].path)
      }
      if (this.fileListB.length == 1){
       filePaths.push(this.fileListB[0].path)
      }
      if (this.fileListC.length == 1){
       filePaths.push(this.fileListC[0].path)
      }
      if (this.fileListD.length == 1){
       filePaths.push(this.fileListD[0].path)
      }
      if (this.fileListE.length == 1){
       filePaths.push(this.fileListE[0].path)
      }
      

      this.$http({
        url: this.$http.adornUrl('/p/musicCustomized/uploadMusicSource'),
        method: 'POST',
        data: {
          fileList: filePaths,
          customizedNo: this.customizedNo
        }
      }).then(({ data }) => {
        if(this.fee == 0){
        this.$toast.clear()
        this.show2 = true
        }

        else{
        this.$toast.clear()
        this.show1 = true
        }


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
  overflow: scroll;
}
.van-uploader__wrapper {
  justify-content: space-around !important;
}
.tips {
  font-size: 26px;
  padding: 2em 0;
  color: #e60101;
}
.upload {
  margin-top: 5vw;
  text-align: center;
}
.int-box {
  box-sizing: border-box;
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
  text-align: center;
  color: black;
  line-height: 200%;
  font-size: 15px;
}

.rule-tip {
  text-align: center;
  color: rgb(64, 79, 219);
  line-height: 200%;
  font-size: 18px;
}

/* 提交按钮 */
.conserve-btn {
  width: 13rem;
  height: 2em;
  margin: 0 auto;
  margin-top: 4em;
  line-height: 2em;
  color: white;
  letter-spacing: 0.5em;
  border-radius: 20px;
  font-size: 26px;
  background: #e61235;
  font-weight: bold;
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


@keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.3;
    }
    to {
        opacity: 1.0;
    }
}

@-webkit-keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.3;
    }
    to {
        opacity: 1.0;
    }
}


.icon {
color: rgb(90, 204, 90);
font-weight: bold;
font-size: 36px;
vertical-align: middle
}

.form {
text-align: center;
margin-top: 5rem;
width: 80%;
margin-left: 10%;
border: 2px dashed rgb(80, 121, 209);
}

.plus {
width: 70px;
height: 70px;
animation: fade 600ms infinite;
-webkit-animation: fade 600ms infinite;
}

.square {
width: 70px;
height: 70px;
}

</style>

<style>
.van-uploader__preview .van-uploader__preview-delete {
right: 62px;
}
</style>