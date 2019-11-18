<template>
  <div class="explain-wrap"
       v-wechat-title="this.title">
    <ul class="explain">
      <li v-for="(item,index) of explain"
          :key="index">
        <h3 class="explain-tit">{{ item.title }}</h3>
        <p class="explain-txt">{{ item.text }}</p>
      </li>
    </ul>
    <!-- 费用支付 -->
    <div class="cost-pay">
      <p class="cost">
        本次评估费用&nbsp;
        <span class="cost-num">
          <i class="sub">￥</i>{{assessmentFee.toFixed(2)}}</span>
      </p>
      <!-- 按钮 -->
      <input type="submit"
             value="支付评估费"
             class="conserve-btn"
             @click="toPay()">
    </div>
    <!-- 脚部 -->
    <foot-nav></foot-nav>
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
      assessmentFee: 0,
      explain: [
        {
          title: '定制须知：',
          text: '新用户第一次上传免评估费，上传1次文件免费评估后没有产生有效订单则取消免费评估资格，产生一次有效订单（定制付款成功）后免收评估费用。'
        },
        {
          title: '定制流程：',
          text: '支付评估费 => 上传文件、图片、音频 => 平台评估费用 => 用户支付定制费用 => 填写收货琴侣ID => 等待制作完成'
        }
      ]
    }
  },
  created () {
    this.title = '曲谱定制'
    this.queryCosts()
    this.checkNoPayOrder()
  },
  methods: {
    /**
     * 获取评估价格
     */
    queryCosts () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/musicCustomized/assessmentFee'),
        method: 'GET',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.$toast.clear();
        this.assessmentFee = data
      })
    },

    /**
     * 去支付
     */
    toPay () {
      sessionStorage.setItem('customFeeType', 1);
      sessionStorage.setItem('assessmentType', 1);
      sessionStorage.setItem('assessmentFee', this.assessmentFee)
      this.$router.push('/customPayment')
    },

    /**
     * 查询是否有未支付定制费订单
     */
    checkNoPayOrder(){
      this.$http({
        url: this.$http.adornUrl('/p/musicCustomized/list'),
        method: 'GET',
        params: this.$http.adornParams({
          status: 3,
          current:1,
          size: 1
        })
      }).then(({ data }) => {
        if(data.total > 0){
          this.$dialog.alert({
            message: '您当前有未支付订单' + "\n" + '请支付后再操作'
          }).then(() => {
            this.$router.replace("/index");
            this.$router.push('/songOrderList')
          });
        }
      })
    }

  }
}
</script>
<style scoped>
/* 固定背景 */
.explain-wrap {
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  z-index: -99;
  overflow: auto;
}
/* 文字 */
ul.explain {
  box-sizing: border-box;
  text-align: left;
}
ul.explain > li {
  box-sizing: border-box;
  padding: 0 1em;
  background: #fff;
  margin-bottom: 1em;
}
.explain-tit {
  font-size: 16px;
  font-weight: normal;
  color: #df1c02;
  padding: 0.8em 0;
  border-bottom: 1px solid #f2f2f2;
}
.explain-txt {
  line-height: 2em;
  padding: 1em 0;
  font-size: 14px;
  letter-spacing: 1px;
}
/* 支付费用 */
.cost-pay {
  margin-top: 15vw;
  margin-bottom: 20vw;
}
.cost {
  font-size: 14px;
}
.cost-num {
  font-size: 22px;
  color: #df1c02;
}
.sub {
  font-style: normal;
  font-size: 12px;
  font-weight: normal;
  color: #df1c02;
}
/* 按钮 */
.conserve-btn {
  margin-top: 2em;
  width: 56vw;
  height: 3.5em;
  line-height: 3.5em;
  color: #fff;
  border: none;
  background: url("../../assets/images/icon/btn-bright.png") no-repeat left top;
  background-size: 56vw 3.7em;
  outline: none;
  font-size: 14px;
}
</style>
