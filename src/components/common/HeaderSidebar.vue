<template>
	<div class="headerSidebar">
		<h3 id="logo" @click="handleFullScreen">真知灼见APP</h3>
		<el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#eeefef"
			text-color="#666" active-text-color="#20a0ff" unique-opened router mode="horizontal" @select="headselect">
			<template v-for="item in items" mode="horizontal">
				<template v-if="item.subs">
					<el-submenu :index="item.index" :key="item.index">
						<template slot="title">
							<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
						</template>
						<el-menu-item v-for="(subItem,index) in item.subs" :key="index" :index="subItem.index">
							{{ subItem.title }}
						</el-menu-item>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
		<div id="userAdmin">
			<el-dropdown trigger="click" @command="handleCommand">
				<span class="el-dropdown-link">
					<i class="el-icon-setting"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="loginout">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>

	</div>
</template>

<script>
	import bus from '../common/bus';
	export default {
		data() {
			return {
				onRoutes: '',
				collapse: false,
				items: [
					{
						icon: 'el-icon-news',
						index: '/home2',
						title: '内容管理'
					},
					//分销管理
					{
						icon: 'el-icon-phone',
						index: '/home3',
						title: '分销管理'
					},
					{
						icon: 'el-icon-edit',
						index: '/home4',
						title: '考试管理',
					},
					//订单管理
					{
						icon: 'el-icon-star-on',
						index: '/home5',
						title: '订单管理'
					},
					//用户管理
					{
						icon: 'el-icon-rank',
						index: '/home6',
						title: '用户管理'
					},
					{
						icon: 'el-icon-warning',
						index: '/home7',
						title: '系统管理'
					}],
				fullscreen: false
			}
		},
		computed: {
		},
		created() {
			// 通过 Event Bus 进行组件间通信，来折叠侧边栏
			bus.$on('headernav', msg => {
				console.log(msg)
				// if (msg.name == 'admin') {
				// 	localStorage.setItem('userlv', 'admin')
				// 	this.$axios.get('https://www.easy-mock.com/mock/5cbfb7b171c9ad5836c9beab/vuehoutai/getHeadeslide').then(res => {
				// 		this.items = res.data
				// 	})
				// } else if (msg.name == 'admin2') {
				// 	localStorage.setItem('userlv', 'admin2')
				// 	this.$axios.get('https://www.easy-mock.com/mock/5cbfb7b171c9ad5836c9beab/vuehoutai/getHeadneirongData').then(res => {
				// 		this.items = res.data
				// 	})
				// } else
				if (msg.name == '' || JSON.parse(localStorage.getItem("user")).name == null) {
					alert('请登录')
					this.$router.push('/login');
				}
			})
			bus.$on('topnav', msg => {
				console.log(msg)
				this.onRoutes = msg
			})
			//			console.log(localStorage.getItem("userlv"))
			// if (localStorage.getItem("userlv") == 'admin') {
			// 	this.$axios.get('https://www.easy-mock.com/mock/5cbfb7b171c9ad5836c9beab/vuehoutai/getHeadeslide	').then(res => {
			// 		this.items = res.data
			// 	})
			// } else if (localStorage.getItem("userlv") == 'admin2') {
			// 	this.$axios.get('https://www.easy-mock.com/mock/5cbfb7b171c9ad5836c9beab/vuehoutai/getHeadneirongData').then(res => {
			// 		this.items = res.data
			// 	})
			// } else 
			if (localStorage.getItem("userlv") == '' && localStorage.getItem("userlv") == null) {
				alert('请登录')
				this.$router.push('/login');
			}


		},
		methods: {
			handleCommand(command) {
				if (command == 'loginout') {
					localStorage.removeItem('ms_username')
					this.$router.push('/login');
				}
			},
			headselect() {
				console.log(this.$route)
			},
			handleFullScreen() {
				let element = document.documentElement;
				if (this.fullscreen) {
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen();
					}
				} else {
					if (element.requestFullscreen) {
						element.requestFullscreen();
					} else if (element.webkitRequestFullScreen) {
						element.webkitRequestFullScreen();
					} else if (element.mozRequestFullScreen) {
						element.mozRequestFullScreen();
					} else if (element.msRequestFullscreen) {
						// IE11
						element.msRequestFullscreen();
					}
				}
				this.fullscreen = !this.fullscreen;
			}
		}
	}
</script>

<style scoped>
	.el-menu--horizontal {
		border-bottom: none;
	}

	.headerSidebar {
		position: fixed;
		left: 50%;
		top: 15px;
		transform: translateX(-50%);
		z-index: 5;
		width: 96%;
		overflow: hidden;
		/*bottom: 0;*/
		background: #eeefef;
		border-radius: 5px;
		border: 1px solid #dedede;
	}

	/*.sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }*/

	.headerSidebar>ul {
		height: 100%;
		left: 200px;
		width: 80%;
	}

	.el-menu--horizontal>.el-menu-item {
		min-width: 160px;
		text-align: center;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
		text-align: center;
	}

	#logo {
		position: absolute;
		color: #666;
		width: 180px;
		height: 100%;
		line-height: 60px;
		text-align: center;
		/*background: rgb(55, 113, 231);*/
	}

	#userAdmin {
		position: absolute;
		right: 50px;
		top: 50%;
		transform: translateY(-50%);
		width: 30px;
		height: 30px;
		cursor: pointer;
	}

	.el-icon-setting {
		font-size: 24px;
		color: #666;
	}

	.headerSidebar .el-menu--horizontal li {
		font-size: 18px !important;
		text-align: center;
	}

	.headerSidebar .el-menu--horizontal .is-active {
		background: rgb(190, 191, 191) !important;
		border: none !important;
		color: #000 !important;
	}
</style>