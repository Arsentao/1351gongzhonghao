<template>
  <div class="goodsDetails"
       v-wechat-title="this.title">


  
      <div class="swiper">
        <van-swipe  class="van-swiper" indicator-color="red" :autoplay="10000">
          <van-swipe-item v-for="(image, index) in imgMap"
                          :key="index">
            <img v-lazy="image" width="200px" height="200px">
          </van-swipe-item>
        </van-swipe>
      </div>


      <div class="cnt-box">
        <p class="cnt-tit">{{ prodName }}</p>
      </div>
     

          <div class="plate-box">
            <div class="choose-plate"
                 v-for="(item,index) of skuGroup"
                 :key="index">
              <div class="plate-tit">选择{{index}}</div>
              <div class="block-lst">
                <span v-on:click="toChooseItem(propsContain(allProperties,selectedPropObj,index,value,propKeys),index,value)"
                      :class="[arrayContain(selectedProp,value)?'active':'', propsContain(allProperties,selectedPropObj,index,value,propKeys)?'':'gray']"
                      v-for="(value,idx) of item"
                      :key="idx">{{value}}</span>
              </div>
            </div>
          </div>

          
            <div class="det-quant clearfix">
            <div class="plate-tit">选择数量</div>
            <v-counter :min="1"
                       :max="100"
                       :number="prodNum"
                       class="v-count"
                       @onNumChange="onNumChange"></v-counter>
          </div>


           <div class="leave-msg">
      买家留言：<input type="text"
             v-model="remarks" @blur="msg()">
    </div>
     
     <div class="leave-msg">
      推荐人1电话：<input type="text" 
             v-model="phone1" @blur="msg()">
    </div>
   
     <div class="leave-msg">
      推荐人2电话：<input type="text"
             v-model="phone2" @blur="msg()">
    </div>


    <!-- <div class="cnt-price"><span class = "price-show">单价</span> ￥{{ defaultSku?defaultSku.price.toFixed(2):price }}&nbsp;&nbsp;&nbsp;&nbsp;
      <span class = "price-show">总价</span> ￥{{totalprice}}</div> 
    <div class="details-con"
         v-html="content"></div>
 -->


    <det-foot :totalCartNum="totalCartNum"></det-foot>
  </div>
</template>

