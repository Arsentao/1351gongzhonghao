<template>
  <div class="song-orders-main"
       v-wechat-title="this.title">
    <!-- 订单状态导航 -->
    <div class="song-orders-header">
      <ul>
        <li :class="{ 'li-active': status === 0 }"
            @click="activeNav(0)">全部</li>
        <li :class="{ 'li-active': status === 1 }"
            @click="activeNav(1)">待支付</li>
        <li :class="{ 'li-active': status === 2 }"
            @click="activeNav(2)">待收货</li>
        <li :class="{ 'li-active': status === 3 }"
            @click="activeNav(3)">已完成</li>
        <li :class="{ 'li-active': status === 4 }"
            @click="activeNav(4)">已取消</li>
      </ul>
    </div>
    <!-- 订单列表 -->
    <div class="song-orders-list">
      <ul>
        <li v-for="(items,index) of orderLists"
            :key="index">
          <div class="song-orders-list-upload">
            <div class="song-orders-list-upload-num clearfix">
              <p class="song-orders-list-upload-num-p1">订单编号：</p>
              <p class="song-orders-list-upload-num-p2">{{ items.orderNo }}</p>
              <p class="song-orders-list-upload-num-p3">{{['', '待支付', '待收货', '已完成', '已取消'][items.orderState]}}</p>
            </div>
            <div class="song-orders-list-upload-name">
              <!-- 单条曲谱 -->
              <div class="musciLists  clearfix"
                   id="music-lists"
                   v-for="(item,index) of items.musicOrderItemDtoList"
                   :key="index">
                <p class="song-orders-list-upload-name-p1">{{ item.musicName }}</p>
                <p class="song-orders-list-upload-name-p2">￥{{ item.price}}</p>
              </div>
              <div class="song-orders-goods-img-p">
                <p class="song-orders-goods-img-p1">共{{ items.musicOrderItemDtoList.length }}首曲目</p>
                <p class="song-orders-goods-img-p2">合计：</p>
                <p class="song-orders-goods-img-p3">￥</p>
                <p class="song-orders-goods-img-p4">{{ items.totalAmount }}</p>
              </div>
            </div>
            <!-- 按钮 -->
            <div class="song-orders-goods-btns clearfix">
              <!-- 订单状态（0:全部 1:待支付 2：已支付 3：已完成 4：已取消 5：已推送） -->
              <div class="song-orders-goods-btn">
                <button class="song-orders-goods-btn1"
                        v-show="items.orderState === 1"
                        @click="cancel(items.orderNo)">取消订单</button>
                <button v-show="items.orderState === 1"
                        class="song-orders-goods-btn2"
                        @click="toPay(items.orderNo, items.totalAmount)">付款</button>
                <button class="song-orders-goods-btn3"
                        @click="showPopup(items.orderNo)"
                        v-show="items.orderState === 2">确认收货</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="empty empty-order"
         v-if="orderLists.length==0">这里还没有相关订单~</div>
    <!-- 订单列表end -->

    <!-- 正在加载 -->
    <div class="prompt"
         v-if="totalPage>1">
      <span>{{loadingMsg}}</span>
    </div>

    <!-- 弹框 -->
    <van-popup v-model="show">
      <h2 class="popup-tit">请输入琴侣ID确认收货</h2>
      <div class="id-int">
        <input class="int-box"
               type="text"
               placeholder="请输入琴侣id"
               v-model="padId">
        <!-- <i class="down-arrow-icon"></i> -->
        <i class="ewm-icon" @click="scanCode"></i>
      </div>
      <div class="gotopay"
           @click="confirmOrder()">确认收货</div>
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
      title: '曲谱购买-订单列表',
      orderLists: [],
      status: 0,
      count: 0,
      totalPage: 1,
      current: 1,
      loading: true,
      loadingMsg: '正在加载...',
      show: false,
      orderNo: '',
      padId: localStorage.getItem('lastPadId')
    }
  },
  created () {
    window.addEventListener('scroll', this.onScroll)
    this.queryOrderList()

    var currUrl = process.env.HOST + '/songOrders'
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
    // 弹框
    showPopup (orderNo) {
      this.show = true
      this.orderNo = orderNo;
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
        url: this.$http.adornUrl('/p/music/order/confirm'),
        method: 'post',
        data: this.$http.adornData({
          orderNo: this.orderNo,
          padId: this.padId
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.show = false;
        localStorage.setItem('lastPadId', this.padId)
        this.current = 1
        this.queryOrderList()
      })
    },

    // 切换菜单样式
    activeNav (index) {
      this.status = index
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.current = 1
      this.queryOrderList()
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
        this.queryOrderList(this.current)
      }
    },

    // 请求数据
    queryOrderList () {
      this.$http({
        url: this.$http.adornUrl('/p/music/order/list'),
        method: 'GET',
        params: this.$http.adornParams({
          status: this.status,
          current: this.current,
          size: 10
        })
      }).then(({ data }) => {
        this.$toast.clear()
        if (data.current === 1) {
          this.orderLists = data.records
        } else {
          this.orderLists = this.orderLists.concat(data.records)
        }
        this.loading = false
        this.totalPage = data.pages
        this.current = data.current
        if (this.totalPage === this.current) {
          this.loadingMsg = '—— 厉害了，你刷到了我的底线~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
      })
    },

    // 取消订单
    cancel (orderNo) {
      this.$toast('取消订单成功')
      this.$http({
        url: this.$http.adornUrl('/p/music/order/cancel'),
        method: 'POST',
        data: this.$http.adornData({
          orderNo: orderNo
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.queryOrderList()
      })
    },

    /**
     * 去支付
     */
    toPay (orderNo, totalAmount) {
      sessionStorage.setItem('orderNo', orderNo)
      sessionStorage.setItem('songTotal', totalAmount)
      this.$router.push('/songPay')
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
/* 头部 */
.song-orders-header {
  display: block;
  width: 100%;
  height: 45px;
  background-color: white;
}
.song-orders-header ul {
  position: fixed;
  width: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid rgb(231, 231, 231);
  overflow: auto;
}
.song-orders-header li {
  height: 3em;
  line-height: 3em;
  font-size: 14px;
  border-bottom: 1px solid ghostwhite;
}
.li-active {
  border-bottom: 1px solid red !important;
  color: red;
}
.song-orders-list {
  width: 100%;
  background-color: white;
  /* margin-bottom: 1em; */
}
.song-orders-list ul > li {
  padding: 0 1em;
  border-bottom: 0.5em solid #f2f2f2;
  font-size: 12px;
}
.song-orders-list-upload-num {
  line-height: 40px;
  font-size: 14px;
  border-bottom: 1px solid rgb(233, 233, 233);
  text-align: left;
}
.song-orders-list-upload-num p {
  display: inline-block;
}
.song-orders-list-upload-num-p3 {
  color: red;
  float: right;
}
.song-orders-list-upload-name {
  padding: 1em 0;
}
.song-orders-list-upload-name-p1,
.song-orders-list-upload-name-p2 {
  display: inline-block;
  font-size: 15px;
  line-height: 2em;
}
.song-orders-list-upload-name-p1 {
  float: left;
  padding-left: 0.5em;
}
.song-orders-list-upload-name-p2 {
  float: right;
  padding-right: 0.5em;
}
.song-orders-goods-img-p {
  padding-top: 1.5em;
  text-align: right;
  padding-right: 0.5em;
  font-size: 15px;
}
.song-orders-goods-img-p p {
  display: inline-block;
}
.song-orders-goods-btns {
  width: 100%;
  border-top: 1px solid rgb(233, 233, 233);
}
.song-orders-goods-btn {
  float: right;
  padding-right: 1em;
  margin: 1em 0;
}
.song-orders-goods-btn1,
.song-orders-goods-btn2,
.song-orders-goods-btn3 {
  border-radius: 20px;
  font-size: 13px;
  background-color: white;
}
.song-orders-goods-btn1 {
  width: 7em;
  border: 1px solid gray;
  color: gray;
  margin-right: 1em;
  padding: 0.2em 1em;
}
.song-orders-goods-btn2 {
  width: 5em;
  border: 1px solid red;
  color: red;
  padding: 0.2em 1em;
}
.song-orders-goods-btn3 {
  width: 7em;
  border: 1px solid red;
  color: red;
  padding: 0.2em 1em;
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
.empty-order {
  padding-top: 2em;
}
</style>
