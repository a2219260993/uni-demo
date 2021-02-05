<template>
  <view class="root">
    <!-- 顶部标签 -->
    <view class="top_top">
      SKIN · FLUME
    </view>
    <!-- 头像区 -->
    <view class="hand">
      <view class="hand_icon">
        <u-icon v-if='!playList[playing].status'
                name="star"
                color="#9baac2"
                size= "78"
                @click=collecte(playing)></u-icon>
        <u-icon v-else
                name="star-fill"
                color="#9baac2"
                size="78"
                @click=collecte(playing)></u-icon>
      </view>
      <u-image :class="!paused?'hand_img ani':'hand_img'"
               width="300rpx"
               height="300rpx"
               :src="img"
               shape="circle"></u-image>
      <view class="hand_icon">
        <u-icon name="more-dot-fill"
                color="#9baac2"
                size="78"></u-icon>
      </view>
    </view>
    <!-- 头像区 -->

    <!-- 播放列表 -->
    <view class="play-list-wrap">
      <u-cell-group class='list'>
        <u-cell-item :title="itme.name"
                     :label="itme.boss"
                     :arrow="false"
                     v-for="(itme,index) of playList"
                     :key=itme.id
                     @click="change_item(index)">
          <!-- 暂停 -->
          <u-icon slot="right-icon"
                  v-if="!paused&&index==playing"
                  @click="log(itme.boss)"
                  name="pause"
                  color="#a1b0cd"
                  size="58"
				  class='player'></u-icon>
          <!-- 播放 -->
          <u-icon slot="right-icon"
                  v-else
                  @click="log(itme.boss)"
                  name="play-right-fill"
                  color="#a1b0cd"
                  size="58"
				  class='player'></u-icon>
        </u-cell-item>
		
      </u-cell-group>
    </view>

    <!-- 底部音频控制器 -->
    <!-- 上方控制按钮  -->
  </view>
