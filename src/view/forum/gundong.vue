<template>

    <div class="text-container">
      <div class="inner-container">
        <p class="text" v-for="(text, index) in arr" :key="index">{{text}}</p>
      </div>
    </div>
  
 
 
</template>

<script>
  
  export default {
    data() {
      return {
        arr: [
          '1 不是被郭德纲发现的，也不是一开始就收为徒弟。',
          '2 现在雅阁这个状态像极了新A4L上市那段日子。',
          '3 低配太寒碜，各种需要加装，中配定价过高，又没啥特色',
          '4 然后各种机油门、经销商造反什么的幺蛾子。',
          '5 看五月销量，建议参考A4，打8折吧。',
        ],
       
      }
    },
   
    
  
   
  }
</script>

<style scoped>

  .text-container {
    width: 350px;
    height: 30px;
    line-height: 30px;
    margin: 10px auto;
    overflow: hidden;
  }

  .inner-container {
    animation: myMove 5s linear infinite;
    animation-fill-mode: forwards;
  }

  @keyframes myMove {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-150px);
    }
  }

 
</style>