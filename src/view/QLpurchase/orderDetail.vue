<template>
  <div class="order-detail-main"
       v-wechat-title='this.title'>
    <!-- 地址 -->
    <div class="order-detail-add">
      <div class="addr-top">
        <span class="order-detail-add-p1">{{ userAddrDto.receiver }}</span>
        <span class="order-detail-add-p2">{{ userAddrDto.mobile }}</span>
      </div>
      <p class="order-detail-add-p3">{{ userAddrDto.province + userAddrDto.city + userAddrDto.area + userAddrDto.addr}}</p>
    </div>

    <!-- 商品信息 -->
    <div class="order-detail-list1">
      <div class="status-bar">
        <span class="status-txt">{{ ['','待付款', '待发货', '待收货','已完成', '已完成', '已取消'][status] }}</span>
      </div>
      <ul>
        <li class="order-detail-list1-li1 clearfix"
            v-for="(items,index) of orderItemDtos"
            :key="index">
          <div class="goods-imgs">
            <img :src="items.pic"
                 alt="">
          </div>
          <div class="goods-text">
            <p class="order-detail-list1-p1">{{ items.prodName }}</p>
            <p class="order-detail-list1-p2">规格：{{ items.skuName }}</p>
            <p class="order-detail-list1-p2">数量：{{ items.prodCount }}</p>
            <p class="order-detail-list1-p4"><i class="sub">￥</i>{{ items.price }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 订单信息 -->
    <div class="order-detail-num">
      <div class="order-detail-date">
        <div class="order-numbee">
          <span class="order-detail-date-p1">订单编号：</span>
          <span class="order-detail-date-p2"
                id="copytext">{{ orderNumber }}</span>
        </div>
        <div class="order-time">
          <span class="order-detail-date-p3">下单时间：</span>
          <span class="order-detail-date-p4">{{ createTime }}</span>
        </div>
        <div class="copy-btn-box">
          <p class="copy-button"
             @click="copyBtn">复制</p>
          <textarea id="text-int"></textarea>
        </div>
      </div>
      <div class="order-detail-fangshi">
        <p class="order-content">
          <span class="order-content-tit">支付方式：</span>
          <span class="payment-method">{{ paytype }}</span>
        </p>
        <p class="order-content">
          <span class="order-content-tit">配送方式：</span>
          <span class="distribution-mode">普通配送</span>
        </p>
        <p class="order-content">
          <span class="order-content-tit">订单备注：</span>
          <span class="order-remarks">{{ remarks }}</span>
        </p>
      </div>
    </div>

    <!-- 金额信息 -->
    <div class="order-detail-price">
      <div class="order-detail-price-list1">
        <!-- 总额 -->
        <div class="total-orders clearfix">
          <span class="order-detail-price-p1">订单总额：</span>
          <span class="order-detail-price-p3"><i class="sub">￥</i>{{ total }}</span>
        </div>
        <!-- 运费 -->
        <div class="freight clearfix">
          <span class="order-detail-price-p4">运费：</span>
          <span class="order-detail-price-p6"><i class="sub">￥</i>{{ transfee }}</span>
        </div>
      </div>
      <div class="order-detail-price-list2">
        <span class="order-detail-price-list2-p1">实付款：</span>
        <span class="sub">￥</span>
        <span class="order-detail-price-list2-p3">{{ actualTotal }}</span>
      </div>
    </div>

    <!-- 脚部 -->
    <!-- <div class="foot-box"> -->
    <div class="order-detail-btn">
      <!-- 1.待付款 -->
      <span class="order-detail-btn1"
            v-show="status === 1"
            @click="cancelOrder(orderNumber)">取消</span>
      <span class="order-detail-btn2"
            v-show="status === 1"
            @click="toPay(orderNumber,actualTotal)">付款</span>
      <!-- 3.待收货 -->
      <span class="order-detail-btn2"
            v-show="status === 3"
            @click="confirmReceipt(orderNumber)">确认收货</span>
      <!-- 6.失败 -->
      <span class="order-detail-btn1"
            v-show="status === 6"
            @click="deleteOrder(orderNumber)">删除订单</span>
    </div>
    <!-- </div> -->

  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '订单详情',
      orderNumber: this.$route.params.orderNumber, // 订单号
      createTime: '', // 订单创建时间
      remarks: '', // 订单备注信息
      total: 0, // 订单总额
      transfee: 0, // 运费
      actualTotal: 0, // 实际总值
      status: 1, // 订单状态
      paytype: '微信支付', // 支付方式
      // 地址
      userAddrDto: [],
      // 产品信息
      orderItemDtos: []
    }
  },
  created () {
    this.title = '订单详情'
    this.queryOrderDetail()
    console.log(this.status)
  },
  methods: {
    // 复制按钮
    copyBtn () {
      let copytext = document.getElementById('copytext').innerHTML
      let textInt = document.getElementById('text-int')
      textInt.value = copytext // 修改文本框内容
      textInt.select() // 选中文本
      document.execCommand('copy') // 执行浏览器复制命令
      this.$toast('复制成功')
    },

    // 请求数据
    queryOrderDetail () {
      this.$http({
        url: this.$http.adornUrl('/p/myOrder/orderDetail'),
        method: 'GET',
        params: this.$http.adornParams({
          orderNumber: this.orderNumber
        })
      }).then(({ data }) => {
        this.userAddrDto = data.userAddrDto
        this.orderItemDtos = data.orderItemDtos
        this.createTime = data.createTime
        this.remarks = data.remarks
        this.total = data.total
        this.transfee = data.transfee
        this.actualTotal = data.actualTotal
        this.status = data.status
      })
    },

    // 确认收货
    confirmReceipt (orderNumber) {
      this.$http({
        url: this.$http.adornUrl('/p/myOrder/receipt/' + orderNumber),
        method: 'PUT',
        data: this.$http.adornUrl({
          orderNumber: this.orderNumber
        })
      }).then(({ data }) => {
        this.queryOrderDetail()
      })
    },

    // 取消订单
    cancelOrder (orderNumber) {
      console.log(this.orderNumber)
      this.$dialog.confirm({
        title: '',
        message: '确认要要取消此订单？'
      }).then(() => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/myOrder/cancel/' + orderNumber),
          method: 'PUT',
          data: this.$http.adornData({
            orderNumber: this.orderNumber
          })
        }).then(({ data }) => {
          this.$toast.clear()
          this.queryOrderDetail()
        })
      }).catch(() => {

      })
    },

    // 删除订单
    deleteOrder (orderNumber) {
      this.$toast('删除订单成功')
      this.$http({
        url: this.$http.adornUrl('/p/myOrder/' + orderNumber),
        method: 'DELETE',
        data: this.$http.adornData({
          orderNumber: this.orderNumber
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.$router.push('/orderList')
      })
    },

    /**
     * 去支付
     */
    toPay (orderNumber, actualTotal) {
      sessionStorage.setItem('orderNumbers', orderNumber)
      sessionStorage.setItem('actualTotal', actualTotal)
      this.$router.push('/payment')
    }

  }
}
</script>
<style scoped>
.order-detail-main {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  z-index: -99;
  overflow: auto;
}
/* 头部地址栏 */
.order-detail-add {
  padding: 1em;
  background-color: white;
  text-align: left;
  margin-bottom: 1em;
}
.addr-top {
  line-height: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.order-detail-add-p3 {
  line-height: 1.5em;
  color: #aaa;
  font-size: 14px;
}
.order-detail-add-p1 {
  padding-right: 1.5em;
}

/* 商品 */
.order-detail-list1 {
  border-bottom: 1px solid ghostwhite;
  background-color: white;
  margin-bottom: 1em;
}
.status-bar {
  text-align: right;
  padding: 0.5em 1em;
  border-bottom: 1px solid #f2f2f2;
}
.status-txt {
  color: rgb(219, 0, 0);
}
.order-detail-list1-li1 {
  padding: 1em;
  border-bottom: 1px solid ghostwhite;
}
.goods-imgs {
  float: left;
  width: 6rem;
  height: 6rem;
  padding-right: 1em;
}
.goods-imgs img {
  width: 100%;
  height: 100%;
}
.goods-text {
  float: left;
}
.order-detail-list1-p1 {
  text-align: left;
  line-height: 1.5em;
  font-size: 15px;
  width: 58vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-detail-list1-p2 {
  text-align: left;
  margin-top: 0.5em;
  color: #aaa;
  font-size: 13px;
}
.order-detail-list1-p4 {
  text-align: left;
  margin-top: 0.7em;
  color: #e40303;
  font-size: 16px;
}

/* 订单信息 */
.order-detail-num {
  background-color: white;
  margin-bottom: 1em;
}
/* 编号时间... */
.order-detail-date {
  position: relative;
  border-bottom: 1px solid #f2f2f2;
  text-align: left;
  padding: 1em;
  font-size: 13px;
}
.order-numbee {
  line-height: 2em;
}
.order-detail-date-p1,
.order-detail-date-p3 {
  color: rgb(160, 160, 160);
}
.copy-btn-box {
  position: absolute;
  right: 1em;
  top: 1.2em;
}
#text-int {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 1em;
  height: 1em;
  opacity: 0;
}
.copy-button {
  display: inline-block;
  border: 1px solid rgb(160, 160, 160);
  border-radius: 10px;
  padding: 0.2em 0.8em;
  font-size: 11px;
  color: rgb(131, 131, 131);
}
/* 方式... */
.order-detail-fangshi {
  padding: 1em;
  text-align: left;
  font-size: 13px;
}
.order-content {
  line-height: 2em;
}
.order-content-tit {
  color: rgb(160, 160, 160);
  vertical-align: top;
}
.order-remarks {
  display: inline-block;
  width: 68vw;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  /* line-height: 1em; */
  vertical-align: top;
}

/* 总额 */
.order-detail-price {
  background-color: white;
  margin-bottom: 1em;
}
.order-detail-price-list1 {
  padding: 1em;
  line-height: 2em;
  border-bottom: 1px solid #f2f2f2;
  font-size: 13px;
}
.order-detail-price-p1,
.order-detail-price-p4 {
  float: left;
}
.order-detail-price-p3,
.order-detail-price-p6 {
  float: right;
  font-size: 15px;
  color: #e40303;
}
.sub {
  font-style: normal;
  color: #e40303;
  font-size: 12px;
}
.order-detail-price-list2 {
  box-sizing: border-box;
  text-align: right;
  padding: 1em;
  font-size: 13px;
}
.order-detail-price-list2-p3 {
  color: #e40303;
  font-size: 15px;
}

/* 底部+按钮 */
/* .foot-box {
  margin-top: 55px;
} */
.order-detail-btn {
  /* position: fixed;
  bottom: 0; */
  box-sizing: border-box;
  width: 100%;
  background-color: white;
  text-align: right;
  padding: 0 1em;
  font-size: 13px;
}
.order-detail-btn1,
.order-detail-btn2 {
  border-radius: 20px;
  padding: 0.3em 1.5em;
  height: 4em;
  line-height: 4em;
}
.order-detail-btn1 {
  border: 1px solid rgb(131, 131, 131);
  color: rgb(131, 131, 131);
  margin-right: 1em;
}
.order-detail-btn2 {
  border: 1px solid #e40303;
  color: #fff;
  background: #e40303;
}
.order-detail-btn3 {
  /* border: 1px solid #aaa; */
  padding: 0.5em 1.5em;
  color: #aaa;
}
</style>
