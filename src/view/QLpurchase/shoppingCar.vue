<template>
  <div class="shopping-car-wrap"
       v-wechat-title="this.title">
    <!-- <top-head v-html="headtitle"></top-head> -->
    <ul class="goods-box">
      <li class="clearfix"
          v-for="(item,index) of selectList"
          :key="index">
        <!-- 左侧选择 -->
        <i :class="['car-select',item.checked?'car-select-current':'']"
           @click="onSelectedItem(index)"></i>
        <!-- 右侧信息star -->
        <div class="message msg-top">
          <!-- 商品信息 -->
          <div class="good-msg clearfix">
            <div class="msg-img">
              <img :src="item.pic"
                   alt="">
            </div>
            <!-- 文字信息 -->
            <div class="msg-txt">
              <!-- 名称 -->
              <p class="title">{{ item.prodName }}</p>
              <!-- 规格 -->
              <p class="sku">{{ item.skuName }}</p>
              <!-- 价格 -->
              <p class="goods-price">
                <i class="sub">￥</i>{{ item.price }}</p>
            </div>
          </div>
          <!-- 数量 +/- -->
          <div class="quant">
            <v-counter :min="1"
                       :max="100"
                       :number="item.prodCount"
                       @onNumChange="onNumChange"
                       :index="index"></v-counter>
            <!-- <span>数量：{{ item.prodCount }}件</span> -->
          </div>
        </div>
        <!-- 右侧信息end -->
      </li>
    </ul>
    <div class="empty"
         v-if="selectList.length==0">购物车还没有宝贝~</div>
    <!-- 脚部 -->
    <div class="foot-box">
      <div class="foot">
        <!-- 左侧选择 -->
        <i :class="['car-select',allChecked?'car-select-current':'']"
           @click="onSelAll"></i>
        <span class="all-election"
              @click="onSelAll">全选</span>
        <span class="car-del"
              @click="onDelBasket">删除</span>
        <p class="total"><span class="price-show">合计</span>&nbsp;<span class="goods-price">
            <i class="sub">￥</i>{{ totalMoney }}</span>
        </p>
        <div class="count-price"
             @click="toFirmOrder">结算</div>
      </div>
    </div>
  </div>
</template>

