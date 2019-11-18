<template>
    <div class="priceSearch">
  

  <div class="title">
      请选择想要购买的曲谱种类
  </div>


  <div class="radio">
    <van-radio-group v-model="radio">
  <van-cell-group>
    <van-cell clickable  @click="radio = '0'" size="large">
        <span class="cell">无指法谱</span></br>
        <button class="star">￥{{pricetotal[0]}}</button>
      <van-radio slot="right-icon" name="0" />
    </van-cell> 
    <van-cell clickable @click="radio = '1'" size="large">
         <span class="cell">常规指法谱</span></br>
         <button class="star">￥{{pricetotal[1]}}</button>
      <van-radio slot="right-icon" name="1" />
    </van-cell>
     <van-cell  size="large">
          <span class="cell">特殊手型指法谱(暂未开通)</span>
         <van-radio slot="right-icon" disabled/>
    </van-cell>
  </van-cell-group>
</van-radio-group>
  </div>

  <div class="submit">
      <van-button type="danger" @click="buy" class="buy">购买</van-button>
  </div>
  
  <div id="error">
  </div>




</div>
</template>
<script>
import Vue from 'vue'
export default {
title: '曲谱类型选择',

    data(){
        return{
        radio: "0",
        musicid: sessionStorage.getItem('musicid'),
        pricetotal: [sessionStorage.getItem('price'),sessionStorage.getItem('price1')]
       
        }
    },



methods: {
     buy () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/music/order/buy?type=' + this.radio),
        method: 'POST',
        data: this.musicid
      }).then(({ data }) => {
        this.$toast.clear()
        sessionStorage.setItem('orderNo', data.orderNo)
        sessionStorage.setItem('songTotal', this.pricetotal[this.radio])
        this.$router.push('/songPay')
      })
    },

}
}

</script>

<style scoped>
.cell {
font-size: 18px;
line-height: 200%;
font-weight: 600;
letter-spacing: 2px;
}

.title{
font-size: 25px;
margin-top: 15%;
font-weight: bold;
color:rgb(230, 62, 76);
}

.radio{
margin-top: 15%;
}

.submit {
margin-top: 20%;
}

.buy {
font-size: 22px;
text-align: center;
font-weight: bold;
letter-spacing: 5px;
padding-left: 15px;
padding-right: 10px;
}

.star {
color: red;
font-size: 13px;
border: 1px solid red;
border-radius: 10%;
background-color: white;
padding: 0 0.5em;
height: 1.5em;
line-height: 1.5em;
vertical-align: middle;
}
</style>

