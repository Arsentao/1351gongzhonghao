<template>
     <div class="QA">
        <div class="Q">
              <div class="img"><img class="img-ask" src="../../assets/images/forum/ask.jpg"></div>
              <span class="span-ask">{{postList[isindex].postContent}}</span>
        </div>
        <div class="A">         
              <div class="img"><img class="img-answer" src="../../assets/images/forum/answer.jpg"></div>
              <span class="span-answer">{{postList[isindex].answer}}</span>  
        </div>
        {{this.listlength}}
        {{this.isindex}}
        <div class="ask-box">
              <input class="text" type="text" v-model="myask" placeholder="请在此输入您的问题">
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
      postList: []
    }
  },
  

   created(){
    this.$notify({ type: 'primary', message: '为避免弹出手机内置对话框' + '\n' + '请在浏览本网站时轻按所有按钮' })
    this.queryPostList()
    setInterval(this.changelist, 3000)
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
background-color: #7cfc00;;
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