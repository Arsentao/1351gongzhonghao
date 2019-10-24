<template>
  <div class="song-order-list-main"
       v-wechat-title="this.title">
    <div class="song-order-list-header">
      <ul>
        <li :class="{ 'li-active': status === -1 }"
            @click="currentNav(-1)">全部</li>
        <li :class="{ 'li-active': status === 1 }"
            @click="currentNav(1)">待上传</li>
        <li :class="{ 'li-active': status === 2 }"
            @click="currentNav(2)">待评估</li>
        <li :class="{ 'li-active': status === 3 }"
            @click="currentNav(3)">待支付</li>
        <li :class="{ 'li-active': status === 4 }"
            @click="currentNav(4)">待制作</li>
      </ul>
    </div>
    <div class="song-order-list-list">
      <ul>
        <li class="song-order-list-list-upload"
            v-for="(item,index) of myCustomOrder"
            :key="index">
          <div class="song-order-list-list-upload-num">
            <p class="song-order-list-list-upload-num-p1">订单编号：</p>
            <p class="song-order-list-list-upload-num-p2">{{ item.customizedNo }}</p>
            <!-- 状态state（1：待上传 2：待评估 3：已评估、等待支付 4.待制作 5.已完成、绑定padId 6：发货 7：已取消） -->
            <p class="song-order-list-list-upload-num-p3">{{ ['待支付评估费','待上传','评估中','待支付','制作中','制作中','已完成','已取消'][item.state] }}</p>
          </div>
          <div class="song-order-list-list-upload-date">
            <p>
              <span class="song-order-list-list-upload-date-p1">创建时间：</span>
              <span class="song-order-list-list-upload-date-p2">{{ item.createTime }}</span>
            </p>
            <p v-if="item.uploadTime">
              <span class="song-order-list-list-upload-date-p1">上传时间：</span>
              <span class="song-order-list-list-upload-date-p2">{{ item.uploadTime }}</span>
            </p>
            <p v-if="item.assessmentTime">
              <span class="song-order-list-list-upload-date-p1">评估时间：</span>
              <span class="song-order-list-list-upload-date-p2">{{ item.assessmentTime }}</span>
            </p>
            <p v-if="item.prodPayTime">
              <span class="song-order-list-list-upload-date-p1">支付时间：</span>
              <span class="song-order-list-list-upload-date-p2">{{ item.prodPayTime }}</span>
            </p>
            <p v-if="item.finishTime">
              <span class="song-order-list-list-upload-date-p1">完成时间：</span>
              <span class="song-order-list-list-upload-date-p2">{{ item.finishTime }}</span>
            </p>
          </div>
          <div class="song-order-list-list-upload-btn clearfix">
            <span class="prod-fee" v-if="item.prodFee">制作费：<span class="red">￥{{item.prodFee}}</span></span>
            <!-- 0、待支付评估费 -->
            <button class="song-order-list-list-upload-btn2" v-show="item.state == 0" @click="toPayAssessment(item.customizedNo, item.assessmentFee)">支付评估费</button>
            <!-- 1、待上传 -->
            <button class="song-order-list-list-upload-btn2" v-show="item.state == 1" @click="toFileUpload(item.customizedNo)">上传材料</button>
            <!-- 3、待支付 -->
            <button class="song-order-list-list-upload-btn2" v-show="item.state == 3" @click="toPayCustom(item.customizedNo, item.prodFee)">马上付款</button>
            <!-- 4、待制作-->
            <button class="song-order-list-list-upload-btn2" v-show="item.state == 4" @click="confirmPadId(item.customizedNo)">填写琴侣ID</button>
            <!-- 0、待支付评估费   1、待上传  2、待评估  3、待支付 -->
            <button class="song-order-list-list-upload-btn1" v-show="item.state == 0 || item.state == 1 || item.state == 2 || item.state == 3" @click="cancelOrder(item.customizedNo)">取消订单</button>
          </div>
        </li>
      </ul>
    </div>
    <div class="empty"
         v-if="myCustomOrder.length==0">还没有相关订单~</div>
    <!-- loading -->
    <div class="prompt"
         v-if="totalPage>1">
      <span>{{loadingMsg}}</span>
    </div>

    <!-- 弹框 -->
    <van-popup v-model="popupShow">
      <h2 class="popup-tit">请输入收货琴侣ID</h2>
      <div class="id-int">
        <input class="int-box"
               type="text"
               placeholder="请输入琴侣id"
               v-model="padId">
        <!-- <i class="down-arrow-icon"></i> -->
        <i class="ewm-icon" @click="scanCode"></i>
      </div>
      <div class="gotopay"
           @click="confirmOrder()">确认</div>
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
      title: '曲谱定制-订单列表',
      myCustomOrder: [],
      current: 1, // 当前页
      size: 10,
      totalPage: 1,
      loading: true,
      loadingMsg: '正在加载......',
      totalCartNum: 0,
      status: -1 ,// 订单状态
      popupShow:false,
      padId:localStorage.getItem('lastPadId'),
      customOrderNo:""
    }
  },
  created () {
    this.title = '曲谱定制-订单列表'
    window.addEventListener('scroll', this.onScroll)
    this.queryMyList()

    var currUrl = process.env.HOST + '/songOrderList'
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
    /**
     * 切换菜单样式
     */
    currentNav (index) {
      this.status = index
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.current = 1
      this.queryMyList()
    },

    /**
     * 取消订单
     */
    cancelOrder(customizedNo){
      this.$dialog.confirm({
        title: '',
        message: '确认要取消此订单？'
      }).then(() => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/musicCustomized/cancelProdOrder'),
          method: 'post',
          data:this.$http.adornData({
            customizedNo:customizedNo
          })
        }).then(({ data }) => {
          this.current = 1
          this.queryMyList()
        })
      }).catch(() => {

      })
    },

    /**
     * 分页
     */
    onScroll () {
      // 可滚动容器的高度
      let innerHeight = document.querySelector('#app').clientHeight
      // 屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight
      // 可滚动容器超出当前窗口显示范围的高度
      let scrollTop = document.body.scrollTop
      // scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      if (innerHeight < (outerHeight + scrollTop + 100)) {
        if (this.loading || this.current >= this.totalPage) {
          return
        }
        this.current = this.current + 1
        this.loading = true
        this.queryMyList()
      }
    },

    /**
     * 请求我的定制列表
     */
    queryMyList () {
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

    /**
     * 支付评估费
     */
     toPayAssessment(customOrderNo, assessmentFee){
       sessionStorage.setItem('customFeeType', 1);
        sessionStorage.setItem('assessmentType', 2);
        sessionStorage.setItem('assessmentFee', assessmentFee)
        sessionStorage.setItem('customOrderNo', customOrderNo)
        this.$router.push('/customPayment')
     },

    /**
     * 支付定制费
     */
     toPayCustom(customOrderNo, customFee){
        sessionStorage.setItem('customFeeType', 2);
        sessionStorage.setItem('customFee', customFee)
        sessionStorage.setItem('customOrderNo', customOrderNo)
        this.$router.push('/customPayment')
     },

     /**
      * 上传资料
      */
     toFileUpload(customOrderNo){
       sessionStorage.setItem('customOrderNo', customOrderNo)
        this.$router.push('/filesUpload')
     },

     /**
      * 填写琴侣ID
      */
     confirmPadId(customOrderNo){
       this.customOrderNo = customOrderNo;
       this.popupShow = true
     },

     /**
     * 确认收货
     */
    confirmOrder () {
      if (this.padId.trim() == '') {
        this.$toast('请输入琴侣id')
        return
      }
      this.$toast.loading({
        mask: true
      })
      this.$http({
        url: this.$http.adornUrl('/p/musicCustomized/confirm'),
        method: 'post',
        data: this.$http.adornData({
          customizedNo: this.customOrderNo,
          padId: this.padId
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.popupShow = false;
        localStorage.setItem('lastPadId', this.padId)
        this.current = 1
        this.queryMyList()
      })
    },

    /**
     * 调用微信扫码
     */
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
        that.$toast.clear()
      })
    },
  }

}
</script>
<style scoped>
.song-order-list-main{
  background: #f4f4f4;
}
/* 头部 */
.song-order-list-header {
  display: block;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid rgb(235, 235, 235);
  position: fixed;
  top: 0;
  width: 100%;
}
.song-order-list-header ul {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  border-bottom: 1px solid #f4f4f4;
}
.song-order-list-header li {
  height: 3.5em;
  line-height: 3.5em;
  font-size: 14px;
}
.song-order-list-header li:hover {
  color: red;
  border-bottom: 1px solid red;
}
.li-active {
  border-bottom: 1px solid red !important;
  color: red;
}
.song-order-list-list{
  margin-top:calc(3.5em + 11px);
}
/* 待上传 */
.song-order-list-list-upload {
  width: 100%;
  background-color: white;
  border-bottom: 5px solid #f4f4f4;
}
.song-order-list-list-upload-num {
  padding: 0 1em;
  height: 2.5em;
  border-bottom: 1px solid rgb(235, 235, 235);
  text-align: left;
  font-size: 14px;
}
.song-order-list-list-upload-num p {
  display: inline-block;
  line-height: 2.5em;
}
.song-order-list-list-upload-num-p3 {
  float: right;
  color: red;
}
.song-order-list-list-upload-date {
  padding: 1em;
}
.song-order-list-list-upload-date p {
  line-height: 2em;
  text-align: left;
  font-size: 14px;
}
.song-order-list-list-upload-btn {
  padding: 1em;
  border-top: 1px solid rgb(235, 235, 235);
}
.song-order-list-list-upload-btn button {
  float: right;
  width: 6em;
  height: 2.2em;
  border-radius: 8px;
  font-size: 13px;
  background-color: white;
}
.song-order-list-list-upload-btn .prod-fee{
    text-align: left;
    float: left;
    font-size: 14px;

    line-height: 2em;
}
.song-order-list-list-upload-btn .prod-fee .red{
    color: red;
}
.song-order-list-list-upload-btn2 {
  margin-left: 10px;
  border: 1px solid red;
  color: red;
}
.song-order-list-list-upload-btn1 {
  display: inline-block;
  margin-left: 1.5em;
  border: 1px solid rgb(138, 138, 138);
  color: rgb(138, 138, 138);
}

