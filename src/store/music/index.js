import listData from '../../static/music.js'
export default {
  state: {
    list: listData.data,
	img: "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
	id: '', //数据请求id
	paused: true,
	//是否循环
	recycled: false,
	playing: 1,
	now: '00:00',
	duration: '00:00',
	progress_max: 0
  },
  mutation:{
	  
  }
}