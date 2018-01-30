<template>
  <transition name="drop">
    <music-list :songs="songs" :title="title" bgImage="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import MusicList from 'components/music-list/music-list'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        getMusicList(this.toplist.id)
          .then(res=> {
            if(res.code === ERR_OK) {
              this.songs = this.normalize(res.songlist)
            }
          })
      },
      normalize(songlist) {
        let res = []
        songlist.forEach(song=> {
          let _data = song.data
          if(_data.songid && _data.albummid) {
            res.push(createSong(_data))
          }
        })
        return res
      }
    },
    computed: {
      title() {
        return this.toplist.topTitle
      },
      bgImage() {
        console.log(this.songs.length)
        if(this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'toplist'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>