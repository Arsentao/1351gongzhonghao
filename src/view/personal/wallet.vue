<template>
  <div class="wallet">
    <!-- 余额 -->
    <div class="balance">
      <p class="txt">账户余额</p>
      <p class="price"><i class="sub">￥</i>{{ balance }}</p>
      <p class="btn">
        <button @click="recharge()">充值</button>
      </p>
    </div>
    <!-- 流水 -->
    <ul class="balance-trends">
      <li class="item clearfix"
          v-for="(item,index) of walletTrends"
          :key="index">
        <!-- 日期时间 -->
        <span class="time">{{ item.createTime }}</span>
        <!-- 收支项目 -->
        <span class="way">{{ ['','充值','系统修改','购买曲谱','购买琴侣','曲谱定制'][item.reasons] }}</span>
        <!-- 变动金额 -->
        <span :class="['num',item.ioType == 0  ? 'num-add' : 'num-reduce']">{{ amountType(item.amount,item.ioType) }}</span>
      </li>
    </ul>
    <!-- loading -->
    <div class="prompt"
         v-if="totalPage>1">
      <span>{{loadingMsg}}</span>
    </div>

    <!-- 弹框 -->
    <van-popup v-model="popupShow">
      <div class="popup-div">
        <div class="tit">输入充值金额</div>
        <div class="amount"><input type="text" v-model="rechargeAmount" autofocus></div>
        <div class="btn">
          <button @click="confirmRecharge">确认</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import { Popup } from 'vant'
Vue.use(Popup)
export default {
  data () {
    return {
      balance: 0, // 余额
      userId: '0', // 用户ID
      walletTrends: [], // 钱包流水
      current: 1, // 当前页码
      totalPage: 1, // 总页数
      loading: true,
      loadingMsg: '正在加载...',
      popupShow: false,
      rechargeAmount: ''
    }
  },
  created () {
    window.addEventListener('scroll', this.onScroll)
    // 余额
    this.queryMyWallet()
    // 获取钱包流水
    this.quneryWalletStream()
  },
  methods: {
    // 请求数据
    queryMyWallet () {
      this.$http({
        url: this.$http.adornUrl('/p/Wallet/myWalletInfo'),
        method: 'GET',
        data: this.$http.adornUrl({})
      }).then(({ data }) => {
        this.balance = data.balance
        this.userId = data.userId
      })
    },

    // 分页
    onScroll () {
      // 可滚动容器的高度
      let innerHeight = document.querySelector('#app').clientHeight
      // 屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight
      // 可滚动容器超出当前窗口显示范围的高度
      let scrollTop = document.body.scrollTop
      // scrollTop在页面未滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      if (innerHeight < (outerHeight + scrollTop + 100)) {
        if (this.loading || this.current >= this.totalPage) {
          return
        }
        this.current = this.current + 1
        this.loading = true
        this.quneryWalletStream()
      }
    },

    // 获取钱包流水
    quneryWalletStream () {
      // 加载更多操作
      this.$http({
        url: this.$http.adornUrl('/p/Wallet/myWalletLog'),
        method: 'GET',
        params: this.$http.adornParams({
          current: this.current,
          size: 20
        })
      }).then(({ data }) => {
        if(data.current == 1){
          this.walletTrends = data.records;
        }else{
          this.walletTrends = this.walletTrends.concat(data.records)
        }
        this.loading = false
        this.totalPage = data.pages
        if (this.totalPage === this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        }
      })
    },

    // 收支金额显示
    amountType (reasons, ioType) {
      return ioType == 0 ? '＋' + reasons : '－' + reasons
    },

    /**
     * 充值
     */
    recharge(){
      this.popupShow = true
    },

    /**
     * 确认充值
     */
    confirmRecharge(){
      var isNotNumber = isNaN(this.rechargeAmount)
      if(isNotNumber){
        this.$toast('请输入正确的金额');
        return;
      }
      if(this.rechargeAmount <= 0){
        this.$toast('请输入正确的金额');
        return;
      }
      this.popupShow = false
      this.$http({
        url: this.$http.adornUrl('/p/Wallet/recharge'),
        method: 'POST',
        data: this.$http.adornData({
         rechargeAmount: this.rechargeAmount
        })
      }).then(({ data }) => {
        this.wexinPay(
            {
              appId: data.appId,
              nonceStr: data.nonceStr,
              package: data.packageValue,
              paySign: data.paySign,
              signType: data.signType,
              timeStamp: data.timeStamp
            },
            // 成功回调函数
            res => {
              this.rechargeSuccess();
            },
            res => {
              console.log('支付失败')
            }
          )
      })
    },

    /**
     * 充值成功
     */
    rechargeSuccess(){
      this.$dialog.alert({
        message: '充值成功！'
      }).then(() => {
        // 余额
        this.queryMyWallet()
        this.current = 1;
        // 获取钱包流水
        this.quneryWalletStream()
      });
    },

    /**
     * 调用微信支付
     */
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
        data: process.env.HOST + '/wallet'
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
/* 清除浮动 */
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.wallet {
  color: #000;
}
/* 余额 */
.balance {
  box-sizing: border-box;
  width: 100%;
  height: 33vh;
  background: url("../../assets/images/personal/wallet_bg.png") no-repeat;
  background-size: 100% 100%;
}
.txt {
  font-size: 15px;
  text-align: left;
  padding: 1em;
}
.price {
  font-size: 3.5em;
  margin-top: 3vw;
}
.price > .sub {
  color: #000;
}
.sub {
  font-style: normal;
  font-size: 13px;
}
.btn {
  margin-top: 5vw;
}
.btn > button {
  padding: 0.3em 1.3em;
  border: 1px solid #000;
  border-radius: 2px;
  background: transparent;
  outline: none;
  font-size: 14px;
}
/* 流水 */
.balance-trends {
  box-sizing: border-box;
  padding: 0 1em;
}
li.item {
  border-bottom: 1px solid #e4e4e4;
  padding: 1.5em 0;
  text-align: left;
  font-size: 14px;
}
.num {
  float: right;
}
.num-add {
  color: #e61900;
}
.num-reduce {
  color: #9b9b9b;
}
.way {
  padding-left: 12vw;
}
.popup-div{
  padding:10px 60px;
}
.popup-div .tit{
  line-height: 50px;
  padding: 10px;
  font-size: 14px;
}
.popup-div .amount{
  line-height: 26px;
}
.popup-div .amount input{
  padding: 5px;
}
.popup-div .btn{
  line-height: 30px;
  padding: 20px;
}
.popup-div .btn button{
  padding: 0px 30px;
}
</style>