<script>
import Vue from 'vue'
import topHead from '../../components/header'
import DetFoot from '../../components/detailsFooter'
import VCounter from '../../components/counter'
import { Swipe, SwipeItem } from 'vant'
Vue.use(Swipe).use(SwipeItem)
export default {
  components: {
    topHead,
    DetFoot,
    VCounter
  },
  data () {
    return {
      remarks: '',
      phone1: '',
      phone2: '',
      prodId: this.$route.params.prodId,
      imgMap: [],
      shopId: 1,
      shopName: null,
      prodName: '',
      price: 0,
      content: '',
      oriPrice: 0,
      totalStocks: 0,
      brief: '',
      pic: '',
      categoryId: null,
      totalCartNum: 0,
      prodNum: 1,

      // sku相关变量
      skuShow: false,
      skuList: [],
      skuGroup: {},
      defaultSku: undefined,
      selectedProp: [],
      selectedPropObj: {},
      propKeys: [],
      allProperties: []
      // sku相关变量 end
    }
  },

 computed:{
   totalprice(){
     return (this.prodNum * this.defaultSku.price).toFixed(2)
   }
  },


  created () {
    this.$toast.loading({
      forbidClick: true,
      duration: 0
    })
    this.title = '琴侣 —— 商品详情'

    this.$http({
      url: this.$http.adornUrl('/prod/prodInfo'),
      method: 'get',
      params: this.$http.adornParams({
        prodId: this.prodId
      })
    }).then(({ data }) => {
      this.$toast.clear()
      this.imgMap = data.imgs.split(',')
      this.prodName = data.prodName
      this.price = data.price
      this.pic = data.pic
      this.brief = data.brief
      this.content = data.content.replace(
        /style="/g,
        'style="max-width:100% !important;'
      )
      this.content = this.content.replace(
        /<img/gi,
        '<img style="max-width:100% !important;margin:0;display:flex;" '
      )
      this.skuList = data.skuList
      // 组装sku
      this.groupSkuProp()
    })

    // 获取购物车数量
    this.getCartTotalCount()
  },

  methods: {

      msg(){
    console.log('触发')
    document.body.scrollTop = 0
   
  },


    // 根据sku的属性 分组
    groupSkuProp: function () {
      var skuList = this.skuList
      if (skuList.length == 1 && skuList[0].properties == '') {
        this.defaultSku = skuList[0]
        return
      }
      var skuGroup = {}
      var allProperties = []
      var propKeys = []
      for (var i = 0; i < skuList.length; i++) {
        var defaultSku = this.defaultSku
        var isDefault = false
        if (!defaultSku && skuList[i].price == this.price) {
          // 找到和商品价格一样的那个SKU，作为默认选中的SKU
          defaultSku = skuList[i]
          isDefault = true
          this.defaultSku = defaultSku
        }
        var properties = skuList[i].properties // 版本:公开版;颜色:金色;内存:64GB
        allProperties.push(properties)
        var propList = properties.split(';') // ["版本:公开版","颜色:金色","内存:64GB"]

        var selectedPropObj = this.selectedPropObj
        for (var j = 0; j < propList.length; j++) {
          var propval = propList[j].split(':') // ["版本","公开版"]
          var props = skuGroup[propval[0]] // 先取出 版本对应的值数组

          // 如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
          if (isDefault) {
            propKeys.push(propval[0])
            selectedPropObj[propval[0]] = propval[1]
          }

          if (props == undefined) {
            props = [] // 假设还没有版本，新建个新的空数组
            props.push(propval[1]) // 把 "公开版" 放进空数组
          } else {
            if (!this.arrayContain(props, propval[1])) {
              // 如果数组里面没有"公开版"
              props.push(propval[1]) // 把 "公开版" 放进数组
            }
          }
          skuGroup[propval[0]] = props // 最后把数据 放回版本对应的值
        }
        this.selectedPropObj = selectedPropObj
        this.propKeys = propKeys
      }
      this.parseSelectedObjToVals()
      this.skuGroup = skuGroup
      this.allProperties = allProperties
    },

    // 将已选的 {key:val,key2:val2}转换成 [val,val2]
    parseSelectedObjToVals: function () {
      var selectedPropObj = this.selectedPropObj
      var selectedProperties = ''
      var selectedProp = []
      for (var key in selectedPropObj) {
        selectedProp.push(selectedPropObj[key])
        selectedProperties += key + ':' + selectedPropObj[key] + ';'
      }
      selectedProperties = selectedProperties.substring(
        0,
        selectedProperties.length - 1
      )
      // console.log(selectedProperties);
      this.selectedProp = selectedProp

      for (var i = 0; i < this.skuList.length; i++) {
        if (this.skuList[i].properties == selectedProperties) {
          this.defaultSku = this.skuList[i]
          break
        }
      }
    },

    // 点击选择规格
    toChooseItem: function (ok, key, val) {
      if (!ok) {
        return
      }
      // var val = e.currentTarget.dataset.val;
      // var key = e.currentTarget.dataset.key;
      var selectedPropObj = this.selectedPropObj
      selectedPropObj[key] = val
      this.selectedPropObj = selectedPropObj

      this.parseSelectedObjToVals()
    },

    // 判断数组是否包含某对象
    arrayContain: function (array, obj) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == obj)
        // 如果要求数据类型也一致，这里可使用恒等号===
        { return true }
      }
      return false
    },

    // 判断当前的规格值 是否可以选，即其他
    propsContain: function (
      allProperties,
      selectedPropObj,
      key,
      item,
      propKeys
    ) {
      var _selectedPropObj = JSON.parse(JSON.stringify(selectedPropObj)) // 对象直接用=号会有问题
      var properties = ''
      _selectedPropObj[key] = item
      for (var j = 0; j < propKeys.length; j++) {
        properties += propKeys[j] + ':' + _selectedPropObj[propKeys[j]] + ';'
      }
      properties = properties.substring(0, properties.length - 1)
      var find = false
      for (var i = 0; i < allProperties.length; i++) {
        if (properties == allProperties[i]) {
          find = true
          break
        }
      }

      return find
    },

    onSkuShow () {
      this.skuShow = !this.skuShow
    },

    // counter组件回调函数
    onNumChange (_count) {
      this.prodNum = this.prodNum + _count
    },

    /**
     * 加入购物车
     */
    addToCart () {
      this.$toast.loading({
        mask: true
      })
      this.$http({
        url: this.$http.adornUrl('/p/shopCart/changeItem'),
        method: 'POST',
        data: this.$http.adornData({
          basketId: 0,
          count: this.prodNum,
          prodId: this.prodId,
          shopId: 1,
          skuId: this.defaultSku.skuId
        })
      }).then(({ data }) => {
        this.totalCartNum = this.totalCartNum + this.prodNum
        this.$toast.clear()
        this.$toast('加入购物车成功')
        this.skuShow = false
      })
    },

    /**
     * 立即购买
     */
    buyNow () {
      sessionStorage.setItem('orderItem', JSON.stringify({
        prodId: this.prodId,
        skuId: this.defaultSku.skuId,
        prodCount: this.prodNum,
        shopId: 1
      }))
      // 跳转到填写订单页面
      sessionStorage.setItem('orderEntry', 1)
      sessionStorage.setItem('remarks', this.remarks)
      sessionStorage.setItem('phone1', this.phone1)
      sessionStorage.setItem('phone2', this.phone2)
      this.$router.push('/order')
    },

    /**
     * 获取购物车数量
     */
    getCartTotalCount () {
      this.$http({
        url: this.$http.adornUrl('/p/shopCart/prodCount'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.totalCartNum = data
      })
    }
  },


}
</script>

