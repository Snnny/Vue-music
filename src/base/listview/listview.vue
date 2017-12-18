<template>
  <scroll 
    class="listview" 
    :data="data" 
    ref="listview"
    @scroll="scroll"
    :listenScroll="listenScroll"
    :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click.stop="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div 
      class="list-shortcut" 
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li 
          v-for="(item, index) in shortcutList" 
          class="item" 
          :class="{'current':currentIndex===index}"
          :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  const SHORTCUT_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        let target = e.touches[0].target // 点击的target:li
        let shortcutIndex= getData(target, 'index')
        this.touch.firstTouch = e.touches[0].pageY
        this.touch.shortcutIndex = shortcutIndex
        this._scrollTo(shortcutIndex)
      },
      onShortcutTouchMove(e) {
        let target = e.touches[0].target // 点击的target:li
        let shortcutIndex= getData(target, 'index')
        this.touch.Endtouch = e.touches[0].pageY
        let step = (this.touch.Endtouch - this.touch.firstTouch) / SHORTCUT_HEIGHT | 0
        this._scrollTo(parseInt(this.touch.shortcutIndex) + step)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        if(!index && index !== 0) { // 【点击】上下边缘 高亮效果消失
          return
        }
        if(index < 0) { //触摸边界处理
          return
        } else if(index > this.listPosY.length-2) {
          index = this.listPosY.length-2
        }
        this.currentIndex = index
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _caculatePosY() {
        this.listPosY = []
        let height = 0
        let list = this.$refs.listGroup
        this.listPosY.push(height)
        list.forEach((item, index)=> {
          height += item.clientHeight
          this.listPosY.push(height)
        })
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(item=> item.title.substr(0, 1))
      },
      fixedTitle() {
        if(this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      data() {
        setTimeout(()=> {
          this._caculatePosY()
        }, 20)
      },
      scrollY(newY) {
        // scrollY大于0表示刚开始的时候就向上滚
        if(newY > 0) {
          this.currentIndex = 0
          return
        }
        let listPosY = this.listPosY
        // 在列表中间滚
        for(let i=0, len= listPosY.length - 1; i<len; i++) {
          let posY1 = listPosY[i]
          let posY2 = listPosY[i+1]
          if(-newY>= posY1 && -newY < posY2) {
            this.currentIndex = i
            this.diff = posY2 + newY
            return
          }
        }
        // 滚动到底部，且-newY大于最后一个元素的上限(最后一组不满一屏 title被向上滚出)
        console.log('bottom', this.currentIndex)
        this.currentIndex = listPosY.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal>0 && newVal < TITLE_HEIGHT) ? TITLE_HEIGHT - newVal : 0
        if(this.fixedTop === fixedTop){ // 减少不必要的dom操作
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${-fixedTop}px,0)`
       
      }
    },
    components: {
      Scroll
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>