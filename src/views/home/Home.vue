<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control"
                   :titles="['流行', '新款', '精品']"
                   @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "../../components/common/navbar/NavBar";
  import TabControl from "../../components/content/tabControl/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import Scroll from "../../components/common/scroll/Scroll";
  import BackTop from "../../components/content/backTop/BackTop";

  import {getHomeMultidata, getHomeGoods} from "../../network/home";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        //上拉按钮是否显示, 默认不显示
        isShowBackTop: false
      }
    },
    //生命周期函数，首页创建完毕
    created() {
      //create一般不写方法的具体实现
      //调用methods的方法
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      /**
       *事件监听相关方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },

      //组件无法直接监听, 要@click.native="backClick"
      backClick() {
        //直接拿到data里的scroll
        //scrollTo(0, 0, 毫秒)
        // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
        this.$refs.scroll.scrollTo(0, 0, 500)
      },

      contentScroll(position) {
        // console.log(position.y);
        this.isShowBackTop = -position.y > 1000
      },

      loadMore() {
        // console.log('load more');
        this.getHomeGoods(this.currentType)

        //图片加载完后刷新
        //不然图片没加载完item的高度没有，计算的高度不正确
        //this.$refs.scroll.scroll.refresh()
      },


      /**
       * 网络请求相关方法
       */
      getHomeMultidata() {
        //1. 请求多个数据，异步操作
        getHomeMultidata().then(res => {
          //这里要保存，不然函数结束之后变量会销毁
          // this.result = res
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          //...res: 对res数组解构，
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //上拉一次之后finish之后才能继续加载
          this.$refs.scroll.finishPullUp()
        })
      },

    }
  }
</script>

<style scoped>
/*  scoped: 只对当前页面起效果*/

  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content {
    /*height: calc(100% - 93px);*/
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;

  }

</style>
