<template>
     <div class="QA">
         <div class="ask-box">
              <input class="text" type="text" v-model="myask" placeholder="请在此输入您的问题">
              <button class="send" @click="send()">发送
              </button>
        </div>

        <div class="hidden" :style="{'height':height}">
           <div id="inner">
       <div class="gundong" v-for="(item,index) in asklist" :key="index">
        <div class="Q">
              <div class="img"><img class="img-ask" src="../../assets/images/forum/ask.jpg"></div>
              <span class="span-ask">{{item.postContent}}</span>
        </div>
        <div class="A">         
              <div class="img"><img class="img-answer" src="../../assets/images/forum/answer.jpg"></div>
              <span class="span-answer">{{item.answer}}</span>  
        </div>
       </div>
        </div>
        </div>

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
      haha : document.querySelector('#inner'),
      height : document.documentElement.clientHeight * 0.7 + 'px',
      listlength: 0,
      myask: '',
      postList: [],
      asklist: [
        {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
         {postContent: 'duihf',
        answer: 'duyhf'},
      ]
    }
  },
  
  computed:{
    duration(){
    return "32s"
    },
  
  },

   created(){
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' })
    this.queryPostList()

   },


mounted(){
 this.myStartFunction()
},

    methods:{

       myStartFunction(){
       var haha = document.querySelector('#inner')
        haha.classList.add('inner-container')
        console.log('开始')
        this.myEndFunction()
       },

  myEndFunction(){
  var haha = document.querySelector('#inner')
   haha.addEventListener('animationend',function(){
     
      console.log('读后')
      
      setTimeout(function(){
haha.classList.remove('inner-container')

 },5000)

})

  },
  return(){
    var haha = document.querySelector('#inner')
     haha.classList.remove('inner-container')
    console.log('ydu')
  },

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
          title: "提问成功！",
          message: '收到，尽快回复您'
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

<style>
.inner-container {
animation: myMove 5s linear 1;
animation-fill-mode: forwards;
}

@keyframes myMove {
0% {
transform: translateY(0);
}

100% {
transform: translateY(-200px);
}
}

.hidden{
margin-top: 20%;
width: 100%;
overflow: hidden;
overflow-y: scroll;
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
display: inline-block;
padding: 10px;
text-align: left;
font-size: 20px;
background-color: #ee424b;;
border-radius: 10%;
max-width: 50%;
border: 2px solid rgb(231, 223, 223);
box-shadow: 0 0 3px rgb(231, 223, 223);
word-break:break-all;
}
.span-answer{
display: inline-block;
padding: 10px;
text-align: left;
font-size: 20px;
background-color: #2875e9;;
border-radius: 10%;
max-width: 50%;
border: 2px solid rgb(231, 223, 223);
box-shadow: 0 0 3px rgb(231, 223, 223);
word-break:break-all;
}
.ask-box{
position: absolute;
top: 0%;
width: 100%;
text-align: left;
}
.text{
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
.van-dialog__content .van-dialog__message{
font-size: 18px;
}
</style>
