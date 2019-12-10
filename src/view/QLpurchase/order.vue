<template>
  <div class="sub-order"
       v-wechat-title="this.title">

    <!-- 地址为空 -->
    <a href="/address?type=order"
       class="address"
       v-if="!userAddr">
      <i class="nav-icon"></i>
      <div class="addr-msg">
        <p class="addr-user">
          <span>点击添加收货地址</span>
        </p>
      </div>
      <i class="into-icon"></i>
    </a>
    <!-- /地址为空 -->

    <!-- 有默认地址 -->
    <a href="/address?type=order"
       class="address"
       v-if="userAddr">
      <i class="nav-icon"></i>
      <div class="addr-msg">
        <p class="addr-user">
          <span>{{userAddr.receiver}}</span>
          <span>{{userAddr.mobile}}</span>
        </p>
        <p class="addr-txt">{{userAddr.province}}{{userAddr.city}}{{userAddr.area}}{{userAddr.addr}}</p>
      </div>
      <i class="into-icon"></i>
    </a>
    <!-- /有默认地址 -->

    <!-- 商品 -->
    <ul class="order-goods">
      <li class="item-goods"
          v-for="(item,index) of orderList"
          :key="index">
        <div class="item-goods-img">
          <img :src="item.pic"
               alt="">
        </div>
        <div class="item-goods-msg">
          <p class="goods-title">{{ item.prodName }}</p>
          <p class="goods-sku" :class="item.skuName == '银色'?'silver':'red'">{{item.skuName}}</p>
          <p class="goods-price">
            <i class="sub">￥</i>{{ item.price }}
            <!--<i class="sub">.{{ item.decimal }}</i> -->
          </p>
        </div>
        <div class="quantity">×{{ item.prodCount }}</div>
      </li>
    </ul>
    <!-- /商品 -->

    <!-- 数量统计 -->
    <p class="count-txt">共&nbsp;<span style="color:red">{{totalCount}}</span>&nbsp;件商品&nbsp;&nbsp;&nbsp;<span class="price-show">合计</span>&nbsp;<span class="red-price"><i class="sub">￥</i>{{total}}</span>
    </p>
    <!-- 给卖家留言 -->
    <div class="leave-msg">
      买家留言：<input type="text"
             placeholder="给卖家留言"
             v-model="remarks">
    </div>
    <!-- 订单总额 -->
    <div class="order-amount-details clearfix">
      <p class="amount-lst clearfix">
        <span class="price-show">订单总额</span>
        <span><i class="sub">￥</i>{{total}}</span>
      </p>
      <p class="amount-lst clearfix">
        <span class="price-show">快递费</span>
        <span v-show="totalCount == 1"><i class="sub">￥</i>18</span>
        <span v-show="totalCount != 1"><i class="sub">￥</i>0</span>
      </p>
    </div>
    <!-- 小计 -->
    <div class="subtotal"><span class="price-show" style="font-size:15px">小计</span><i class="sub">&nbsp;&nbsp;￥</i>{{actualTotal}}</div>
 

    <!-- 脚部 -->
    <div class="order-foot-box">
      <div class="order-foot">
        <span class="price-show">合计</span>&nbsp;&nbsp;<span class="count-txt "><i class="sub">￥</i>{{actualTotal}}</span>
        <div class="sbumit-order-btn"
             @click="toPay">提交订单</div>
      </div>
    </div>
    <!-- /脚部 -->
  </div>
