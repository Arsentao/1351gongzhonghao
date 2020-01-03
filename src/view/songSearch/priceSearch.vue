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


 <div class="recommand">
        <div class="leave-msg">
      推荐人1电话：<input type="text" 
             v-model="phone1" @blur="msg()">
    </div>
   
     <div class="leave-msg">
      推荐人2电话：<input type="text"
             v-model="phone2" @blur="msg()">
    </div>
 </div>
  <div class="submit">
      <van-button type="danger" @click="buy" class="buy">购买</van-button>
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
        pricetotal: [sessionStorage.getItem('price'),sessionStorage.getItem('price1')],
        phone1: "",
        phone2: ""
        }
    },



methods: {
  msg(){
    document.body.scrollTop = 0
    console.log('触发')
  },
     buy () {
         if (this.phone1.length != 11 && this.phone1.length != 0) {
        this.$toast('请输入正确的电话号码')
        return
      }
    
         else if (this.phone2.length != 11 && this.phone2.length != 0) {
        this.$toast('请输入正确的电话号码')
        return
      }
        else if (this.phone1 == this.phone2 && this.phone1.length != 0) {
        this.$toast('两个推荐人电话不能一致')
        return
      }
      else{
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/music/order/buy?type=' + this.radio),
        method: 'POST',
         data: this.$http.adornData({
            musicId: this.musicid,
            phone1: this.phone1,
            phone2: this.phone2, 
        })
      }).then(({ data }) => {
        this.$toast.clear()
        sessionStorage.setItem('orderNo', data.orderNo)
        sessionStorage.setItem('songTotal', this.pricetotal[this.radio])
        this.$router.push('/songPay')
      })
      }
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

.leave-msg {
font-size: 15px;
padding: 0.5em 1em;
border-bottom: 1px solid #f3f3f3;
text-align: left;
line-height: 30px;
}
.leave-msg > input {
border: none;
outline: none;
}

</style>

