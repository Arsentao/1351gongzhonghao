<template>
<div class="explain">


  <van-dialog
      v-model="popshow" show-confirm-button show-cancel-button
      confirm-button-text="接 受"
      cancel-button-text="不 接 受"
      @cancel="disagree" class="pop">
      <div class="wenxin-div">
        <span class="wenxin-span">告示</span>
        <p class="wenxin-p">□ 定制作品仅用于个人学习。</p>
        <p class="wenxin-p">□ 未经著作权人许可，不得用于任何有偿活动。</p>
        <p class="wenxin-p">□ 定制的鸟然谱与上传的曲目可能存在差异。</p>
      </div>
    </van-dialog>





<div class="flash">
  <img src="https://fengpu1351-1300303301.cos.ap-guangzhou.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/%E5%B0%8F%E5%8A%A8%E7%94%BBnew.gif"
  height="200px" width="80%">
</div>

   <div class="btn-assess">
      <button class="conserve-btn" @click="assess()">
          进入定制流程
      </button>
   </div>


  <div class="issue">
  <p><span style="background-color:#4d79ff;color:white;padding:3px;font-size:18px">温馨提示:</span></p>
  <p style="margin-top:10px">支持图片视频格式:</p>
  <p>图片:jpg jpeg png gif</p>
  <p>视频:mov mp4</p>
  </div>


<foot-nav></foot-nav>
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
      assessmentFee: 0,
      checked: false,
      popshow: false
    }
  },
  created () {
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' })
    this.popshow = true
    this.queryCosts()
    document.querySelector('#cartoon').load()
   
  },
  methods: {
    /**
     * 获取评估价格
     */
    queryCosts () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/musicCustomized/assessmentFee'),
        method: 'GET',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.$toast.clear();
        this.assessmentFee = data
      })
    },


    disagree(){
    this.$router.push('/index')
    },


    assess(){
      var url = '/p/musicCustomized/payAssessmentFee';
      sessionStorage.setItem('customFeeType', 1);
      sessionStorage.setItem('assessmentType', 1);
      sessionStorage.setItem('assessmentFee', this.assessmentFee)
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData({
          payType: 0,
          customizeNo: '',
        })
      }).then(({ data }) => {
        sessionStorage.setItem("customOrderNo", data.orderNo);
        this.$toast.clear()
        this.$router.push('/filesUpload')
      })
      }
     
  }
}
       
</script>
<style scoped>
/* 固定背景 */
.explain {
overflow: scroll;
}

.explain-wrap {
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  z-index: -99;
  overflow: auto;
}
/* 文字 */
ul.explain {
  box-sizing: border-box;
  text-align: left;
}
ul.explain > li {
  box-sizing: border-box;
  padding: 0 1em;
  background: #fff;
  margin-bottom: 1em;
}
.explain-tit {
  font-size: 16px;
  font-weight: normal;
  color: #df1c02;
  padding: 0.8em 0;
  border-bottom: 1px solid #f2f2f2;
}
.explain-txt {
  line-height: 2em;
  padding: 1em 0;
  font-size: 14px;
  letter-spacing: 1px;
}
/* 支付费用 */
.cost-pay {
  margin-top: 15vw;
  margin-bottom: 20vw;
}
.cost {
  font-size: 14px;
}
.cost-num {
  font-size: 22px;
  color: #df1c02;
}
.sub {
  font-style: normal;
  font-size: 12px;
  font-weight: normal;
  color: #df1c02;
}
/* 按钮 */
.conserve-btn {
margin-top: 3em;
width: 56vw;
height: 3.5em;
line-height: 3.5em;
color: #fff;
border: none;
background: url("../../assets/images/icon/btn-bright.png") no-repeat left top;
background-size: 56vw 3.7em;
outline: none;
font-size: 20px;
}
.issue {
text-align: center;
margin-top: 5em;
width: 80%;
margin-left: 10%;
border: 2px dashed rgb(80, 121, 209);
padding: 0.5em;
}
.title {
font-size: 22px;
font-weight: bold;
margin-bottom: 20px;
text-align: center;
}
.issue p {
font-size: 15px;
line-height: 200%;
color: rgb(64, 79, 219);
}
.flash {
margin-top: 50px;
}
.pop{
z-index: 10000
}
</style>

<style>
.van-toast .van-toast__text{
font-size: 18px;
}
/* .van-dialog__confirm .van-button__text{
padding-left: 30px;
padding-right: 30px;
}
.van-dialog__cancel .van-button__text{
padding-left: 30px;
padding-right: 30px;
}
.van-dialog{
width: 95%;
} */
</style>
