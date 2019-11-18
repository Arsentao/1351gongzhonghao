<template>
  <div class="count-conpoment">
    <div class="counter-btn"
         @click="minus">-</div>

    <div class="counter-show">
      <input type="number"
             v-model="number"
             disabled>
    </div>

    <div class="counter-btn"
         @click="add">+</div>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      type: Number,
      default: 10
    },
    min: {
      type: Number,
      default: 1
    },
    number: {
      type: Number,
      default: 1
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {

    }
  },
  // watch: {
  //   number () {
  //     this.$emit('onNumChange', this.number);
  //   }
  // },
  methods: {
    minus () {
      if (this.number <= this.min) {
        return
      }
      this.$emit('onNumChange', -1, this.index)
    },
    add () {
      if (this.number >= this.max) {
        return
      }
      this.$emit('onNumChange', 1, this.index)
    }
  }
}
</script>

<style scoped>
.counter-component {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
}
.counter-show {
  float: left;
}
.counter-show input {
  border: none;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  height: 35px;
  line-height: 35px;
  width: 90px;
  outline: none;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  vertical-align: middle;
  background-color: lightblue;
  color: red;
}
.counter-btn {
  border: 1px solid #e3e3e3;
  float: left;
  height: 35px;
  line-height: 35px;
  width: 65px;
  text-align: center;
  cursor: pointer;
  font-size: 40px;
  font-weight: bold;
}
</style>
