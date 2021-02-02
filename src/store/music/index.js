import listData from '../../static/music.js'
export default {
  state: {
    data: listData.data,
  },
  getters: {
    playList: state => {
      return state.data
    }
  }
}