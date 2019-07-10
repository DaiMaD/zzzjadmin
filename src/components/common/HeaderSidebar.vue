<template>
	<div class="headerSidebar">
		<h3 id="logo">真知灼见APP</h3>
		<el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#eeefef"
			text-color="#666" active-text-color="#20a0ff" unique-opened router mode="horizontal" @select="headselect">
			<template v-for="item in items" mode="horizontal">
				<!-- <template v-if="item.subss">
					<el-submenu :index="item.index" :key="item.index">
						<template slot="title">
							<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
						</template>
						<el-menu-item v-for="(subItem,index) in item.subs" :key="index" :index="subItem.index">
							{{ subItem.title }}
						</el-menu-item>
					</el-submenu>
				</template> -->
				<template>
					<!--v-else-->
					<el-menu-item :index="item.index" :key="item.index" class="defaultMenu2" :id="item.id">
						<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
		<div id="quanpingBtn" @click="handleFullScreen">
			<i class="iconfont vue-iconquanping"></i>
		</div>
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
	import { getRouteTree } from '../../api/api';
	export default {
		data() {
			return {
				onRoutes: '',
				collapse: false,
				items: [
				],
				fullscreen: false
			}
		},
		computed: {
		},
		created() {
			// 通过 Event Bus 进行组件间通信，来折叠侧边栏
			bus.$on('headernav', msg => {
				console.log(msg)
				console.log(msg.name)
				if (msg.name == null || msg.name == '') {
					alert('请登录')
					this.$router.push('/login');
				} else {
					localStorage.setItem('userlv', 'admin')
					getRouteTree().then(res => {
						this.items = res.data
					})
				}
			})
			bus.$on('topnav', msg => {
				console.log(msg)
				this.onRoutes = msg
			})
			// console.log(localStorage.getItem("userlv"))
			if (localStorage.getItem("userlv") == 'admin') {
				getRouteTree().then(res => {
					this.items = res.data
				})
			} else if (localStorage.getItem("userlv") == '' && localStorage.getItem("userlv") == null) {
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
		},
		mounted() {
			console.log(localStorage.getItem('ms_username'))
			if (localStorage.getItem('ms_username') === 'admin') {
				console.log('管理员权限')
				setTimeout(function () {
					var roleDom2 = document.getElementsByClassName('defaultMenu2');
					for (var i = 0; i < roleDom2.length; i++) {
						roleDom2[i].style.display = 'block';
						// roleDom2[i].innerHTML = 'block';
					}
				}, 300)
			} else {
				console.log('管理员权限2');
				var roleID = sessionStorage.getItem('userMenu').split(",");
				// console.log(roleID)
				setTimeout(function () {
					for (let i = roleID.length - 1; i >= 0; i--) {
						if (document.getElementById(roleID[i])) {
							document.getElementById(roleID[i]).classList.remove("defaultMenu2");
							console.log(document.getElementById(roleID[i]).classList)
						} else {
							console.log('没有id为' + roleID[i] + '的元素!')
						}
					}
				}, 300)

				var roleDom = document.getElementsByClassName('defaultMenu2')
				setTimeout(function () {
					for (let j = roleDom.length - 1; j >= 0; j--) {
						// roleDom[j].remove();
					}
				}, 300);
			}

		}
	}
</script>

<style scoped>
	.el-menu--horizontal {
		border-bottom: none;
	}

	.headerSidebar {
		height: 60px;
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

	#quanpingBtn {
		position: absolute;
		right: 100px;
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

	/* .sidebar-el-menu.el-menu--horizontal.el-menu .defaultMenu2 {
		display: none;
	} */
</style>