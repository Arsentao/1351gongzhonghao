<template>
  <div class="pay-result" v-wechat-title="this.title">
    <div class="pay-success">
      <i class="success-icon"></i>
      <p>支付成功！</p>
      <div class="to-orders" @click="toOrders">查看订单</div>
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
  },
  methods:{
    toOrders(){
      this.$router.replace("/index");
      this.$router.push("/orderList");
    }
  }
}

</script>

<style scoped>
.pay-success {
  display: inline-block;
  width: 100%;
  text-align: center;
  position: relative;
  top: 50vw;
}
.success-icon {
  display: inline-block;
  width: 3rem;
  height: 3rem;
  background: url("../assets/images/icon/paySuccess_green.png");
  background-size: 3rem 3rem;
}
.pay-success > p {
  box-sizing: border-box;
  padding-top: 1em;
  padding-left: 3%;
  font-size: 15px;
  text-align: center;
}
.to-orders{
  width:80px;
  height:35px;
  line-height: 35px;
  font-size: 14px;
  border:1px solid #333;
  border-radius: 3px;
  left:0;
  right:0;
  position: absolute;
  margin:auto;
  margin-top:20px;
}
</style>
