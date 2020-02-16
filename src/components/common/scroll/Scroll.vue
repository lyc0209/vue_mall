<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot>

      </slot>
    </div>
  </div>
</template>

<script>
  // 对better scroll滚动的封装

  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    data() {
      return {
        scroll: null
      }
    },

    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },

    //页面挂载之后
    //probeType: 3  实时监听
    //pullUpLoad: 是否上拉加载
    //this.$refs.wrapper拿到ref
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      //监听滚动位置, probeType不能写死，有的页面不需要实时获取滚动位置
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        //将position传到父组件
        this.$emit('scroll', position)
      })

      //监听上拉事件
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    },
    methods: {
      scrollTo(x, y, time=300) {
        this.scroll.scrollTo(x, y, time)
      },

      finishPullUp() {
        this.scroll.finishPullUp()
      }
    }

  }
</script>

<style scoped>

</style>
