<template>
  <div class="myOrders">
    <van-cell-group>
        <van-cell value="琴侣订单" is-link to="orderList"  size="large"/>
        <van-cell value="曲谱订单" is-link to="songOrders"  size="large"/>
        <van-cell value="定制订单" is-link to="songOrderList"  size="large"/>
    </van-cell-group>
 <foot-nav></foot-nav>
  </div>
</template>

<script>
import footNav from '../../components/footer'
export default {
 components: {
    footNav
  },
}
</script>

<style>

</style>