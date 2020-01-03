<template>
  <div class="beStar">
  
  

<van-popup v-model="show" class="pop" closeable @close="closepop()"
  close-icon-position="top-left" round close-icon="close">
<van-cell title="选择开始日期" :value="startDate" @click="show1 = true" />
<van-cell title="选择结束日期" :value="endDate" @click="show2 = true" />
<div class="result">
<span class="money">总金额: <span style="color:red">¥</span>&nbsp;<span style="color:red">{{totalmoney.toFixed(2)}}</span></span> 
<button class="btn" @click="post()">查询</button>
</div>
</van-popup>

<van-popup v-model="theshow" class="popop" closeable @close="closepop()"
  close-icon-position="top-left" round close-icon="close">
  <van-field type="number" left-icon="contact" v-model="modifyphone" clearable
    label="手机号" placeholder="请输入修改后的手机号"/>
    <div class="modify">
<button class="btn" @click="modify()">修改</button>
    </div>
</van-popup>




<van-calendar v-model="show1" @confirm="onConfirm1" :show-confirm="false" 
  :min-date="minDate"  :max-date="maxDate"/>
<van-calendar v-model="show2" @confirm="onConfirm2" :show-confirm="false" 
  :min-date="minDate"  :max-date="maxDate"/>




  <div class="write">
  <van-field
  type="number"
  left-icon="contact"
    v-model="phone"
    clearable
    label="手机号"
    placeholder="请输入手机号"
    :disabled="isable"
  />
  </div>

  <div class="submit">
      <button class="btn_submit" @click="submit()">申请</button>
  </div>
  <div class="submit">
      <button class="btn_modify" @click="theshow = true">修改</button>
  </div>
    <div class="submit">
      <button class="btn_search" @click="show = true">查询</button>
  </div>

  <div class="info">成为网红可以获得产品推荐提成</div>

   <foot-nav></foot-nav>
  </div>
</template>



<script>
import footNav from '../../components/footer'
export default {
 components: {
    footNav
  },
  data(){
      return{
        ifpost: false,
        isable: false,
        modifyphone: '',
        searchphone: '',
        phone: '',
        theshow: false,
        show: false,
        show1: false,
        show2: false,
        startDate: '',
        endDate: '',
        postStart: '',
        postEnd: '',
        minDate: new Date(2019, 11, 1),
        maxDate: new Date(2029, 12, 1),
        totalmoney: 0,
        timeString1: '',
        timeString2: ''
      }
  },

  created(){
       this.$http({
        url: this.$http.adornUrl('/p/user/getphone'),
        method: 'get'
      }).then(({ data }) => {
            this.searchphone = data
            if(this.searchphone != ''){
              this.phone = this.searchphone
              this.isable = true
              this.ifpost = true
            }
      }
      )
       }
  ,
  methods:{
    closepop(){
     this.totalmoney = 0
     this.modifyphone = ''
    },

     modify(){
       this.theshow = true
      if(this.modifyphone.length != 11){
         this.$toast('请输入正确的手机号码')
       }

       else{
        this.$dialog.confirm({
        title: '确认要修改手机号码吗？'
      }).then(() => {
        this.$http({
        url: this.$http.adornUrl('/p/user/setphone'),
        method: 'post',
        data: this.$http.adornData({
          phone: this.modifyphone
        })
      }).then(({ data }) => {
       this.$dialog.alert({
        title: '修改成功!'
      }).then(() => {
        this.$router.go(0)
      })
      })
       }).catch()
       }
     },
      



     post(){
       this.show = true
      if(this.startDate == ''){
         this.$toast('请选择开始日期')
       }
        else if(this.endDate == ''){
         this.$toast('请选择结束日期')
       }
        else if(this.timeString1 >= this.timeString2){
          this.$toast('开始日期不能晚于结束日期')
        }

       else{
         this.$http({
        url: this.$http.adornUrl('/p/user/recommended'),
        method: 'post',
        data: this.$http.adornData({
          startTime: this.postStart,
          endTime: this.postEnd
        })
      }).then(({ data }) => {
            this.totalmoney = data
      }
      )
       }
       },
     onConfirm1(date) {
      this.timeString1 = Number(date.valueOf())
      console.log(this.timeString1)
      const monthmap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      let newdate = date.toString()
      let array = newdate.split(" ")
      let year = array[3]
      let month = array[1]
      month = monthmap.indexOf(month) + 1
      if(month < 10){
        month = '0' + month
      }
      let day = array[2]
      this.postStart = year + '-' + month + '-' + day + '+00:00:00'
      this.startDate = year + '/' + month + '/' + day  
      this.show1 = false
      
    },

      onConfirm2(date) {
      this.timeString2 = Number(date.valueOf())
      const monthmap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let newdate = date.toString()
      let array = newdate.split(" ")
      let year = array[3]
      let month = array[1]
      month = monthmap.indexOf(month) + 1
      if(month < 10){
        month = '0' + month
      }
      let day = array[2]
      this.postEnd = year + '-' + month + '-' + day + '+00:00:00'
      this.endDate = year + '/' + month + '/' + day  
      this.show2 = false
    },

      submit(){
        if(this.ifpost == true){
          this.$toast('您已经申请过了，无法重复申请')
        }
         else if(this.phone.length != 11){
              this.$toast('请输入正确的手机号码')
              return
          }
          else{

      this.$http({
        url: this.$http.adornUrl('/p/user/setphone'),
        method: 'post',
        data: this.$http.adornData({
          phone: this.phone
        })
      }).then(({ data }) => {
       this.$dialog.alert({
        title: '申请成功!',
        message: '您已经成为了网红!'
      }).then(() => {
        this.$router.go(0)
      })
      })
          }
      }
  }
}

    

