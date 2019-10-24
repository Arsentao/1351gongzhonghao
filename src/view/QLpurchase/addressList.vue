<template>
  <div>
    <div class="address-wrap"
         v-wechat-title="this.title">
      <ul class="addres-list">
        <li class="addrees-item"
            v-for="(item,index) of addressList"
            :key="index">
          <div class="addr-msg"
               @click="selAddrToOrder(item.addrId)">
            <p class="addr-user">
              <span>{{ item.receiver}}</span>
              <span>{{ item.mobile }}</span>
            </p>
            <p class="addr-txt">{{ item.province + item.city + item.area + item.addr }}</p>
            <!-- 修改地址icon -->
            <a class="edit-icon"
               v-on:click.stop="toAddAddr(item.addrId)"></a>
          </div>
          <!-- 设置默认 -->
          <div class="addr-default">
            <i class="def-icon"
               :class="{ 'def-icon-select': selDefaultIndex === index }"
               @click="defaultAddr(index)"></i>
            <span>设置为默认地址</span>
          </div>
        </li>
        <li class="empty"
            v-if="addressList.length==0">您还未添加收货地址哦~</li>
      </ul>
    </div>

    <!-- 新增收货地址按钮 -->
    <div class="add-addr">
      <a href="/addAddr"
         class="add-addr-btn">新增收货地址</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '收货地址',
      addressList: [],
      selDefaultIndex: null,
      type: this.$route.query.type
    }
  },
  created () {
    this.title = '收货地址'
    this.$http({
      url: this.$http.adornUrl('/p/address/list'),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({ data }) => {
      this.addressList = data
      const index = data.findIndex(e => e.commonAddr === 1)
      // const index = data.commonAddr === 1
      if (index > -1) this.selDefaultIndex = index
    })
  },
  methods: {
    // 设置默认
    defaultAddr (selIndex) {
      const info = this.addressList[selIndex]
      // debugger
      this.$http({
        url: this.$http.adornUrl('/p/address/defaultAddr/' + info.addrId),
        method: 'PUT'
      }).then(({ data }) => {
        this.addressList[this.selDefaultIndex].commonAddr = 0
        info.commonAddr = 1
        // 成功
        this.selDefaultIndex = selIndex
      }).catch(() => {
        this.$toast('选择默认地址失败')
      })
    },

    // 选择地址返回订单
    selAddrToOrder (addrId) {
      if (this.type && this.type == 'order') {
        this.$router.push('/order?addrId=' + addrId)
      }
    },

    toAddAddr (addrId) {
      this.$router.push('/addAddr?addrId=' + addrId)
    }
  }
}
</script>
<style scoped>
.address-wrap {
  display: block;
  background: #f2f2f2;
}
ul.addres-list {
  width: 100%;
  margin-bottom: 5rem;
}
/* 地址item */
li.addrees-item {
  background: #fff;
  border-bottom: 1em solid #f2f2f2;
}
.addr-msg {
  position: relative;
  box-sizing: border-box;
  padding: 1em;
  line-height: 2em;
  text-align: left;
  border-bottom: 1px solid #f4f4f4;
}
.addr-user,
.addr-txt {
  line-height: 2em;
  max-width: 20rem;
  font-size: 14px;
  /* 文字溢出省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.addr-user {
  font-size: 14px;
}
.addr-user span {
  padding-right: 1em;
}
.addr-txt {
  color: #888;
}
.edit-icon {
  position: absolute;
  top: 1em;
  right: 1em;
  display: inline-block;
  width: 1em;
  height: 1em;
  background: url("../../assets/images/icon/edit-icon.png") no-repeat;
  background-size: 1em 1em;
}
/* 设置默认 */
.addr-default {
  position: relative;
  height: 3.5em;
  line-height: 3.5em;
  text-align: left;
  padding-left: 1em;
}
.addr-default > span {
  font-size: 14px;
  padding-left: 2em;
}
i.def-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
  background: url("../../assets/images/icon/choose-round.png") no-repeat;
  background-size: 1.3em 1.3em;
}
/* 默认地址选中后图标 */
i.def-icon-select {
  background: url("../../assets/images/icon/choosed-red.png") no-repeat;
  background-size: 1.3em 1.3em;
}
.add-addr {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: auto;
}
.add-addr-btn {
  display: block;
  height: 3em;
  line-height: 3em;
  font-size: 15px;
  background: #fff;
  color: rgb(185, 0, 0);
}
.add-addr-btn::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background: #dad8d8;
  opacity: 0.5;
}
</style>