/* 弹框 */
.van-popup--center {
  top: 25%;
  width: 85%;
}
.popup-tit {
  padding-top: 1em;
  margin-top: 1em;
  font-size: 17px;
}
.id-int {
  padding: 2em 1em;
  position: relative;
  text-align: center;
}
.int-box {
  display: inline-block;
  width: 55%;
  height: 2.5em;
  line-height: 2.5em;
  font-size: 15px;
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  padding-left: 1em;
  padding-right: 1.5em;
  vertical-align: middle;
}
.int-box > input {
  width: 80%;
  border: none;
  border-radius: 5px;
  margin-left: 1em;
}
.down-arrow-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 29vw;
  width: 0.7em;
  height: 0.7em;
  background: url("../../assets/images/icon/paysele.png") no-repeat;
  background-size: 100%;
}
.ewm-icon {
  display: inline-block;
  width: 3em;
  height: 3em;
  background: url("../../assets/images/icon/payerweima.png") no-repeat;
  background-size: 100%;
  vertical-align: middle;
  margin-left: 5px;
}
.gotopay {
  display: inline-block;
  padding: 0.5em 2em;
  background: red;
  color: #fff;
  border-radius: 20px;
  margin-bottom: 2em;
  font-size: 14px;
}
/* 弹框 end */
</style>
