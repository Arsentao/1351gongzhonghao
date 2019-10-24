<template>
  <div class="det-foot-box">
    <footer class="clearfix">
      <ul class="detfoot-left">
        <li>
          <a href="/index">
            <img src="../assets/images/icon/foot_nav_home_02.png"
                 alt="">
            <p>首页</p>
          </a>
        </li>
        <li>
          <a href="/car">
            <img src="../assets/images/icon/detCar.png"
                 alt="">
            <p>购物车</p>
            <span class="cart-total-count"
                  v-if="totalCartNum>0">{{totalCartNum}}</span>
          </a>
        </li>
      </ul>
      <ul class="detfoot-right clearfix">
        <li>
          <a href="javascript:void(0)"
             @click="buyNow">立即购买</a>
        </li>
        <li>
          <a href="javascript:void(0)"
             @click="addToCart">加入购物车</a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    totalCartNum: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  methods: {
    addToCart () {
      this.$parent.addToCart()
    },
    buyNow () {
      this.$parent.buyNow()
    }
  }
}
</script>

<style>
.det-foot-box {
  margin-top: 45px;
}
footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  height: 50px;
  box-shadow: 0px -1px 1px rgba(150, 150, 150, 0.1);
}
/* 左边 */
.detfoot-left {
  float: left;
  width: 40%;
  height: 100%;
}
.detfoot-left > li {
  display: inline-block;
  width: 48%;
  height: 100%;
  position: relative;
}
.detfoot-left > li > a {
  display: block;
}
.detfoot-left > li img {
  width: 2em;
  height: 1.8em;
  padding-top: 0.4em;
}
.detfoot-left > li p {
  color: #8e8e8e;
  font-size: 13px;
}
/* 右边 */
.detfoot-right {
  float: right;
  width: 60%;
  height: 100%;
}
.detfoot-right > li {
  float: right;
  width: 50%;
  height: 100%;
}
.detfoot-right > li:first-child {
  background-color: #02a1e9;
}
.detfoot-right > li:last-child {
  background-color: #564e5f;
}
.detfoot-right > li > a {
  display: block;
  text-align: center;
  line-height: 50px;
  color: white;
  font-size: 14px;
}
.cart-total-count {
  position: absolute;
  top: 5px;
  right: 20px;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #eb2444;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  color: #fff;
}
</style>
