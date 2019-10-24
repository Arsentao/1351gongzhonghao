<template>
  <div class="song-cart-main"
       v-wechat-title="this.title">
    <div class="song-cart-head">
      <!-- 左侧选择 -->
      <i @click="onSelAll"
         :class="['car-select','all-icon',allChecked?'car-select-current':'']"></i>
      <p @click="onSelAll"
         class="song-cart-head-p1 car-select-current">全选</p>
      <p class="song-cart-head-p2"
         @click="onDelBasket">删除</p>
    </div>
    <ul class="song-cart-list">
      <li class="song-cart-list-item clearfix"
          v-for="(items,index) of buyList"
          :key="index">
        <!-- 左侧选择 -->
        <i :class="['car-select',items.checked?'car-select-current':'']"
           @click="onSelectedItem(index)"></i>
        <!-- 右侧信息 -->
        <!-- 右侧信息star -->
        <div class="message msg-top">
          <!-- <p class="song-cart-p1">{{items.musicNo}}</p> -->
          <p class="message-song-title">{{items.musicName}}</p>
          <button class="song-cart-list-item-btn">￥{{items.price}}</button>
        </div>
      </li>
    </ul>
    <div class="empty"
         v-if="buyList.length==0">购物车还没有宝贝~</div>
    <div class="foot-box">
      <div class="fixed-bottom">
        <div class="song-cart-price clearfix">
          <p>已选{{ count }}，总计： <span><i class="sub">￥</i>{{ addUp }}</span></p>
        </div>
        <div class="song-cart-btn">
          <button @click="toPay">立即购买</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '曲谱购物车',
      buyList: [],
      addUp: 0, // 总额
      count: 0,
      allChecked: true
    }
  },
  created () {
    this.loadCarData()
  },
  methods: {
    /**
     * 加载购物车数据
     */
    loadCarData () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/musicCart/cartList'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.buyList = data
        this.$toast.clear()
        if (data.length > 0) {
          this.buyList = data
          this.buyList.forEach(item => {
            item.checked = true
          })
        } else {
          this.buyList = []
        }
        this.allChecked = true
        this.calTotalPrice()// 计算总价
      })
    },

    /**
     * 立即购买
     */
    toPay () {
      var buyList = this.buyList
      var basketIds = []
      for (var i = 0; i < buyList.length; i++) {
        if (buyList[i].checked) {
          basketIds.push(buyList[i].id)
        }
      }
      if (basketIds.length == 0) {
        this.$toast('请选择商品')
      } else {
        this.$toast.loading({
          forbidClick: true,
          duration: 0
        })
        this.$http({
          url: this.$http.adornUrl('/p/music/order/cartBuy'),
          method: 'POST',
          data: basketIds
        }).then(({ data }) => {
          this.$toast.clear()
          sessionStorage.setItem('orderNo', data.orderNo)
          sessionStorage.setItem('songTotal', this.addUp)
          this.$router.push('/songPay')
          // this.totalCartNum = this.totalCartNum + this.prodNum
        })
      }
    },

    /**
     * 删除购物车商品
     */
    onDelBasket () {
      var buyList = this.buyList
      var basketIds = []
      for (var i = 0; i < buyList.length; i++) {
        if (buyList[i].checked) {
          basketIds.push(buyList[i].id)
        }
      }
      if (basketIds.length == 0) {
        this.$toast('请选择商品')
      } else {
        this.$dialog.confirm({
          title: '',
          message: '确认要删除选中的商品吗？'
        }).then(() => {
          this.$toast.loading({
            forbidClick: true,
            duration: 0
          })
          this.$http({
            url: this.$http.adornUrl('/p/musicCart/deleteCartItems'),
            method: 'DELETE',
            data: basketIds
          }).then(({ data }) => {
            this.loadCarData()
          })
        }).catch(() => {

        })
      }
    },

    /**
     * 每一项的选择事件
     */
    onSelectedItem (buyListIndex) {
      this.buyList[buyListIndex].checked = !this.buyList[buyListIndex].checked // 改变状态
      this.$set(this.buyList, buyListIndex, this.buyList[buyListIndex])

      this.checkAllSelected()// 检查全选状态
      this.calTotalPrice()// 计算总价
    },

    /**
    * 检查全选状态
    */
    checkAllSelected () {
      var allChecked = true
      var buyList = this.buyList
      for (var i = 0; i < buyList.length; i++) {
        if (!buyList[i].checked) {
          allChecked = !allChecked
          break
        }
      }
      this.allChecked = allChecked
    },

    /**
     * 全选
     */
    onSelAll: function () {
      var allChecked = this.allChecked
      allChecked = !allChecked // 改变状态
      var buyList = this.buyList

      for (var i = 0; i < buyList.length; i++) {
        buyList[i].checked = allChecked
      }

      this.allChecked = allChecked
      this.calTotalPrice()// 计算总价
    },

    /**
     * 计算总价
     */
    calTotalPrice () {
      var addUp = 0
      var count = 0
      var buyList = this.buyList
      for (var i = 0; i < buyList.length; i++) {
        if (buyList[i].checked) {
          addUp = addUp + buyList[i].price
          count++
        }
      }
      this.addUp = addUp.toFixed(2)
      this.count = count
    }
  }

}
</script>
<style>
.song-cart-mian {
  position: fixed;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  background: #eee;
}
.song-cart-head {
  width: 100%;
  height: 45px;
  line-height: 45px;
  display: flex;
  border-bottom: 1px solid gainsboro;
  font-size: 14px;
  background: #fff;
}
.song-cart-head img {
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 10px;
  margin-top: 12px;
}
.song-cart-head-p1 {
  padding-left: 3.5em;
}
.song-cart-head-p2 {
  position: absolute;
  right: 15px;

  color: red;
}
/* li */
.song-cart-list-item {
  position: relative;
  box-sizing: border-box;
  padding: 1em;
  background: #fff;
  padding-bottom: 0;
}
/* 列表左侧选择 */
.car-select {
  display: block;
  position: absolute;
  left: 1em;
  top: 1em;
  width: 1.5em;
  height: 1.5em;
  background: url("../../assets/images/icon/choose-round.png") no-repeat;
  background-size: 100%;
}
i.car-select-current {
  background: url("../../assets/images/icon/unchoose.png") no-repeat;
  background-size: 100%;
}
/* 全选icon */
.all-icon {
  width: 1.3em;
  height: 1.3em;
}
/* 列表右侧信息 */
.message {
  width: 90%;
  float: right;
  text-align: left;
  padding-bottom: 1em;
}
.msg-top {
  border-bottom: 1px solid #f3f3f3;
}
.message-song-title {
  font-size: 15px;
  padding-bottom: 1em;
  text-align: left;
}
.song-cart-list {
  display: block;
}
.song-cart-list-item-btn {
  border-radius: 10%;
  border: 1px solid red;
  background-color: white;
  color: red;
  padding: 0 0.3em;
}
/* 脚部 */
.foot-box {
  margin-top: 8rem;
}
.fixed-bottom {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 11;
}
.song-cart-btn {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #fff;
}
.song-cart-btn button {
  width: 50%;
  height: 2.5em;
  line-height: 2.5em;
  border-radius: 30px;
  color: white;
  background-color: red;
  border: none;
  font-size: 14px;
}
.song-cart-price {
  width: 100%;
  color: #000;
  background: #f3f3f3;
}
.song-cart-price > p {
  float: right;
  margin-right: 15px;
  font-size: 14px;
  padding: 1em 0;
}
.song-cart-price > p > span {
  color: red;
  font-size: 15px;
}
.song-cart-price > p > span > .sub {
  font-size: 12px;
  font-style: normal;
}
</style>
