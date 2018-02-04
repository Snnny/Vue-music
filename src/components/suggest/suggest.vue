<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li  class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {ERR_OK} from 'api/config'
  import {search} from 'api/search'
  import {createSong} from 'common/js/song'
  import Singer from 'common/js/singer'
  import { mapMutations} from 'vuex'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        hasMore: true,
        pullup: true,
        firstGen: true // 保证只是第一次搜索的时候添加歌手
      }
    },
    methods: {
      selectItem(item) {
        if(item.type === TYPE_SINGER) {
          let singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.setSinger(singer)
          this.$router.push({
            path: `/singer/${singer.id}`
          })

        }
      },
      search() {
        this.hasMore = true
        this.firstGen = true
        this.$refs.suggest.scrollTo(0,0)
        search(this.query, this.page, this.showSinger, perpage).then(res=> {
          if(res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        console.log(this.hasMore)
        if(!this.hasMore) return
        search(this.query, ++this.page, this.showSinger, perpage)
          .then(res => {
            if(res.code ===ERR_OK) {
              this.result = this.result.concat(this._genResult(res.data))
              this._checkMore(res.data)
            }
          })
      },
      getIconCls(item) {
        return item.type === TYPE_SINGER
          ? 'icon-mine'
          : 'icon-music'
      },
      getDisplayName(item) {
        if(item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _checkMore(data) {
        const { list, curnum, curpage, totalnum } = data.song
        if(!list.length || (curnum + curnum * curpage) >= totalnum) {
          this.hasMore = false
        }
      },
       _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _genResult(data) {
        let res = []
        if(this.firstGen &&　data.zhida && data.zhida.type) { //包含歌手
          res.push({ ...data.zhida, type: TYPE_SINGER }) // 保证歌手在数组的第一位
        }
        if(data.song) {
          res = res.concat(this._normalizeSongs(data.song.list))
        }
        this.firstGen = false
        return res
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      query(newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>