</template>
<script>
import topHead from '../../components/header'
export default {
  components: { topHead },
  data () {
    return {
      orderList: [],
      orderEntry: sessionStorage.getItem('orderEntry'),
      userAddr: null,
      totalCount: 0,
      actualTotal: 0,
      transfee: 0,
      total: 0,
      addrId: this.$route.query.addrId || 0,
      remarks: ''
    }
  },
  created () {
    this.$toast.loading({
      forbidClick: true,
      duration: 0
    })
    this.$http({
      url: this.$http.adornUrl('/p/order/confirm'),
      method: 'post',
      data: this.$http.adornData({
        addrId: this.addrId,
        orderItem: this.orderEntry == 1 ? JSON.parse(sessionStorage.getItem('orderItem')) : undefined,
        basketIds: this.orderEntry == 0 ? JSON.parse(sessionStorage.getItem('basketIds')) : undefined
      })
    }).then(({ data }) => {
      this.$toast.clear()
      this.orderList = data.shopCartOrders[0].shopCartItemDiscounts[0].shopCartItems
      this.total = data.shopCartOrders[0].total
      this.totalCount = data.totalCount
      this.actualTotal = data.actualTotal
      this.userAddr = data.userAddr
      this.hahaha()
    })

  },



  methods: {
   hahaha: function(){
     console.log(this.totalCount)
   },
    toPay: function () {
      if (!this.userAddr) {
        this.$toast('请选择地址')
        return
      }

      this.submitOrder()
    },

    submitOrder: function () {
      this.$toast.loading({
        mask: true
      })
      this.$http({
        url: this.$http.adornUrl('/p/order/submit'),
        method: 'post',
        data: this.$http.adornData({
          orderShopParam: [{
            remarks: this.remarks,
            shopId: 1
          }]
        })
      }).then(({ data }) => {
        this.$toast.clear()
        sessionStorage.setItem('orderNumbers', data.orderNumbers)
        sessionStorage.setItem('actualTotal', this.actualTotal)
        this.$router.push('/payment')
        // this.calWeixinPay(data.orderNumbers);
      })
    }

  }

}
</script>
<style scoped>
.sub-order {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
}
.address {
  position: relative;
  display: block;
  width: 100%;
  border-bottom: 7px solid #f3f3f3;
  background: #fff;
}
/* 地址 */
.addr-msg {
  box-sizing: border-box;
  padding: 1.5em 0 1em 3em;
  line-height: 2em;
  text-align: left;
}
.addr-user {
  font-size: 14px;
}
.addr-user span {
  padding-right: 1em;
}
.addr-txt {
  color: #888;
  max-width: 75vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.nav-icon,
.into-icon {
  position: absolute;
  display: block;
  width: 1.3em;
  height: 1.3em;
}
.nav-icon {
  left: 1em;
  top: 1.8em;
  background: url("../../assets/images/icon/navig.png");
  background-size: 1.3em 1.3em;
}
.into-icon {
  width: 0.7em;
  height: 0.9em;
  right: 1.5em;
  top: 50%;
  transform: translateY(-50%);
  background: url("../../assets/images/icon/open-icon.png");
  background-size: 0.7em 0.9em;
}
/* 商品列表 */
.item-goods {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 1em;
  text-align: left;
  border-bottom: 1px solid #f3f3f3;
  background: #fff;
}
.item-goods-img,
.item-goods-msg {
  display: inline-block;
}
.quantity {
  position: absolute;
  right: 2em;
  bottom: 2em;
}
.item-goods-img {
  width: 23vw;
  height: 23vw;
}
.item-goods-img > img {
  width: 100%;
  height: 100%;
}
.item-goods-msg {
  height: 23vw;
  vertical-align: top;
  padding-left: 1em;
}
p.goods-title {
  display: block;
  max-width: 58vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
}
p.goods-sku {
  max-width: 58vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 0.7em;
  font-size: 14px;
}

.silver{
color: silver;
}

.red{
color: red;
}


.goods-price {
  padding-top: 1em;
  display: inline-block;
  font-size: 15px;
  color: #b90000;
}
i.sub {
  font-style: normal;
  font-size: 12px;
}
/* 统计数量 */
.count-txt {
  box-sizing: border-box;
  padding: 1em;
  text-align: right;
  border-bottom: 1px solid #f3f3f3;
  font-size: 15px;
}
.red-price {
  color: #b90000;
}
.leave-msg {
  font-size: 15px;
  padding: 0.5em 1em;
  border-bottom: 1px solid #f3f3f3;
  text-align: left;
  height: 30px;
  line-height: 30px;
}
.leave-msg > input {
  width: 68vw;
  border: none;
  outline: none;
}
/* 总额 */
.order-amount-details {
  box-sizing: border-box;
  padding: 1em;
  border-bottom: 1px solid #f3f3f3;
}
.amount-lst {
  font-size: 15px;
}
.amount-lst:first-child {
  margin-bottom: 1.5em;
}
.amount-lst:last-child {
  margin-bottom: 0.5em;
}
.amount-lst span:first-child {
  float: right;
  right: 80px;
  position: absolute;
}
.amount-lst span:nth-child(2) {
  float: right;
  color: rgb(185, 0, 0);
  font-size: 18px
}
.amount-lst span:last-child {
  float: right;
  color: rgb(185, 0, 0);
  font-size: 18px
}
.order-foot {
  font-size: 15px;
}
.order-foot > .count-txt .sub,
.subtotal .sub,
.amount-lst .sub {
  color: rgb(185, 0, 0);
}
/* 小计 */
.subtotal {
  box-sizing: border-box;
  padding: 0.5em 1em;
  text-align: right;
  font-size: 17px;
  color: rgb(185, 0, 0);
}
/* 脚部 */
.order-foot-box {
  margin-top: 5.5rem;
}
.order-foot {
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  bottom: 0;
  padding-left: 1em;
  text-align: left;
  height: 3.5rem;
  line-height: 3.5rem;
  background: #fff;
  box-shadow: 0 0 3px 0 #f3f3f3;
}
.order-foot > .count-txt {
  border: none;
  padding: 0;
  font-size: 15px;
  text-align: left;
  color: rgb(185, 0, 0);
}
.sbumit-order-btn {
  float: right;
  background: #b90000;
  color: #fff;
  height: 3.5rem;
  width: 30vw;
  text-align: center;
}
</style>
