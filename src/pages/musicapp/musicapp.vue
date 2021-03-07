<template>
	<view class="root">
		<view class="top">
			<view class="top_left top_radio">
				<u-icon name="arrow-leftward" color="#a1b0cd" size="58" @click="comeback"></u-icon>
			</view>
			<view class="top_top">
				PLAYING NOW
			</view>
			<view class="top_right top_radio">
				<u-icon name="list" color="#a1b0cd" size="58"></u-icon>
			</view>
		</view>
		<view class="hand_img">
			<u-image class="hand_imgg"
			         width="600rpx"
			         height="600rpx"
			         :src="playList[this.playing].img"
			         shape="circle"
					></u-image>
		</view>
		<view class="song_text">
			<view>{{playList[this.playing].name}}</view>
			<view>{{playList[this.playing].boss}}</view>
		</view>
		<!-- 底部音频控制器 -->
			<view class="wrap">
				<view class="wrap_text">
					<u-row gutter="16" justify="between">
								<u-col span="2">
									<view class="text_left">{{now}}</view>
								</u-col>
								<u-col span="2">
									<view class="text_right">{{duration}}</view>
								</u-col>
					</u-row>
				</view>
				<u-slider v-model="progress" @start="progress_touch_start"
				@end="progress_touch_end(progress)"></u-slider>
			</view>
	</view>
</template>

<script>
	import Music from '../music/music.vue';
	import { mapState } from 'vuex';
	const innerAudioContext = Music.innerAudioContext;
var that = null;
	export default {
	data() {
		return {
				
			}
			},
	onLoad() {
				that = this;
			},
    computed: {
      ...mapState({
        playList: state => state.Music.list,
        // 变量名：state=>state.模块名.对应变量
    	  img: state => state.Music.img,
    	  id: state => state.Music.id, //数据请求id
    	  paused: state => state.Music.paused,
    	  //是否循环
    	  recycled: state => state.Music.recycled,
    	  playing: state => state.Music.playing,
    	  now: state => state.Music.now,
    	  //当前音频
    	  duration:state => state.Music.duration,
    	  //音频最大长度
    	  // progress_max: state => state.Music.progress_max,
    	  //这是当前播放
      }),
    	//当前播放的百分比值  要利用set去双向绑定上传
    	progress:{
    		get(){
    			return this.$store.state.Music.progress_max
    		},
    		set(v){
    			this.$store.commit("changeprogress",v)
    			}
    	}
    },
		methods:{
			comeback(){
				uni.navigateBack({
					
				})
			},
			// 进度条相关
			progress_touch_start () {
				// console.log("我开始滑动了")
			  innerAudioContext.pause();
			},
			progress_touch_end (percent) {
			 // console.log("我结束滑动了"+percent)
			  let s = (percent/ 100) * innerAudioContext.duration;
			  //转换为十进制数
			  innerAudioContext.seek(parseInt(s));
			},
},
}
</script>

<style lang="scss">
.root{
	background-color: #ececec;
	.top{
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ececec;
		.top_left{
			margin-left: 30rpx;
		}
		.top_right{
			margin-right: 30rpx;	
		}
		.top_radio{
			padding: 5px;
			// background-color: red;
			border-radius: 50%;
			//凸起小图标
			// box-shadow: -10px -10px 15px 5px rgba(255,255,255,0.5),10px 10px 15px 5px rgba(70,70,70,0.12);
			box-shadow: -10px -10px 15px rgba(255, 255, 255, 0.5),
			10px 10px 15px rgba(70,70,70,0.12);
			border:px solid #ececec;
		}
	}
	.hand_img{
		.hand_imgg{
			margin: 30rpx auto;
			box-shadow: -20px -20px 25px rgb(255 255 255 / 70%), 20px 20px 25px rgb(70 70 70 / 23%);
			border:8px solid #ececec;
		}
	}
	.wrap{
		background-color: pink;
		padding: 20rpx ;
		width: 750rpx;
		height: 150rpx;
		position: fixed;
	    bottom: 0;
		.wrap_text{
			.text_left,.text_right{
				text-align: center;
			}
		}
	}
}
</style>