<style scoped>
.goodsDetails {
  background: #fff;
}
.top-show {
  width: 100%;
  height: auto;
}
.swiper {
  margin-top: 5%;
  width: 100%;
  max-height: 100vw;
  overflow: hidden;
  box-shadow: 0px 1px 1px #f9f9f9;
}

.img-box {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.img-box > img {
  width: 100%;
}
.cnt-box {
  margin: 1em 1.5em;

}
.cnt-tit {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.cnt-brief {
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 20px;
  color: #999;
  font-size: 14px;
  margin-top: 3px;
}

/* swiper */
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.swiper-slide > img {
  width: 100%;
}
.swiper-pagination
  > span.swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #d93949 !important;
}
/* swiper */

/* 规格选择 */
.choosed-msg {
  display: block;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 5em;
  line-height: 4em;
  text-align: left;
  padding-left: 1.5em;
  border-top: 0.5em solid #f3f3f3;
  border-bottom: 0.5em solid #f3f3f3;
}
.sel {
  color: #b9b9b9;
  padding-right: 1em;
}
.selected {
  display: inline;
  font-size: 14px;
  font-weight: bold;
}
.ellipsis {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1em;
  display: block;
  width: 1.5em;
  height: 1.5em;
  background: url("../../assets/images/icon/ellipsis.png");
  background-size: 1.5em 1.5em;
}

/* 规格选择弹框 */
/* .specs-select-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
} */
.specs-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.specs-main {
  /* position: absolute; */
  z-index: 1000;
  bottom: 0;
  width: 100%;
  /* min-height: 375px;
  max-height: 475px; */
  background-color: #fff;
    border-top: 1px solid #f3f3f3;
  border-bottom: 1px solid #f3f3f3;
}
.seat-box {
  position: relative;
}
.seat-box .close-icon {
  position: absolute;
  right: 0;
  top: 1em;
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  background: url("../../assets/images/icon/close-icon.png") no-repeat;
  background-size: 1.5em 1.5em;
}
.top-msg {
  position: relative;
  height: 22vw;
  background: #fff;
}
.top-msg-img {
  position: absolute;
  top: -2em;
  left: 0.5em;
  width: 23vw;
  height: 23vw;
  background: #fff;
  vertical-align: bottom;
}
.top-msg-img > img {
  width: 100%;
  height: 100%;
}
.top-msg-txt {
  text-align: left;
  padding-left: 30vw;
  padding-top: 1em;
}
.top-price {
  font-size: 13px;
  color: rgb(185, 0, 0);
}
.sub {
  font-style: normal;
  color: rgb(185, 0, 0);
  font-size: 12px;
}
.top-msg-txt > .buttom-txt {
  padding-top: 1.5em;
}
/* 规格板块 */
.choose-plate {
  text-align: left;
      display: flex;
    justify-content: flex-start;
    line-height: 5em;
}
.plate-box{
  margin: 0.5em 1.5em;
}
.plate-tit {
  color:black;
  padding-right: 0.5em;
  white-space: nowrap;
  font-size: 20px;
  font-size: bold;
}

.block-lst {
  padding:0;
}
.block-lst span {
  padding: 0.5em 2.5em;
  border-radius: 5px;
  margin-right: 10px;
  white-space: nowrap;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #02a1e9;
}
.block-lst .active {
  background: #02a1e9;
  border: 2px solid #02a1e9;
}


.silver{
color: silver;
}

.red{
color: red
}


.det-quant {
margin: 1.5em 1.5em;
text-align: left;

}
.inline {
text-align: left;
height: auto;
}
.det-quant .plate-tit{
 display: inline-block
}
.cnt-price {
  text-align: left;
  color: rgb(185, 0, 0);
  font-size: 18px;
  margin: 2em 1em;
}

.cnt-total {
  text-align: left;
  color: rgb(185, 0, 0);
  font-size: 16px;
  padding-left: 1.5em;
  padding-top: 1.5em;
  padding-bottom: 1em;
}
.v-count {
  display: inline-block;
  vertical-align: middle;
}
/* 详情图片 */
.details-con {
  width: 80%;
  height: 100%;
  padding-top: 1em;
  padding-left: 10%;
  font-size: 16px;
  color: rgba(20, 92, 187, 0.781);
}
.details-con img {
  width: 100vw !important;
}
img {
  max-width: 100vw !important;
}

/* 弹框脚部 */
button {
  background: transparent;
  border: none;
}
.select-box-foot {
  width: 100%;
  height: auto;
  color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
}
.shopping-car {
  width: 50%;
  padding: 1.2em;
  float: left;
  background-color: #564e5f;
}
.buynow {
  width: 50%;
  padding: 1.2em;
  float: left;
  background-color: #02a1e9;
}

.cnt-tip {
color:rgba(20, 92, 187, 0.781);
line-height: 2em;
font-size: 20px;
text-align: center;
}

.van-swiper {
margin-left: 10%;
margin-right: 10%;
}

.price-show{
padding: 2px;
color: white;
background-color: #d93949;
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
