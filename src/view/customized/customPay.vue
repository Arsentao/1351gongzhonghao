<template>
  <div class="pay-box"
       v-wechat-title="this.title">
    <div class="custom-payment">
      <p class="pay-tips">您的曲谱定制已评估完成</p>
      <p class="pay-tips">需要支付定制费用</p>
      <p class="pay-tips pay-price">￥{{ price }}</p>
      <div class="topay-btn">
        <span>去支付</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '曲谱定制费用',
      price: 352
    }
  },
  created () {
    this.title = '曲谱定制费用'
  }
}
</script>

<style scoped>
.pay-box {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
  z-index: -11;
}
.custom-payment {
  margin-top: 30vw;
}
.pay-tips {
  line-height: 1.5em;
  padding: 0.5em;
  text-align: center;
  font-size: 15px;
}
.pay-price {
  color: red;
  font-size: 16px;
}
.topay-btn {
  box-sizing: border-box;
  margin-top: 25vw;
  text-align: center;
}
.topay-btn > span {
  width: 40%;
  background: #5cb2ea;
  color: #fff;
  padding: 1em 4em;
  border-radius: 5px;
}
</style>
