<template>
  <div class="personal">
    <div class="top-box">
        <img src="https://fengpu1351-1300303301.file.myqcloud.com/%E5%A5%87%E5%A6%99%E5%AD%A6%E7%90%B4%E8%AE%B0/%E5%B0%8F%E5%8A%A8%E7%94%BB11-21.gif"
             alt="">
    </div>


    <ul class="my-plate">
      <li class="plate-item" @click="showOrder()">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myOrder.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>订单详情</span>
        </div>
   
      </li>


       <router-link to="/orderList"
                   class="plate-item"
                   tag="li" v-show="show1">
        <div class="plate-name">
          <span style="font-size:15px">琴侣订单</span>
        </div>
        
      </router-link>

       <router-link to="/songOrders"
                   class="plate-item"
                   tag="li" v-show="show2">
        <div class="plate-name">
          <span style="font-size:15px">曲谱订单</span>
        </div>
        
      </router-link>

      <router-link to="/songOrderList"
                   class="plate-item"
                   tag="li" v-show="show3">
        <div class="plate-name">
          <span style="font-size:15px">定制订单</span>
        </div>
     
      </router-link>


 
   
     
      <router-link to="/question"
                   class="plate-item"
                   tag="li">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myWallet.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>历史提问</span>
        </div>
       
      </router-link>




  
      <router-link to="/address"
                   class="plate-item"
                   tag="li">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myAdress.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>收货地址</span>
        </div>
     
      </router-link>
           </ul>

  <router-link to="/beStar"
                   tag="div"
                   class="camp">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myStar.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>网红营地</span>
        </div>
      </router-link>
 
    <foot-nav :navIndex="2"></foot-nav>
  </div>
</template>

<script>
import footNav from '../../components/footer'
export default {
  components: {
    footNav
  },
  data () {
    return {
      show1: false,
      show2: false,
      show3: false,
      userPic: '',
      nickName: '',
    }
  },
  created () {
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' });
    var userinfoStr = localStorage.getItem('userinfo')
    if (userinfoStr) {
      var userInfo = JSON.parse(userinfoStr)
      this.userPic = userInfo.pic
      this.nickName = userInfo.nickName
    }
  },
  methods: {
    showOrder(){
     this.show1 = !this.show1
     this.show2 = !this.show2
     this.show3 = !this.show3
    },
    toMyIntegral(){
      this.$toast("积分功能暂未开放~");
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
}
.personal {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
}
.top-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 25%;
}
.top-box img{
height: 100%;
width: 100%;
}
/* 头像 */
.my-portraitt {
  box-sizing: border-box;
  padding: 0.5em;
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 6.5rem;
  height: 6.5rem;
  background: #fff;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 1px 3px 1px #bdbdbd;
}
.my-portraitt > img {
  border-radius: 50%;
}
.personal-tit {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 4rem;
  text-align: center;
  font-size: 20px;
  color: #fff;
  letter-spacing: 2px;
  /* 溢出省略号 */
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.personal-tit > a {
  color: white;
  font-size: 20px;
}

/* 板块列表 */
img {
  width: 100%;
}
ul.my-plate {
  box-sizing: border-box;
  padding: 0 2em;
  color: black;
  background: url("../../assets/images/personal/mark1.png");
  background-size: 100% 200%;
}
li.plate-item:last-child {
  border-bottom: none;
}
li.plate-item {
  position: relative;
  box-sizing: border-box;
  padding: 1.3em 0;
  text-align: left;
  border-bottom: 1px solid #ececec;
}
li.plate-item-star{
  position: relative;
  box-sizing: border-box;
  padding: 1.3em 0;
  text-align: left;
  border-bottom: 1px solid #ececec;
  background-color: rgb(103, 214, 241)
}
.plate-icon {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  padding-right: 1em;
  overflow: hidden;
}
.star-icon {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  padding-right: 1em;
  overflow: hidden;
}
.plate-name {
  display: inline-block;
  max-width: 40%;
  overflow: hidden;
  padding-bottom: 0.1em;
}
.plate-name span {
  font-size: 18px;
  letter-spacing: 1px;
}

.plate-star {
  display: inline-block;
  max-width: 40%;
  overflow: hidden;
  padding-bottom: 0.1em;
}
.plate-star span {
  font-size: 25px;
  letter-spacing: 1px;
}


.open-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.open-icon {
  right: 0;
  display: inline-block;
  width: 0.5em;
  height: 0.9em;
  background: url("../../assets/images/personal/open-icon.png") no-repeat;
  background-size: 0.5em 0.9em;
}

.camp{
text-align: left;
padding-left: 2em;
width: 100%;
height: 50%;
background: url("../../assets/images/personal/mark2.png");
background-size: 100% 100%;
border-top: 1px solid #ececec;
padding-top: 1.3em;
}
</style>
