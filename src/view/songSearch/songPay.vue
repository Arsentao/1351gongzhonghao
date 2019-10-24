<template>
  <div class="payment"
       v-wechat-title="this.title">
    <!-- <top-head v-html="headtitle"></top-head> -->
    <p class="amount">订单总额&nbsp;￥{{ actualTotal }}</p>
    <div class="pay-method">
      <div :class="['choose-box',payType==0?'active':'']"
           @click="choosePayType(0)">
        <i class="choose-icon"></i>
        <p class="num">￥{{ myBalance }}</p>
        <p class="choose-text">余额支付</p>
      </div>
      <div :class="['choose-box',payType==1?'active':'']"
           @click="choosePayType(1)">
        <i class="choose-icon"></i>
        <p class="weixin">
          <img src="../../assets/images/icon/wxpay2.png"
               alt=""></p>
        <p class="choose-text">微信支付</p>
      </div>
    </div>
    <div class="pay-btn"
         @click="toPay">确认支付</div>
  </div>
</template>

<script>
import topHead from '../../components/header'
import wx from 'weixin-js-sdk'
export default {
  components: {
    topHead
  },
  data () {
    return {
      title: '曲谱-订单支付',
      actualTotal: sessionStorage.getItem('songTotal'),
      orderNumbers: sessionStorage.getItem('orderNo'),
      myBalance: 0,
      payType: 1
    }
  },
  created () {
    this.title = '曲谱-订单支付'
    this.$http({
      url: this.$http.adornUrl('/p/Wallet/myWalletInfo'),
      method: 'get'
    }).then(({ data }) => {
      this.myBalance = data.balance
    })
  },
  methods: {
    /**
     * 选择支付方式
     */
    choosePayType (type) {
      this.payType = type
    },

    /**
     * 确认支付
     */
    toPay () {
      if (this.payType == 0) {
        this.calBalancePay()
      } else {
        this.calWeixinPay()
      }
    },

    /**
     * 余额支付
     */
    calBalancePay () {
      this.$toast.loading({
        mask: true
      })
      this.$http({
        url: this.$http.adornUrl('/p/music/order/pay'),
        method: 'post',
        data: this.$http.adornData({
          payType: 0,
          orderNo: this.orderNumbers,
          remark: ''
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.$router.replace('/index')
        this.$router.push('/paySuccess')
      })
    },

    /**
     * 唤起微信支付
     */
    calWeixinPay: function () {
      this.$toast.loading({
        mask: true
      })
      this.$http({
        url: this.$http.adornUrl('/p/music/order/pay'),
        method: 'post',
        data: this.$http.adornData({
          payType: 1,
          orderNo: this.orderNumbers,
          remark: ''
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.wexinPay(
          {
            appId: data.appId,
            nonceStr: data.nonceStr,
            package: data.packageValue,
            paySign: data.paySign,
            signType: data.signType,
            timeStamp: data.timeStamp,
            signature: data.signature
          },
          // 成功回调函数
          res => {
            console.log('支付成功')
            this.$router.replace('/index')
            this.$router.push('/paySuccess')
          },

          res => {
            console.log('支付失败')
          }
        )
      })
    },

    wexinPay (paydata, cb, errorCb) {
      // 获取后台传入的数据
      let appId = paydata.appId
      let timestamp = paydata.timeStamp
      let nonceStr = paydata.nonceStr
      let packages = paydata.package
      let paySign = paydata.paySign
      let signType = paydata.signType

      this.$http({
        url: this.$http.adornUrl('/p/wx/jsapi/createJsapiSignature'),
        method: 'post',
        data: process.env.HOST + '/songPay'
      }).then(({ data }) => {
        // 下面要发起微信支付了
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        wx.ready(function () {
          wx.chooseWXPay({
            timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
            package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              cb(res)
            },
            fail: function (res) {
              // 失败回调函数
              errorCb(res)
            }
          })
        })
        wx.error(function (res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          /* alert("config信息验证失败"); */
        })
      })
    }
  }
}
</script>

<style scoped>
.payment {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -100;
}
.amount {
  width: 100%;
  height: 45vw;
  line-height: 45vw;
  font-size: 16px;
  color: rgb(185, 0, 0);
  text-align: center;
}
.pay-method {
  display: block;
  width: 100%;
  height: 36vw;
  line-height: 36vw;
}
.choose-box {
  position: relative;
  display: inline-block;
  width: 35%;
  height: 35vw;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  vertical-align: top;
}
.choose-box.active {
  border: 1px solid #1989fa;
}
.choose-icon {
  position: absolute;
  top: 1.5em;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  width: 1em;
  height: 1em;
  background: url("../../assets/images/icon/choose-round.png");
  background-size: 1em 1em;
}
.choose-box.active .choose-icon {
  background: url("../../assets/images/icon/choosed-blue.png");
  background-size: 1em 1em;
}
p.num {
  font-size: 13px;
}
p.weixin {
  height: 35vw;
  line-height: 42vw;
}
.weixin > img {
  width: 3em;
}
.choose-text {
  position: absolute;
  line-height: 1.5em;
  bottom: 1.5em;
  left: 50%;
  transform: translateX(-50%);
}
.pay-btn {
  position: absolute;
  bottom: 50vw;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  width: 25vw;
  background-color: transparent;
  border: 2px solid #dcdfe6;
  padding: 0.5em 0;
  font-size: 13px;
  border-radius: 5px;
  outline: none;
}
.pay-btn:active {
  border: 1px solid #1989fa;
}
</style>
