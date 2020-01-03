<template>
     <div class="QA">
         <div class="ask-box">
              <input class="text" type="text" v-model="myask" placeholder="请在此输入您的问题">
              <button class="send" @click="send()">发送</button>
        </div>
        <div class="hidden">
           <!-- <div class="inner-container" :style="{'animation-duration':duration}"> -->
       <div class="gundong" v-for="(item,index) in postList" :key="index">
        <div class="Q">
              <div class="img"><img class="img-ask" src="../../assets/images/forum/ask.jpg"></div>
              <span class="span-ask">{{item.postContent}}</span>
        </div>
        <div class="A">         
              <div class="img"><img class="img-answer" src="../../assets/images/forum/answer.jpg"></div>
              <span class="span-answer">{{item.answer}}</span>  
        </div>
       </div>
        <!-- </div> -->
        </div>
      
    <foot-nav :navIndex="3"></foot-nav>
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
      height : '500px',
      listlength: 0,
      myask: '',
      postList: [],
      duration: '38s'
    }
  },
  

   created(){
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' })
    this.queryPostList()
   },
    methods:{
     queryPostList () {
      this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/post/listByCategory'),
        method: 'get',
        params: this.$http.adornParams({
          categoryId: 7,
          current: 1,
          size: 100
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.postList = data.records
        this.loading = false
        this.listlength = this.postList.length
      })
    },
    send(){
      if(this.myask == ''){
        return 
        }
        else{
       this.$toast.loading({
        forbidClick: true,
        duration: 0
      })
      this.$http({
        url: this.$http.adornUrl('/p/post/submitPost'),
        method: this.postId ? 'PUT' : 'POST',
        data: this.$http.adornData({
          postId: '',
          postCategoryId: 7,
          postTitle: '提问',
          postContent: this.myask,
          postPic: ''
        })
      }).then(({ data }) => {
        this.$toast.clear()
        this.$dialog.alert({
          title:"收到，尽快回复您",
        }).then(() => {
          this.$router.push('/QA')
          this.myask = ''
        });
      })
    }
      }
    }
}
</script>

<style scoped>
.inner-container {
animation: myMove linear infinite;
animation-fill-mode: forwards;
animation-delay: 2s;
}
@keyframes myMove {
0% {
transform: translateY(0);
}
87% {
transform: translateY(-1900px);
}
100% {
transform: translateY(-1900px);
}
}

.QA{
width: 100%;
height: 100%;
position: fixed;
}
.hidden{
margin-top: 16%;
width: 100%;
height: 80%;
overflow: hidden;
overflow-y: scroll;
background: url("../../assets/images/homePage/logo2.jpg");
background-size: 100% 100%;
}

.img{
display: inline-block;
}
.Q{
margin-top: 10%;
padding-left: 20px;
text-align: left;
}
.A{
margin-top: 10%;
padding-left: 20px;
text-align: left;
}
.img-ask{
width: 40px;
height: 40px;
}
.img-answer{
width: 40px;
height: 40px;
}
.span-ask{
color: red;
display: inline-block;
padding: 10px;
text-align: left;
font-size: 16px;
background-color: white;
border-radius: 10%;
max-width: 75%;
border: 2px solid red;
box-shadow: 0 0 3px rgb(231, 223, 223);
word-break: break-all;
}
.span-answer{
color: blue;
display: inline-block;
padding: 10px;
text-align: left;
font-size: 16px;
background-color: white;
border-radius: 10%;
max-width: 75%;
border: 2px solid blue;
box-shadow: 0 0 3px rgb(231, 223, 223);
word-break: break-all;
}
.ask-box{
position: absolute;
top: 0%;
width: 100%;
text-align: left;
height: 8%;
vertical-align: middle;
}
.text{
margin-top: 10px;
width: 70%;
height: 40px;
margin-left: 5%;
outline: none;
font-size: 18px;
text-indent: 10px;
border-radius: 10px;
background-color: #006600;
color: white;
font-weight: bold;
}
.send{
margin-top: 10px;
margin-left: 5%;
font-size: 15px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 15%;
padding: 0.5em;
border: 2px solid crimson;
}
input::-webkit-input-placeholder{
color: white;
}
input::-moz-input-placeholder {
color: white;
}
input::-ms-input-placeholder {
color: white;
}
</style>

<style>
.van-dialog__content .van-dialog__message{
font-size: 18px;
}
</style>