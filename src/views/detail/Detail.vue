<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="params" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <detail-buttom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop" />

  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue';
import DetailSwiper from './childComps/DetailSwiper.vue';
import DetailBaseInfo from './childComps/DetailBaseInfo.vue';
import DetailShopInfo from './childComps/DetailShopInfo.vue';
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue';
import DetailParamInfo from './childComps/DetailParamInfo.vue';
import DetailCommentInfo from './childComps/DetailCommentInfo.vue';
import DetailButtomBar from './childComps/DetailButtomBar.vue'

import Scroll from 'components/common/scroll/Scroll.vue';
import GoodsList from 'components/content/goods/GoodsList.vue';
import BackTop from 'components/content/backtop/BackTop.vue';

import { getDetail, getRecommend, Goods, Shop, GoodsParam } from 'network/detail.js';
import { debounce } from 'common/utils/utils.js';
import { itemListenerMixin } from 'common/mixin.js';

import { mapActions } from 'vuex';


export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailButtomBar,
    BackTop,
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false,
    };
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid;

    //2.根据iid请求详细数据
    getDetail(this.iid).then(res => {
      //1.获取顶部的图片轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      //2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

      //3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4.获取商品详细信息
      this.detailInfo = data.detailInfo;

      //5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

      // 6.保存评论数据
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }

      // this.$nextTick(() => {
      //   //根据最新的数据，对应的DOM已经被渲染出来了，但图片还没加载完(目前获取的高度不包含图片)
      //   //offsettop值不对的时候，都是因为图片的问题
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   //参数的offsettop
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   //评论的offsettop
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   //推荐的offsettop
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

      //   console.log(this.themeTopYs)
      // })
    });

    //3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list;
    });

    //4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      //参数的offsettop
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //评论的offsettop
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //推荐的offsettop
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
       this.themeTopYs.push(Number.MAX_VALUE);
    }, 100);
  },
  methods: {
    ...mapActions(['addCart']),
    //4.监听详情图片加载完成
    imageLoad() {
      this.refresh();

      this.getThemeTopY();
    },

    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 800);
    },

    contentScroll(position) {
      //1.获取Y值
      const positionY = -position.y;

      // 2.positionY和主题中的值进行对比
      for (let i = 0; i < this.themeTopYs.length-1; i++) {
        let length = this.themeTopYs.length;
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      //3.是否显示回到顶部
      this.isShowBackTop = -position.y > 800;
    },

    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },

    addToCart(){
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //2.将商品添加到购物车里
      this.addCart(product).then(res => {
        // this.show = true
        // this.message = res

        // setTimeout(() => {
        //   this.show = false
        //    this.message = ''
        // },1000)

        this.$toast.show(res,2000)
      })

      // this.$store.dispatch('addCart' , product).then(res => {
      //   console.log(res)
      // })
    },

  },
  mounted() {},
  updated() {},
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener);
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  height: calc(100% - 44px - 49px);
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>
