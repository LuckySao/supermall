<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ length }})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list/>
    <!-- 底部汇总 -->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';

import CartList from './childComps/CartList.vue'
import CartBottomBar from './childComps/CartBottomBar.vue'

import { mapGetters } from 'vuex';

export default {
  name: 'Cart',
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    //两种语法
    //用原来的名字
    // ...mapGetters(['cartLength' , 'cartList'])
    //自定义名字
    ...mapGetters({
      length:'cartLength'
    })
  }
};
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: bolder;
}
</style>
