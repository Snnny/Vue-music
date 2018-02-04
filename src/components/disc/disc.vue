<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getDissList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if(!this.disc.dissid) {
          this.$router.push({ path: '/recommend' })
          return
        }
        getDissList(this.disc.dissid)
          .then(data=> {
            if(data.code === ERR_OK) {
              this.songs = this._normalize(data.data.list)
            }
          })
      },
      _normalize(musicData) {
        let res = []
        console.log(musicData)
        musicData.forEach(music=> {
          if(music.songid && music.albummid) {
            res.push(music)
          }
        })
        return res
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>