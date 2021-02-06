import listData from '../../static/music.js'
export default {
  state: {
    list: listData.data,
	img: "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
	id: '', //数据请求id
	paused: true,
	//是否循环
	recycled: false,
	playing: 0,
	now: '00:00',
	duration: '00:00',
	progress_max: '0'
  },
  mutations:{
	  changeplaying(state, s){
		  state.playing=state.playing+s;
		  console.log('state.playing=',state.playing)
	  },
	  changepaused(state,s){
		  state.paused=s
	  },
	  changerecycled(state,s){
	  		  state.recycled=s
	  },
	  changenow(state,s){
	  		  state.now=s
	  },
	  changeduration(state,s){
	  		  state.duration=s
	  }, 
	  changeprogress(state,s){
	  		  state.progress_max=s
	  },
	  changestatu(state,s){
		  state.list[s].status = !state.list[s].status;
	  }
	  
	  
  }
}