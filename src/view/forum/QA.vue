<template>
     <div class="QA">
        <div class="Q">
              <div class="span-right">{{asklist[isindex].ask}}</div>
              <span class="img"><img class="img-right" src="../../assets/images/forum/ask.png"></span>
        </div>
        <div class="A">         
              <div class="img"><img class="img-left" src="../../assets/images/forum/answer.png"></div>
              <span class="span-left">{{asklist[isindex].answer}}</span>  
        </div>
        <div class="ask-box">
              <input class="text" type="text" v-model="myask" placeholder="请在此输入您想提问的内容">
              <button class="send" @click="send()">发送
              </button>
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
      listlength: 0,
      isindex: 0,
      myask: '',
      asklist: [{
        ask: '今天天气如何',
        answer: '今天天气不错喔'
      },
      {
        ask: '有没有平安夜这首曲子呢',
        answer: '有啊'
      },
        {
        ask: '鸟然谱琴侣售价多少',
        answer: '1388人民币'
      }
      ]
    }
  },
  

   created(){
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' })
   },


    mounted () {
    this.listlength = this.asklist.length
    setInterval(this.changelist, 3000)
  },
   

    methods:{
    changelist(){
      if (this.isindex < this.listlength - 1){
      this.isindex = this.isindex + 1
      }
      else {
      this.isindex = 0
      }
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
          title:"提问成功！",
          message: '等待后台审核'
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
.img{
display: inline-block;
}
.Q{
margin-top: 10%;
padding-right: 20px;
text-align: right;
}
.A{
margin-top: 20%;
padding-left: 20px;
text-align: left;
}
.img-left{
width: 50px;
height: 50px;
margin-right: 10px;
}
.img-right{
width: 50px;
height: 50px;
margin-left: 10px;
}
.span-left{
display: inline-block;
padding: 10px;
text-align: left;
font-size: 15px;
background-color: #7cfc00;;
border-radius: 10%;
max-width: 50%;
border: 2px solid rgb(231, 223, 223);
box-shadow: 0 0 3px rgb(231, 223, 223);
word-break:break-all;
}
.span-right{
display: inline-block;
padding: 10px;
text-align: left;
font-size: 15px;
background-color: #7cfc00;;
border-radius: 10%;
max-width: 50%;
border: 2px solid rgb(231, 223, 223);
box-shadow: 0 0 3px rgb(231, 223, 223);
word-break:break-all;
}
.ask-box{
position: absolute;
bottom: 15%;
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
background-color: #7cfc00;;
font-weight: bold;
}
.send{
margin-left: 5%;
font-size: 15px;
background-color: crimson;
color: white;
border-radius: 15%;
padding: 0.5em;
border: 2px solid crimson;
}
</style>