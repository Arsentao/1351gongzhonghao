<template>
  <div class="knowledge">
        <div class="pu">
            <span class="title">1.五线谱</span>
            <button class="know" @click="showpop1()">查看简介</button>
        </div>
         <div class="pu">
            <span class="title">2.简谱</span>
            <button class="know" @click="showpop2()">查看简介</button>
        </div>
         <div class="pu">
            <span class="title">3.鸟然谱</span>
            <button class="know" @click="showpop3()">查看简介</button>
        </div>
    
    <van-popup v-model="show1" closeable round class="id" close-icon-position="top-left">
五线谱是目前世界上通用的记谱法，是在五根等距离的平行横线上标注。五线谱以五线和四间来描述音高，相对于简谱，五线谱的优点是易于展示音的高低，对复杂的和声（在一个位置上有几个音同时出现）容易识别，视觉非常清楚；在表示旋律方面，尤其是高低不同的众多音的形态更是比较清楚。但是五线谱不是基于唱名设计的，不具有循环特征，很难在五线四间中哼出唱名，不利于视唱，由此很多音乐家也在积极思考使五线谱朝着可读性（如彩色五线谱以及简谱）方向改进的方法，推动五线谱的发展。
   </van-popup>
    <van-popup v-model="show2" closeable round class="id" close-icon-position="top-left">
       简谱是一种简易的记谱法，采用“1、2、3、4、5、6、7”代表音阶中的7个基本级，读音为“do、re、mi、fa、sol、la、si”，也称为唱名，休止用0表示。在简谱中唱名每隔八度循环，在音符上方加一个点表示高八度，下方加一个点表示低八度，依次类推。如中音“1”到高音“”相隔一个八度，从“”开始下一个高音段的循环。简谱的音高表述符号简单直观，但是对于音长和音强的表述则不太直观。
        </van-popup>
    <van-popup v-model="show3" closeable round class="id" close-icon-position="top-left">
        鸟然谱是一种新型乐曲记谱法，由广州丰谱信息技术有限公司发明。鸟然谱由符号框和延长线两个基本单元组成。其中，符号框的大小固定，框记录音符的音高信息，位置摆放高低与音高有关；延长线记录音符的音长，音符的持续时间与线的长短成正比。鸟然谱记号神似汉字、形似小鸟，音符及其时长均一目了然，故又名了然谱。鸟然谱追求极简，适合于业余人士学习乐器（如钢琴）、视唱练声、多声部合唱等。
        </van-popup>

  </div>
</template>

<script>
export default {
 data(){
     return{
         show1: false,
         show2: false,
         show3: false,
     }
 },
 methods:{
  showpop1(){
      console.log('duhd')
      this.show1 = true;
  },

   showpop2(){
      this.show2 = true;
  },

   showpop3(){
      this.show3 = true;
  },
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
</style>