</template>
<script>
import listData from '../../static/music.js'
import { mapState } from 'vuex';
var that = null;
const innerAudioContext = uni.createInnerAudioContext();
export default {
  data () {
    return {

    };
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
	  duration:state => state.Music.duration,
	  progress_max: state => state.Music.progress_max
    })
  },
  //转跳传值  小程序的   onLoad监听页面加载
  onLoad (options) {
    that = this;
    innerAudioContext.autoplay = false;
    innerAudioContext.onTimeUpdate(() => {
      that.now = that.time_format(innerAudioContext.currentTime);
      that.duration = that.time_format(innerAudioContext.duration);
      that.progress_max = parseInt(100 * (innerAudioContext.currentTime / innerAudioContext.duration));
    });
    innerAudioContext.onSeeked(function () {
      innerAudioContext.play();
    });
    innerAudioContext.onPause(function () {
      console.log("onPause被调用了")
      that.paused = true;
    });
    innerAudioContext.onPlay(function () {
      console.log("onPlay被调用了")
      that.paused = false;
    });
    //当前音乐播放完毕  播放下一首或者第一首
    innerAudioContext.onEnded(() => {
      if (!that.recycled && that.playing < that.playList.length - 1) {
        that.playing++;
        innerAudioContext.src = that.playList[that.playing].src;
        innerAudioContext.title = that.playList[that.playing].name;
      } else if (that.recycled) {
        innerAudioContext.seek(0);
        innerAudioContext.src = that.playList[that.playing].src;
        innerAudioContext.title = that.playList[that.playing].name;
      } else if (!that.recycled && that.playing == that.playList.length - 1) {
        that.playing = 0;
        innerAudioContext.src = that.playList[that.playing].src;
        innerAudioContext.title = that.playList[that.playing].name;
      }
    });
  },
  onShow () {
    innerAudioContext.src = that.playList[that.playing].src;
    innerAudioContext.title = that.playList[that.playing].name;
    // 保持屏幕常亮
    uni.setKeepScreenOn({
      keepScreenOn: true
    });
  },
  methods: {
    //播放器控制相关
    last_song () {
      if (that.playing != 0) {
        that.playing--;
        innerAudioContext.src = that.playList[that.playing].src;
        innerAudioContext.title = that.playList[that.playing].name;
        innerAudioContext.play()
      }
    },
    next_song () {
      if (that.playing < that.playList.length - 1) {
        that.playing++;
        innerAudioContext.src = that.playList[that.playing].src;
        innerAudioContext.title = that.playList[that.playing].name;
        innerAudioContext.play()
      } else if (that.playing == that.playList.length - 1) {
        that.playing = 0;
        innerAudioContext.src = that.playList[that.playing].src;
        innerAudioContext.title = that.playList[that.playing].name;
        uni.pageScrollTo({
          scrollTop: 0
        });
      } else {
        console.log('do nothing ');
      }
    },
    //判断当前音乐播放状态 然后调用相应的方法
    pause () {

      if (this.paused) {
        innerAudioContext.play();
        console.log("play被调用了")
      } else {
        innerAudioContext.pause();
        console.log("pause被调用了")
      }

    },
    //循环相关
    loop () {
      // innerAudioContext.loop = !innerAudioContext.loop //loop属性为true时不会触发 onEnded()
      this.recycled = !that.recycled;
      if (that.recycled) {
        //弹出
        uni.showToast({
          icon: 'none',
          title: '开启循环'
        });
      } else {
        uni.showToast({
          icon: 'none',
          title: '关闭循环'
        })
      }
    },
    // 进度条相关
    progress_touch_start () {
      innerAudioContext.pause();
    },
    progress_touch_end (percent) {
      console.log('num :>> ', percent.detail.__args__[0]);
      let s = (percent.detail.__args__[0] / 100) * innerAudioContext.duration;
      //转换为十进制数
      innerAudioContext.seek(parseInt(s));
    },
    // 业务逻辑
    change_item (index) {
      // 当前点击的不是正在播放的
      if (that.playing != index) {
        innerAudioContext.src = that.playList[index].src;
        innerAudioContext.title = that.playList[index].name;
        this.paused = true;
        that.pause()
        that.playing = index;
        return
      } else {
        that.pause()
      }


    },
    // 点赞
    collecte (index) {
      that.playList[index].status = !that.playList[index].status;
    },
    time_format (second) {
      let m = Math.floor((second / 60) % 60) < 10 ? '0' + Math.floor((second / 60) % 60) : Math.floor((second / 60) % 60);
      let s = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60);
      return `${m}:${s}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  height: 100vh;
  width: 100%;
  background: rgb(221, 232, 250);

  .top_top {
    text-align: center;
    margin: 50rpx 0 50rpx 0;
    font-size: 10rpx;
  }

  .hand {
    display: flex;
    justify-content: center;

    .hand_icon {
      height: 50px;
      width: 50px;
      align-self: center;
      display: flex;
      align-content: center;
      justify-content: center;
      margin: 0 auto;
      border-radius: 50%;
	  //凸起小图标
	  // box-shadow: -10px -10px 15px 5px rgba(255,255,255,0.5),10px 10px 15px 5px rgba(70,70,70,0.12);
	  box-shadow: -5px -5px 15px 5px rgba(255, 255, 255, 0.7),
	  5px 5px 15px 5px rgba(0,0,0,0.12),
	  // inset -10px -10px 15px 5px rgba(70,70,70,0.12),
	  inset 0px 0px 10px 2px rgba(255,255,255,.75);
	  // inset 0px 0px 10px 2px #000000;
	  border:2px solid #dde8fa;
    }


    .hand_img {
      margin: 0 auto;
	  border-radius: 50%;
	  //凸起小图标
	  // box-shadow: -10px -10px 15px 5px rgba(255,255,255,0.5),10px 10px 15px 5px rgba(70,70,70,0.12);
	  box-shadow: -5px -5px 15px 5px rgba(255, 255, 255, 0.7),
	  5px 5px 15px 5px rgba(0,0,0,0.12),
	  // inset -10px -10px 15px 5px rgba(70,70,70,0.12),
	  inset 0px 0px 10px 2px rgba(255,255,255,.75);
	  // inset 0px 0px 10px 2px #000000;
	  border:2px solid #dde8fa;
	  
    }
	.ani{
		//头像旋转
		animation: rotation 5s linear infinite;
		}
		
  }
  .play-list-wrap {
    margin-top: 50rpx;
	.player{
		padding: 5px;
		// background-color: red;
		border-radius: 50%;
		//凸起小图标
		// box-shadow: -10px -10px 15px 5px rgba(255,255,255,0.5),10px 10px 15px 5px rgba(70,70,70,0.12);
	  box-shadow: -5px -5px 15px 5px rgba(255, 255, 255, 0.7),
	  5px 5px 15px 5px rgba(0,0,0,0.12),
	  // inset -10px -10px 15px 5px rgba(70,70,70,0.12),
	  inset 0px 0px 10px 2px rgba(255,255,255,.75);
	  // inset 0px 0px 10px 2px #000000;
	  border:2px solid #dde8fa;
		
	}
    //深度选择器
    .list ::v-deep .u-cell-item-box {
      background-color: #dde8fa;
    }
  }
  @keyframes rotation{
    from {
          transform: rotate(0deg);
      }
      to {
          transform: rotate(360deg);
      }
  }

}
</style>
