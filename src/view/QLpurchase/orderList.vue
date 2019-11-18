<template>
  <div class="orderList-main"
       v-wechat-title="this.title">
    <div class="orderList-header">
      <ul>
        <li :class="selStatus==0?'active':''"
            @click="changeTab(0)">全部</li>
        <li :class="selStatus==1?'active':''"
            @click="changeTab(1)">待支付</li>
        <li :class="selStatus==2?'active':''"
            @click="changeTab(2)">待发货</li>
        <li :class="selStatus==3?'active':''"
            @click="changeTab(3)">待收货</li>
        <li :class="selStatus==5?'active':''"
            @click="changeTab(5)">已完成</li>
      </ul>
    </div>
    <div class="orderList-list">
      <div class="orderList-goods"
           v-for="(item,index) of orderLists"
           :key="index">
        <div class="orderList-goods-num clearfix">
          <span class="orderList-goods-num-p1"><span class="total-show">订单编号</span></span>
          <span class="orderList-goods-num-p2">{{item.orderNumber}}</span>
          <span class="orderList-goods-num-p3">{{['','待付款', '待发货', '待收货', '待评价', '已完成', '已取消'][item.status]}}</span>
        </div>
        <router-link tag="a"
                     class="orderList-goods-img"
                     :to="'/orderDetail/'+item.orderNumber">
          <div class="goods-img-box">
            <img :src="prodItem.pic"
                 alt
                 v-for="(prodItem,idx) of item.orderItemDtos"
                 :key="idx">
          </div>
          <div class="orderList-goods-img-p">
            <span class="orderList-goods-img-p1">共&nbsp;<span style="color:red">{{calProdCount(item.orderItemDtos)}}</span>&nbsp;件商品</span>
            <span class="price-show">合计</span>&nbsp;
            <span class="orderList-goods-img-p3">￥</span>
            <span class="orderList-goods-img-p4">
              <strong>{{item.actualTotal}}</strong>
            </span>
          </div>
        </router-link>
        <div class="orderList-goods-btns clearfix">
          <div class="orderList-goods-btn">
            <button class="cancel"
                    v-if="item.status==1"
                    @click="cancelOrder(item.orderNumber)">取消订单</button>
            <button class="topay"
                    v-if="item.status==1"
                    @click="toPay(item.orderNumber,item.actualTotal)">付款</button>
            <button class="topay"
                    v-if="item.status==3"
                    @click="receipt(item.orderNumber)">确认收货</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表为空时 -->
    <div class="empty"
         v-if="orderLists.length==0">这里还没有相关订单~</div>

    <!-- 正在加载 -->
    <div class="prompt"
         v-if="totalPage>1">
      <span>{{loadingMsg}}</span>
    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '琴侣 —— 我的订单',
      orderLists: [],
      selStatus: 0,
      totalPage: 1,
      current: 1,
      loading: true,
      loadingMsg: '正在加载...',
    }
  },
  created () {
    this.title = '琴侣 —— 我的订单'
    // 请求信息
    this.loadPageData(1)
  },

  methods: {
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
        this.loadPageData(this.current)
      }
    },

    /**
     * 加载订单列表
     */
    loadPageData (pageNum) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/myOrder/myOrder'),
        method: 'get',
        params: this.$http.adornParams({
          current: pageNum,
          size: 20,
          status: this.selStatus
        })
      }).then(({ data }) => {
        if (data.current === 1) {
          this.orderLists = data.records
        } else {
          this.orderLists = this.orderLists.concat(data.records)
        }
        this.loading = false
        this.totalPage = data.pages
        this.current = data.current
        if (this.totalPage === this.current) {
          this.loadingMsg = '—— 没有更多订单了~ ——'
        } else {
          this.loadingMsg = '加载中...'
        }
        this.$toast.clear()
      })
    },

    /**
     * 切换状态tab
     */
    changeTab (sts) {
      this.selStatus = sts
      this.loadPageData(1)
    },

    /**
     * 计算订单的商品总数量
     */
    calProdCount (orderItem) {
      var count = 0
      for (var i = 0; i < orderItem.length; i++) {
        count += orderItem[i].prodCount
      }
      return count
    },

    /**
     * 去支付
     */
    toPay (orderNumber, actualTotal) {
      sessionStorage.setItem('orderNumbers', orderNumber)
      sessionStorage.setItem('actualTotal', actualTotal)
      this.$router.push('/payment')
    },

    /**
     * 取消订单
     */
    cancelOrder (orderNumber) {
      this.$dialog.confirm({
        title: '',
        message: '确认要取消此订单？'
      }).then(() => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/myOrder/cancel/' + orderNumber),
          method: 'PUT'
        }).then(({ data }) => {
          this.loadPageData(1)
        })
      }).catch(() => {

      })
    },

    /**
     * 确认收货
     */
    receipt (orderNumber) {
      this.$dialog.confirm({
        title: '',
        message: '确认收到货物了吗？'
      }).then(() => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/myOrder/receipt/'),
          method: 'PUT'
        }).then(({ data }) => {
          this.loadPageData(1)
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style scoped>
button {
  outline: none;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.orderList-main {
  position: fixed;
  overflow: auto;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
}
/* 头部 */
.orderList-header {
  display: block;
  background-color: white;
  position: fixed;
  width: 100%;
  top: 0;
  border-bottom: 1px solid #f2f2f2;
}
.orderList-header ul {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.orderList-header li {
  height: 3em;
  line-height: 3em;
  font-size: 12px;
  border-bottom: 1px solid ghostwhite;
  font-size: 14px;
}
.orderList-header li.active {
  color: red;
  border-bottom: 1px solid red;
}

/* 订单 */
.orderList-list {
  padding-top: 3em;
}
.orderList-goods {
  background-color: #fff;
  margin-top: 5px;
  margin-bottom: 1em;
}
/* 订单编号 */
.orderList-goods-num {
  width: 100%;
  height: 3em;
  line-height: 3em;
  font-size: 14px;
  border-bottom: 1px solid #f1f1f1;
  box-sizing: border-box;
  padding: 0 1em;
  text-align: left;
}
.orderList-goods-num-p1 {
  padding-right: 0.5em;
}
.orderList-goods-num-p3 {
  float: right;
  color: red;
}
.orderList-goods-img {
  display: block;
  box-sizing: border-box;
  margin: 0 1em;
  padding: 1em 0;
  border-bottom: 1px solid #f1f1f1;
}
.goods-img-box {
  text-align: left;
}
.orderList-goods-img img {
  width: 100px;
  height: 100px;
  display: inline-block;
  padding-right: 0.5em;
}
.orderList-goods-img-p {
  text-align: right;
  padding-top: 1.5em;
  font-size: 13px;
}
.orderList-goods-img-p1 {
  margin-right: 10px;
}
.orderList-goods-img-p4 > strong {
  font-weight: normal;
  font-size: 16px;
  color: red;
}
.orderList-goods-img-p3 {
  font-size: 16px;
  color: red;
}
/* 按钮 */
.orderList-goods-btns {
  box-sizing: border-box;
  padding: 1em;
}
.orderList-goods-btn {
  float: right;
}
.orderList-goods-btn button {
  width: 7em;
  height: 2em;
  border-radius: 20px;
  border: 1px solid gray;
  background-color: white;
  font-size: 13px;
  color: gray;
  margin-left: 1em;
}
.orderList-goods-btn .topay {
  border: 1px solid red;
  background-color: white;
  color: red;
}
</style>
