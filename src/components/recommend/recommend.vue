<template>
   <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="songList">
        <div>
          <div v-if="recommend.length>0" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommend">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImg" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in songList" class="item">
              <div class="icon">
                <a :href="item.linkUrl">
                  <img v-lazy="item.imgurl" width="60" height="60"/>
                </a>
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        </div>
        <div class="loading-container" v-if="!songList.length">
          <loading></loading>
        </div>
      </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import {getRecommend, getSongList} from 'api/recommend'
  import {ERR_OK} from 'common/js/config'
  export default{
    data() {
      return {
        recommend: [],
        songList: []
      }
    },
    created() {
      this._getRecommend()
      this._getSongList()
    },
    methods: {
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommend = res.data.slider
          }
        })
      },
      _getSongList() {
        getSongList().then(res => {
          if(res.code === ERR_OK) {
            console.log(res.data.list)
            this.songList = res.data.list            
          }
        })
      },
      loadImg() { // 确保轮播图图片在scroll组件的data变化之后才加载完毕并重新refresh
        if(!this.checkLoad) {
          this.$refs.scroll.refresh()
          this.checkLoad = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
