<template>
	<view class="wrap">
		<!-- <view class="top"></view> -->
		<view class="content">
			<view class="title">
				欢迎登录
			</view>
			<u-input v-model="loginName" :type="type" class="input" placeholder="请输入账号" :border="border" input-align='center'/>
			<view class="center">
				<u-button class="custom-style" shape="square" size="mini" :ripple="true" @click="onLogin">点击即可登录</u-button>
			</view>
		</view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>

</template>

<script>
	export default {
		data() {
			return {
				loginName: '1'
			};
		},
		methods: {
			onLogin() {
				if (this.loginName !== '') {
					this.$refs.uToast.show({
						title: '登录成功',
						type: 'success',
						url: '/pages/music/music'
					})
					// 	uni.navigateTo({
					// 		url: '../music/music'
					// })
				} else {
					this.$refs.uToast.show({
						title: '登录失败',
						type: 'error',
					})
				}

			}

		},
	}
</script>

<style lang="scss" scoped>
	.wrap {
		overflow: hidden;
		font-size: 28rpx;
		background-color: #efeff4;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: center;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			.input {
				// text-align: center;
				margin-bottom: 100rpx;
				padding-bottom: 6rpx;
			}

			.center {
				display: flex;
				justify-content: center;
				align-content: center;
			}

			.custom-style {
				text-align: center;
				color: #000000;
				width: 300rpx;
				height: 100rpx;
			}
		}
	}
</style>
