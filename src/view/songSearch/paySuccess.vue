<template>
  <div class="paySuccess-mian">
    <div class="paySuccess-head">
      <div class="img-box">
        <!-- 左边图片 -->
        <img src="../../assets/images/icon/paysuss.png"
             alt=""
             class="paySuccess-head-img">
      </div>
      <!-- 右边盒子 -->
      <div class="right-content">
        <p class="paySuccess-head-p">订单支付成功</p>
        <div class="int-box">
          <input type="text"
                 placeholder="请输入琴侣id"
                 class="paySuccess-head-input"
                 v-model="padId" @blur="focus()">
          <!-- <img src="../../assets/images/icon/paysele.png"
               alt=""
               class="paySuccess-head-icon1"> -->
          <img src="../../assets/images/icon/payerweima.png"
               alt=""
               class="paySuccess-head-icon2"
               @click="scanCode()">
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="paySuccess-btn"
         @click="confirmOrder()">
      <button>确认收货</button>
    </div>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk'
export default {
  data () {
    return {
      orderNo: sessionStorage.getItem('orderNo'),
      padId: localStorage.getItem("lastPadId")
    }
  },
  created () {
    var currUrl = process.env.HOST + '/paySuccess'
    var isIos = window.__wxjs_is_wkwebview
    if (isIos) {
      currUrl = process.env.HOST + '/index'
    }
    this.$http({
      url: this.$http.adornUrl('/p/wx/jsapi/createJsapiSignature'),
      method: 'post',
      data: currUrl
    }).then(({ data }) => {
      // 下面要调用微信扫码功能了
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
    })
  },

  methods: {
    focus(){
      document.body.scrollTop = 0;
    },
 
    scanCode () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var that = this
      wx.ready(function () {
        that.$toast.clear()
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            that.padId = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          }
        })
      })
      wx.error(function (res) {
        alert(JSON.stringify(res))
        that.$toast.clear()
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        /* alert("config信息验证失败"); */
      })
    },
    /**
     * 确认收货
     */
    confirmOrder () {
      if (this.padId.trim() == '') {
        this.$toast('请输入琴侣id')
      }
      this.$toast.loading({
        mask: true
      })
      this.$http({
        url: this.$http.adornUrl('/p/music/order/confirm'),
        method: 'post',
        data: this.$http.adornData({
          orderNo: this.orderNo,
          padId: this.padId
        })
      }).then(({ data }) => {
        this.$toast.clear()
        localStorage.setItem("lastPadId",this.padId)
          this.$dialog.alert({
          title:"购买成功！",
        }).then(() => {
         this.$router.replace('/index')
         this.$router.push('/songOrders')
        });
      })
    }
  }
}
</script>
<style scoped>
.paySuccess-mian{
height: 100%;
width: 100%;
position: fixed;
overflow: auto;
background: white;
}
.paySuccess-head {
padding: 15vw 0;
}
.img-box {
  display: block;
  width: 25vw;
  height: 25vw;
  margin: 0 auto;
}
.paySuccess-head-img {
  width: 100%;
}
/* 右边盒子 */
.right-content {
  display: block;
  margin: 0 auto;
  text-align: center;
  margin-top: 1em;
}
.paySuccess-head-p {
  display: block;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 0.5em 0;
}
.int-box {
  position: relative;
  text-align: center;
  margin: 2em 0;
}
.paySuccess-head-input {
  width: 35vw;
  height: 2.5em;
  line-height: 2.5em;
  border-radius: 3px;
  padding-right: 2em;
  padding-left: 1em;
  font-size: 14px;
  border: 1px solid gainsboro;
  vertical-align: middle;
}
.paySuccess-head-icon1 {
  position: absolute;
  top: 50%;
  right: 34vw;
  transform: translateY(-50%);
  width: 10px;
  height: 6px;
}
.paySuccess-head-icon2 {
  width: 2.5em;
  height: 2.5em;
  vertical-align: middle;
  margin-left:10px;
}
.paySuccess-btn {
  width: 80%;
  margin: 0 auto;
}
.paySuccess-btn button {
  color: white;
  background-color: red;
  width: 80%;
  height: 2.5em;
  line-height: 2.5em;
  border-radius: 30px;
  border: none;
  font-size: 15px;
}
input::-webkit-input-placeholder{
color: rgba(95, 87, 87, 0.808);
}
</style>
