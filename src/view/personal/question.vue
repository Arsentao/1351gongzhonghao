<template>
  <div class="question">
     <ul>
         <li v-for="(record,index) in records">
             <div class="list">
                 <van-cell-group>
                    <van-cell title="提问时间" :value='record.createTime'/>
                    <van-cell title="提问内容" :value='record.postContent'/>
                    <van-cell title="回复内容"  value='未收到回复'  v-if="record.answer == null"/>
                    <van-cell title="回复内容" :value='record.answer' v-else/>
                 </van-cell-group>
             </div>
         </li>
     </ul>
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
          userId: '',
          questionTime: '',
          question: '',
          answer: '',
          records: []


      }
  },
  created(){
       this.$http({
        url: this.$http.adornUrl('/p/Wallet/myWalletInfo'),
        method: 'get'
      }).then(({ data }) => {
           console.log(data)
           this.userId = data.userId
           this.questionList()
  })

   
 
  },
  methods:{
    questionList(){
        this.$http({
        url: this.$http.adornUrl('/p/post/friendPostList'),
        method: 'get',
        params: this.$http.adornParams({
          userId: this.userId
        })
      }).then(({ data }) => {
           this.records = data.records
           console.log(this.records)
  })
    }
  }
}
</script>

<style scoped>
.list{
margin-bottom: 70px;
}
</style>