<template>
  <div class="goodsDetails"
       v-wechat-title="this.title">
    <!-- 上 -->
    <div class="top-show">
      <!-- 商品轮播图 -->
      <div class="swiper">
        <van-swipe :autoplay="3000"
                   indicator-color="red">
          <van-swipe-item v-for="(image, index) in imgMap"
                          :key="index">
            <img :src="image">
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- /商品轮播图 -->

      <!-- 题目 -->
      <div class="cnt-box">
        <p class="cnt-tit">{{ prodName }}</p>
        <p class="cnt-brief">{{ brief }}</p>
        <p class="cnt-price">￥{{ defaultSku?defaultSku.price:price }}</p>
      </div>
      <!-- /题目 -->

      <!-- 规格选择 -->
      <div class="specs-choose"
           v-on:click="onSkuShow">
        <div class="choosed-msg">
          <span class="sel">已选</span>
          <p class="selected">{{selectedProp.length>0?selectedProp+'，':''}}{{prodNum}}件</p>
          <i class="ellipsis"></i>
        </div>
      </div>
      <!-- /规格选择 -->

      <!-- 选择弹框start -->
      <div class="specs-select-box clearfix"
           v-if="skuShow">
        <div class="specs-bg"
             v-on:click="onSkuShow"></div>
        <div class="specs-main">
          <!-- top -->
          <div class="seat-box">
            <div class="top-msg">
              <!-- 图片 -->
              <div class="top-msg-img">
                <img :src="defaultSku.pic?defaultSku.pic:pic"
                     alt>
              </div>
              <!-- 文字 -->
              <div class="top-msg-txt">
                <p class="top-price">
                  <i class="sub">￥</i>
                  {{defaultSku?defaultSku.price:price}}
                  <!-- <i class="sub">.00</i> -->
                </p>
                <div class="buttom-txt">
                  <span class="sel">已选</span>
                  <p class="selected">{{selectedProp.length>0?selectedProp+'，':''}}{{prodNum}}件</p>
                </div>
              </div>
            </div>
            <i class="close-icon"
               v-on:click="onSkuShow"></i>
          </div>
          <!-- 规格板块 -->
          <div class="plate-box">
            <div class="choose-plate"
                 v-for="(item,index) of skuGroup"
                 :key="index">
              <p class="plate-tit">{{index}}</p>
              <div class="block-lst">
                <span v-on:click="toChooseItem(propsContain(allProperties,selectedPropObj,index,value,propKeys),index,value)"
                      :class="[arrayContain(selectedProp,value)?'active':'', propsContain(allProperties,selectedPropObj,index,value,propKeys)?'':'gray']"
                      v-for="(value,idx) of item"
                      :key="idx">{{value}}</span>
                <!-- <span>樟木</span>
                <span class="lst-current">桉木</span>-->
              </div>
            </div>
          </div>
          <!-- 数量 +/- -->
          <div class="det-quant clearfix">
            <v-counter :min="1"
                       :max="100"
                       :number="prodNum"
                       class="v-count"
                       @onNumChange="onNumChange"></v-counter>

          </div>

          <!-- 弹框脚部 -->
          <div class="select-box-foot clearfix">
            <button class="shopping-car"
                    @click="addToCart">加入购物车</button>
            <button class="buynow"
                    @click="buyNow">立即购买</button>
          </div>
        </div>
      </div>
      <!-- 选择弹框end -->
    </div>
    <!-- /上 -->

    <!-- 图文详情 -->
    <div class="details-con"
         v-html="content"></div>
    <!-- /图文详情 -->

    <!-- 脚部 -->
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
  mounted () { },
  methods: {
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

  computed: {}
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
  width: 100%;
  max-height: 100vw;
  overflow: hidden;
  box-shadow: 0px 1px 1px #f9f9f9;
}
.swiper img {
  width: 100%;
  height: 100%;
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
  margin: 0 1.5em;
  margin-top: 1em;
}
.cnt-tit {
  text-align: justify;
  line-height: 2em;
  font-size: 16px;
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
.cnt-price {
  text-align: left;
  padding: 1em 0;
  color: rgb(185, 0, 0);
  font-size: 16px;
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
.specs-select-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.specs-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.specs-main {
  position: absolute;
  z-index: 1000;
  bottom: 0;
  width: calc(100% - 2em);
  min-height: 375px;
  max-height: 475px;
  background-color: #fff;
  padding: 0 1em;
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
  margin-bottom: 1.5em;
}
.plate-tit {
  color: #c4c4c4;
}
.block-lst {
  padding: 1em 0;
}
.block-lst span {
  padding: 0.5em 1em;
  border-radius: 5px;
  background: rgb(235, 235, 235);
  color: #000;
  margin-right: 10px;
}
.block-lst .active {
  background: #b90000;
  color: #fff;
}
.block-lst .gray {
  background-color: #f9f9f9;
  color: #ddd;
}
.det-quant {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: auto;
  padding-right: 1em;
  margin: 5vw 0 10vw 0;
}
.v-count {
  float: right;
}
/* 详情图片 */
.details-con {
  width: 100vw;
  height: 100%;
  padding: 2em 0;
  max-width: 100vw;
  font-size: 14px;
  text-align: left;
}

.details-con p{
text-align: left;
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
</style>
