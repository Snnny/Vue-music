<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const progressBtnWidth = 16

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressClick(e) {
        this._offset(e.offsetX)
        this._tiggerPercent()
      },
      progressTouchStart(e) {
        this.touch.init = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if(!this.touch.init)
          return
        const touchLen = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,
          Math.max(this.touch.left + touchLen, 0))
        this._offset(offsetWidth)
      },
      progressTouchEnd(e) {
        this.touch.init = false
        this._tiggerPercent()
      },
      _offset(len) {
        this.$refs.progress.style.width = len  + 'px'
        this.$refs.progressBtn.style.transform = `translate3d(${len}px, 0, 0)`
      },
      _tiggerPercent() {
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = this.$refs.progress.clientWidth
        console.log('percent', offsetWidth/ barWidth)
        this.$emit('percentChange', offsetWidth/ barWidth)
      }
    },
    watch: {
      percent(newPercent) {
        if(newPercent <0 || this.touch.init)
          return
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth 
        let offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>