<template>
  <div class="payment-results">
    <div class="pay-result">
      <p class="fail">支付失败</p>
      <p class="tips">请在<em>30分钟</em>内完成付款
        <br />否则订单会被系统取消</p>
      <div class="btn-box">
        <input class="look-btn"
               type="button"
               value="查看订单">
        <input class="anew-btn"
               type="button"
               value="重新支付">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '支付结果'
    }
  },
  created () {
    this.title = '支付结果'
  }
}
</script>

<style scoped>
.payment-results {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -100;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.pay-result {
  width: 100%;
  height: auto;
  margin-top: 25vw;
}
.fail {
  color: rgb(185, 0, 0);
  font-size: 20px;
  padding: 1em 0;
}
.tips {
  font-size: 13px;
  color: rgb(105, 105, 105);
  line-height: 1.5em;
  letter-spacing: 1px;
  text-align: center;
}
.tips em {
  font-style: normal;
  color: rgb(185, 0, 0);
}
.btn-box {
  margin-top: 1.5em;
}
.btn-box input {
  padding: 1em 1.5em;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}
.btn-box .look-btn {
  color: #fff;
  background: #59bb73;
  margin-right: 1em;
  border: 1px solid #59bb73;
}
.btn-box .anew-btn {
  background: transparent;
  color: #f3ae58;
  border: 1px solid #f3ae58;
}
</style>
