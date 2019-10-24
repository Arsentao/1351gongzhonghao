<template>
  <div class="pay-success">
    <i class="success-icon"></i>
    <p>支付成功！</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
</style>
