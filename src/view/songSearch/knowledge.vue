<template>
  <div class="knowledge">
        <div class="pu">
            <span class="title">1.五线谱</span>
            <button class="know" @click="routerChange1()">查看简介</button>
        </div>
         <div class="pu">
            <span class="title">2.简谱</span>
            <button class="know" @click="routerChange2()">查看简介</button>
        </div>
         <div class="pu">
            <span class="title">3.鸟然谱</span>
            <button class="know" @click="routerChange3()">查看简介</button>
        </div>
        <div class="pu">
            <span class="title">4.鸟然谱琴侣</span>
            <button class="know" @click="routerChange4()">查看简介</button>
        </div>

<div class="notice">
  <p class="info_title">公告</p>
  <p class="parm">从首页进入<span class='span_personal'>个人中心</span>栏目</p>
  <p class="parm">申请成为琴侣品牌介绍人</p>
  <p class="parm">即获赠微型动漫</p>
</div>
    
    <!-- <van-popup v-model="show1" closeable round class="id" close-icon-position="top-left">
五线谱是目前世界上通用的记谱法，是在五根等距离的平行横线上标注。五线谱以五线和四间来描述音高，相对于简谱，五线谱的优点是易于展示音的高低，对复杂的和声（在一个位置上有几个音同时出现）容易识别，视觉非常清楚；在表示旋律方面，尤其是高低不同的众多音的形态更是比较清楚。但是五线谱不是基于唱名设计的，不具有循环特征，很难在五线四间中哼出唱名，不利于视唱，由此很多音乐家也在积极思考使五线谱朝着可读性（如彩色五线谱以及简谱）方向改进的方法，推动五线谱的发展。
   </van-popup>
    <van-popup v-model="show2" closeable round class="id" close-icon-position="top-left">
       简谱是一种简易的记谱法，采用“1、2、3、4、5、6、7”代表音阶中的7个基本级，读音为“do、re、mi、fa、sol、la、si”，也称为唱名，休止用0表示。在简谱中唱名每隔八度循环，在音符上方加一个点表示高八度，下方加一个点表示低八度，依次类推。如中音“1”到高音“”相隔一个八度，从“”开始下一个高音段的循环。简谱的音高表述符号简单直观，但是对于音长和音强的表述则不太直观。
        </van-popup>
    <van-popup v-model="show3" closeable round class="id" close-icon-position="top-left">
        鸟然谱是一种新型乐曲记谱法，由广州丰谱信息技术有限公司发明。鸟然谱由符号框和延长线两个基本单元组成。其中，符号框的大小固定，框记录音符的音高信息，位置摆放高低与音高有关；延长线记录音符的音长，音符的持续时间与线的长短成正比。鸟然谱记号神似汉字、形似小鸟，音符及其时长均一目了然，故又名了然谱。鸟然谱追求极简，适合于业余人士学习乐器（如钢琴）、视唱练声、多声部合唱等。
        </van-popup> -->
<v-footer></v-footer>
  </div>
</template>

<script>
import vFooter from '../../components/footer.vue'
export default {
     components: {
    vFooter
  },
 data(){
     return{
     links: ['https://baike.baidu.com/item/%E4%BA%94%E7%BA%BF%E8%B0%B1/383586?fr=aladdin',
             'https://baike.baidu.com/item/%E7%AE%80%E8%B0%B1',
             'https://baike.baidu.com/item/%E9%B8%9F%E7%84%B6%E8%B0%B1',
             'https://baike.baidu.com/item/%E9%B8%9F%E7%84%B6%E8%B0%B1%E7%90%B4%E4%BE%A3']
     }
 },
 methods:{
  routerChange1(){
      window.location.href = this.links[0]
  },

   routerChange2(){
      window.location.href = this.links[1]
  },

   routerChange3(){
      window.location.href = this.links[2]
  },
  routerChange4(){
      window.location.href = this.links[3]
  }
 }
}
</script>


<style scoped>
.knoeledge{
width: 100%;
height: 100%;
overflow: auto;
}
.pu{
width: 100%;
overflow: hidden;
border-bottom: 1px solid #dee3e7de;
}

.title{
font-size: 20px;
float: left;
padding-top:25px;
padding-bottom: 25px;
padding-left: 15px;
color: crimson;
font-weight: bold;
letter-spacing: 2px;
}
.know{
font-size: 18px;
float: right;
margin-right: 10px;
margin-top: 20px;
padding: 5px;
background-color: rgb(70, 157, 228);
color: white;
border: none;
border-radius: 10%;
font-weight: bold;
}
.id{
width: 60%;
font-size: 18px;
padding: 40px;
line-height: 150%;
letter-spacing: 2px;
}

.notice{
margin-top: 30px;
width: 80%;
text-align: center;
margin-left: 10%;
border: 2px dashed rgb(46, 176, 216);
}
.info_title{
color: crimson;
font-size: 22px;
font-weight: bold;
line-height: 150%;
}
.parm{
font-size: 18px;
line-height: 150%;
color: rgb(45, 100, 145);
text-align: center
}
.span_personal{
padding: 3px;
color: white;
font-weight: bold;
background-color: rgb(57, 183, 233)
}
</style>