<script>
import topHead from '../../components/header'
import VCounter from '../../components/counter'
export default {
  components: {
    topHead,
    VCounter
  },
  data () {
    return {
      title: '琴侣 —— 购物车',
      // 购物车列表
      selectList: [],
      allChecked: true,
      // 购物车选中项
      totalMoney: 0 // 总额
    }
  },
  mounted: function () {

  },
  created () {
    this.title = '琴侣 —— 购物车'
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
        url: this.$http.adornUrl('/p/shopCart/info'),
        method: 'POST'
      }).then(({ data }) => {
        this.$toast.clear()
        if (data.length > 0) {
          this.selectList = data[0].shopCartItemDiscounts[0].shopCartItems
          this.selectList.forEach(shopCartItem => {
            shopCartItem.checked = true
          })
        } else {
          this.selectList = []
        }
        this.allChecked = true
        this.calTotalPrice()// 计算总价
      })
    },

    // counter组件回调函数
    onNumChange (_count, _index) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      var _prodId = this.selectList[_index].prodId
      var _skuId = this.selectList[_index].skuId
      var prodCount = this.selectList[_index].prodCount
      this.$http({
        url: this.$http.adornUrl('/p/shopCart/changeItem'),
        method: 'POST',
        data: this.$http.adornData({
          basketId: 0,
          count: _count,
          prodId: _prodId,
          skuId: _skuId
        })
      }).then(({ data }) => {
        this.selectList[_index].prodCount = prodCount + _count
        this.calTotalPrice() // 计算总价
        this.$toast.clear()
      })
    },

    /**
     * 每一项的选择事件
     */
    onSelectedItem (selIndex) {
      this.selectList[selIndex].checked = !this.selectList[selIndex].checked // 改变状态
      this.$set(this.selectList, selIndex, this.selectList[selIndex])

      this.checkAllSelected()// 检查全选状态
      this.calTotalPrice()// 计算总价
    },

    /**
    * 检查全选状态
    */
    checkAllSelected () {
      var allChecked = true
      var selectList = this.selectList
      for (var i = 0; i < selectList.length; i++) {
        if (!selectList[i].checked) {
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
      var selectList = this.selectList

      for (var i = 0; i < selectList.length; i++) {
        selectList[i].checked = allChecked
      }

      this.allChecked = allChecked
      this.calTotalPrice()// 计算总价
    },

    /**
     * 计算总价
     */
    calTotalPrice () {
      var totalMoney = 0
      var selectList = this.selectList
      for (var i = 0; i < selectList.length; i++) {
        if (selectList[i].checked) {
          totalMoney = totalMoney + selectList[i].price * selectList[i].prodCount
        }
      }
      this.totalMoney = totalMoney.toFixed(2)
    },

    /**
     * 删除购物车商品
     */
    onDelBasket () {
      var selectList = this.selectList
      var basketIds = []
      for (var i = 0; i < selectList.length; i++) {
        if (selectList[i].checked) {
          basketIds.push(selectList[i].basketId)
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
            url: this.$http.adornUrl('/p/shopCart/deleteItem'),
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
     * 去结算
     */
    toFirmOrder () {
      var selectList = this.selectList
      var basketIds = []
      for (var i = 0; i < selectList.length; i++) {
        if (selectList[i].checked) {
          basketIds.push(selectList[i].basketId)
        }
      }
      if (basketIds.length == 0) {
        this.$toast('请选择商品')
      } else {
        sessionStorage.setItem('basketIds', JSON.stringify(basketIds))
        sessionStorage.setItem('orderEntry', 0)
        this.$router.push('/order')
      }
    }

  }
}
</script>

<style scoped>
.shopping-car-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  overflow: auto;
}
.goods-box {
  width: 100%;
  height: auto;
  margin-top: 1em;
}
.goods-box > li {
  position: relative;
  width: 100%;
  background: #fff;
}
.car-select {
  position: absolute;
  left: 1em;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5em;
  height: 1.5em;
  background: url("../../assets/images/icon/choose-round.png") no-repeat;
  background-size: 1.5em 1.5em;
}
i.car-select-current {
  background: url("../../assets/images/icon/choosed-red.png");
  background-size: 1.5em 1.5em;
}
.message {
  position: relative;
  width: 88%;
  float: right;
}
.msg-top {
  border-bottom: 1px solid #f3f3f3;
}
.good-msg {
  text-align: left;
  padding: 0.5em 0;
}
.good-msg > .msg-img {
  display: inline-block;
  width: 22vw;
  height: 22vw;
  margin-right: 1em;
}
.msg-img img {
  width: 100%;
  height: 100%;
}
.msg-txt {
  display: inline-block;
  vertical-align: top;
  text-align: left;
}
.msg-txt .title {
  max-width: 13rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
}
.sku {
  color: rgb(182, 182, 182);
  padding-top: 0.5em;
  max-width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.goods-price {
  display: inline-block;
  padding-top: 1.2em;
  color: rgb(185, 0, 0);
  font-size: 14px;
}
.goods-price > .sub {
  color: rgb(185, 0, 0);
  font-style: normal;
  font-size: 12px;
}
.quant {
  /* position: absolute; */
  right: 1.5em;
  bottom: 1.2em;
}
/* foot */
.foot-box {
  margin-top: 5.5rem;
}
.foot {
  width: 100%;
  height: 3.5rem;
  line-height: 3.5rem;
  position: fixed;
  bottom: 0;
  text-align: left;
  background: #fefefe;
}
.foot::before {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  z-index: -11;
  background: #fcfafa;
  box-shadow: 1px 0px 1px 1px #fcfafa;
}
.all-election {
  padding-left: 3em;
  font-size: 13px;
}
p.total {
  display: inline-block;
  font-size: 13px;
}
.total .goods-price {
  padding: 0;
  margin: 0;
}
.car-del {
  color: rgb(185, 0, 0);
  padding: 0 1em;
  font-size: 13px;
}
.count-price {
  background: rgb(185, 0, 0);
  border: none;
  color: #fff;
  height: 3.5rem;
  width: 6.5rem;
  float: right;
  outline: none;
  text-align: center;
  font-size: 15px;
}
</style>
