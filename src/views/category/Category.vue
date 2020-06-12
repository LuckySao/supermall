<template>
  <div class="wrapper" ref="aaaa">
    <ul class="content">
      <button @click="btnClick">按钮</button>
      <li>分类符号1</li>
      <li>分类符号2</li>
      <li>分类符号3</li>
      <li>分类符号4</li>
      <li>分类符号88</li>
      <li>分类符号89</li>
      <li>分类符号90</li>
      <li>分类符号91</li>
      <li>分类符号92</li>
      <li>分类符号93</li>
      <li>分类符号3</li>
      <li>分类符号4</li>
      <li>分类符号88</li>
      <li>分类符号89</li>
      <li>分类符号90</li>
      <li>分类符号91</li>
      <li>分类符号92</li>
      <li>分类符号93</li>
      <li>分类符号94</li>
      <li>分类符号95</li>
      <li>分类符号96</li>
      <li>分类符号97</li>
      <li>分类符号98</li>
      <li>分类符号99</li>
      <li>分类符号100</li>
    </ul>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Category",
    data(){
      return {
         scroll:null
      }
    },
    mounted(){
      this.scroll = new BScroll(this.$refs.aaaa ,{
        probeType:3,
        pullUpLoad:true
      })

      this.scroll.on('scroll' , (position) => {

      })

      this.scroll.on('pullingUp',() => {
        console.log("上拉加载更多的")
      })
    },
    methods:{
      btnClick(){
        console.log('btnclick')
      }
    }

  }
</script>

<style scoped>
.wrapper{
  height: 150px;
  background-color: red;
  overflow: hidden;
}
</style>