</script>

<style>
.personal {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
}
.write{
margin-top: 100px;
}

.btn_submit{
width: 200px;
height: 50px;
font-size: 24px;
letter-spacing: 5px;
color: #fff;
border: 1px solid rgba(214,18,44,.85);
border-radius: 3px;
background-color: rgba(214,18,44,.85);
font-weight: 700;
margin-top: 100px;
}
.btn_modify{
width: 200px;
height: 50px;
font-size: 24px;
letter-spacing: 5px;
color: #fff;
border: 1px solid rgba(107, 231, 155, 0.85);
border-radius: 3px;
background-color: rgba(107, 231, 155, 0.85);
font-weight: 700;
margin-top: 30px;
}
.btn_search{
width: 200px;
height: 50px;
font-size: 24px;
letter-spacing: 5px;
color: #fff;
border: 1px solid rgba(46, 213, 235, 0.85);
border-radius: 3px;
background-color: rgba(46, 213, 235, 0.85);
font-weight: 700;
margin-top: 30px;
}
.search{
font-size: 20px;
color: crimson;
font-weight: bold;
letter-spacing: 2px;
line-height: 10px;
vertical-align: middle;
}
.search_icon{
width: 30px;
height: 30px;
vertical-align: middle;
}
.date{
padding-top: 15px;
}
.date1{
display: inline;
padding-left: 45%;
padding-right: 15px;
}
.date2{
display: inline;
}
.pop{
width: 100%;
padding-top: 60px;
}
.popop{
width: 100%;
padding-top: 60px;
}
.result{
padding-top: 30px;
padding-bottom: 80px;
}
.money{
font-size: 20px;
position: absolute;
left: 10px;
padding-top: 10px;
}
.btn{
width: 60px;
height: 40px;
font-size: 20px;
color: #fff;
border: 1px solid rgba(214,18,44,.85);
border-radius: 3px;
background-color: rgba(214,18,44,.85);
font-weight: 700;
vertical-align: middle;
position: absolute;
right: 10px;
}

.btn:active{
width: 60px;
height: 40px;
font-size: 20px;
color: #fff;
border: 1px solid rgba(81, 199, 214, 0.85);
border-radius: 3px;
background-color: rgba(81, 199, 214, 0.85);
font-weight: 700;
vertical-align: middle;
position: absolute;
right: 10px;
}

.modify{
margin-top: 30px;
margin-bottom: 100px;
}
.info{
font-size: 20px;
font-weight: 700;
color: red;
margin-top: 100px;
}

</style>