<template>
  <div class="personal">
    <div class="top-box">
      <div class="top-bg">
        <img src="../../assets/images/personal/personal_bg.png"
             alt="">
      </div>
      <div class="personal-tit">
        {{nickName}}
      </div>
      <div class="my-portraitt">
        <img :src="userPic"
             alt="">
      </div>
    </div>
    <!-- 列表 -->
    <ul class="my-plate">
      <router-link to="/orderList"
                   class="plate-item"
                   tag="li">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myOrder.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>琴侣订单</span>
        </div>
        <i class="open-icon"></i>
      </router-link>
      <router-link to="/songOrders"
                   class="plate-item"
                   tag="li">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myOrder.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>曲谱订单</span>
        </div>
        <i class="open-icon"></i>
      </router-link>
      <router-link to="/songOrderList"
                   class="plate-item"
                   tag="li">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myOrder.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>定制订单</span>
        </div>
        <i class="open-icon"></i>
      </router-link>
      <router-link to="/wallet"
                   class="plate-item"
                   tag="li">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myWallet.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>我的钱包</span>
        </div>
        <i class="open-icon"></i>
      </router-link>
      <router-link to="/friends"
                   class="plate-item"
                   tag="li">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myFriends.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>好友列表</span>
        </div>
        <i class="open-icon"></i>
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
        <i class="open-icon"></i>
      </router-link>
      <li class="plate-item" @click="toMyIntegral">
        <div class="plate-icon">
          <img src="../../assets/images/personal/myIntegral.png"
               alt="">
        </div>
        <div class="plate-name">
          <span>我的积分</span>
        </div>
        <i class="open-icon"></i>
      </li>
    </ul>
    <!-- 脚部 -->
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
      userPic: '',
      nickName: ''
    }
  },
  created () {
    var userinfoStr = localStorage.getItem('userinfo')
    if (userinfoStr) {
      var userInfo = JSON.parse(userinfoStr)
      this.userPic = userInfo.pic
      this.nickName = userInfo.nickName
    }
  },
  methods: {
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
}
.top-bg {
  width: 100%;
  height: 12.5rem;
  overflow: hidden;
}
.top-bg > img {
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
  margin-top: 2.5rem;
  margin-bottom: 8em;
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
.plate-icon {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
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
  font-size: 14px;
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
</style>
