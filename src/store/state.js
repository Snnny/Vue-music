import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,         // 播放状态
  fullScreen: false,      // 全屏播放 
  playlist: [],           // 播放列表 
  sequenceList: [],       // 播放列表(根据播放模式)
  mode: playMode.sequence,// 播放模式
  currentIndex: -1,       // 当前歌曲索引
}

export default state
