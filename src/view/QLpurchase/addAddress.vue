<template>
  <div class="add-address"
       v-wechat-title="this.title">
    <div class="form-item">
      <label class="form-item-txt">收&nbsp;货&nbsp;人</label>
      <input type="text"
             class=""
             placeholder="姓名"
             v-model="receiver">
    </div>
    <div class="form-item">
      <label class="form-item-txt">手机号码</label>
      <input type="number"
             class=""
             placeholder="11位手机号"
             v-model="mobile">
    </div>
    <div class="form-item">
      <label class="form-item-txt">所在地区</label>
      <!-- 省 -->
      <select id="province"
              prop="province"
              v-model="provinceId"
              @change="selectProvince"
              placeholder="请选择">
        <option v-for="province in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="province.areaId">{{province.areaName}}</option>
      </select>
      <!-- 市 -->
      <select id="city"
              prop="city"
              v-model="cityId"
              placeholder="请选择"
              @change="selectCity">
        <option v-for="city in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="city.areaId">{{city.areaName}}</option>
      </select>
      <!-- 区 -->
      <select id="area"
              prop="area"
              v-model="areaId"
              placeholder="请选择">
        <option v-for="area in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId">{{area.areaName}}</option>
      </select>
      <!-- <i class="open-icon"></i> -->
    </div>
    <div class="form-item">
      <label class="form-item-txt">详细地址</label>
      <input type="text"
             class=""
             placeholder="如楼号/单位/门牌号"
             v-model="addr">
    </div>

    <!-- 按钮 -->
    <div class="conserve-btn"
         v-on:click="submitAddr">保存收货地址</div>
    <div class="deleted-btn"
         @click="deleteAddr">删除收货地址</div>
  </div>
</template>

<script>
import VDistpicker from 'v-distpicker'
export default {
  components: { VDistpicker },
  data () {
    return {
      title: '编辑收货地址',
      receiver: '', // 收货人
      mobile: '', // 手机号
      addr: '', // 详细地址
      addrId: this.$route.query.addrId, // 地址ID
      province: '',
      provinceId: null,
      city: '',
      cityId: null,
      area: '',
      areaId: null,
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  created () {
    this.title = '编辑收货地址'
    this.init()
  },
  methods: {
    /**
     * 进入页面时获取页面已有信息
     */
    init () {
      this.listAreaByParentId().then(({ data }) => {
        this.provinceList = data
      })
      console.log(this.provinceList)
      if (this.addrId) {
        this.$http({
          url: this.$http.adornUrl(`/p/address/addrInfo/${this.addrId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.addr = data.addr
          this.mobile = data.mobile
          this.receiver = data.receiver
          // 省市区
          this.provinceId = data.provinceId
          this.cityId = data.cityId
          this.areaId = data.areaId
          this.listAreaByParentId(data.provinceId).then(({ data }) => {
            this.cityList = data
          })
          this.listAreaByParentId(data.cityId).then(({ data }) => {
            this.areaList = data
          })
        })
      }
    },

    /**
     * 省市区三联
     */
    listAreaByParentId (pid) {
      if (!pid) pid = 0
      return this.$http({
        url: this.$http.adornUrl(`/p/area/listByPid`),
        method: 'get',
        params: this.$http.adornParams({ pid })
      })
    },
    /**
     * 选择省
     */
    selectProvince () {
      console.log(this.provinceId)
      // 将市和区的值清除
      this.cityId = null
      this.city = ''
      this.areaId = null
      this.area = ''
      // 获取城市的select
      this.listAreaByParentId(this.provinceId).then(({ data }) => {
        this.cityList = data
      })
    },
    /**
     * 选择市
     */
    selectCity () {
      // 将区域的值清除
      this.areaId = null
      this.area = ''
      // 获取区域的select
      this.listAreaByParentId(this.cityId).then(({ data }) => {
        console.log(this.cityId)
        this.areaList = data
        console.log(this.areaId)
      })
    },

    /**
     * 新增&修改地址
     */
    submitAddr () {
      // 判断input的值
      if (this.receiver.length < 2) {
        this.$toast('请输入正确的收货人')
        return
      } else if (this.mobile.length != 11) {
        this.$toast('请输入正确的手机号码')
        return
      } else if (this.addr.length < 1) {
        this.$toast('请输入详细收货地址')
        return
      }
      if (this.provinceId < 1) {
        this.$toast('请选择省份')
        return
      } else if (this.cityId < 1) {
        this.$toast('请选择城市')
        return
      }
      // 提示弹框
      this.$toast.loading({
        mask: true,
        message: '加载中...'
      })
      /**
       * 保存省市区名字
       */
      for (let i = 0; i < this.provinceList.length; i++) {
        if (this.provinceList[i].areaId === this.provinceId) {
          // 将省名字保存起来
          this.province = this.provinceList[i].areaName
        }
      }
      for (let i = 0; i < this.cityList.length; i++) {
        if (this.cityList[i].areaId === this.cityId) {
          // 将市名字保存起来
          this.city = this.cityList[i].areaName
        }
      }
      for (let i = 0; i < this.areaList.length; i++) {
        if (this.areaList[i].areaId === this.areaId) {
          // 将市名字保存起来
          this.area = this.areaList[i].areaName
        }
      }

      /**
       * 请求接口
       */
      this.$http({
        url: this.$http.adornUrl(this.addrId ? '/p/address/updateAddr' : '/p/address/addAddr'),
        method: this.addrId ? 'put' : 'post',
        data: this.$http.adornData({
          addr: this.addr,
          addrId: this.addrId || undefined,
          area: this.area,
          areaId: this.areaId,
          city: this.city,
          cityId: this.cityId,
          mobile: this.mobile,
          province: this.province,
          provinceId: this.provinceId,
          receiver: this.receiver
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.$router.go(-1)
      })
    },

    /**
     * 删除
     */
    deleteAddr () {
      this.$toast('删除地址成功')
      this.$http({
        url: this.$http.adornUrl(`/p/address/deleteAddr//${this.addrId}`),
        method: 'delete',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.$toast.clear()
        this.$router.go(-1)
      })
    }
  }
}

</script>

<style scoped>
input {
  font-size: 14px;
}
.add-address {
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 0 1em;
  padding-top: 1em;
}
.form-item {
  position: relative;
  height: 3.5em;
  line-height: 3.5em;
  border-bottom: 1px solid #f3f3f3;
  text-align: left;
  background: #fff;
}
.form-item select {
  width: 20.8vw;
  height: 95%;
  overflow: hidden;
  /* border: none; */
  border: #f1f1f1;

  outline: none;
}
.form-item-txt {
  padding-right: 2em;
  font-size: 14px;
}
.form-item > input {
  width: 70%;
  border: none;
  outline: none;
  height: 90%;
}
.open-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1em;
  display: inline-block;
  width: 0.6em;
  height: 1em;
  background: url("../../assets/images/icon/open-icon.png") no-repeat;
  background-size: 0.6em 1em;
}
.conserve-btn,
.deleted-btn {
  display: block;
  margin: 0 auto;
  width: 50vw;
  height: 2.3em;
  line-height: 2.3em;
  border-radius: 20px;
  border: 1px solid #e61900;
  font-size: 14px;
}
.conserve-btn {
  margin-top: 7rem;
  color: #fff;
  background: #e61900;
  border: 1px solid #e61900;
}
.deleted-btn {
  margin-top: 2em;
  color: #e61900;
  background: transparent;
}
</style>
