<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import musicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSingerDetail(this.singer.id)
    },
    methods: {
      _getSingerDetail(id) {
        if(!id) {
          this.$router.push('/singer')
        }
        getSingerDetail(id).then(res=> {
          if(res.code === ERR_OK) {
            this.songs = this._mormalize(res.data.list)
          }
        })
      },
      _mormalize(list) {
        let res = []
        list.forEach(item=> {
          let {musicData} = item
          if(musicData.songid && musicData.albummid) {
            res.push(createSong(musicData))
          }
        })
        return res
      }
    },
    computed: { 
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: transform .3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>