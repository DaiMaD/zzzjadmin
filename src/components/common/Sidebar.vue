<template>
	<div class="sidebar">
		<el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#eeefef"
			text-color="#666" active-text-color="#20a0ff" unique-opened router @select="addTab">

			<!-- 一级菜单 -->
			<template v-for="item in slidebarData">
				<el-submenu v-if="item.subs && item.subs.length" :index="item.index" :key="item.index" class="defaultMenu"
					:id="item.id">
					<template slot="title"><i :class="item.icon"></i><span>{{item.title}}</span></template>

					<!-- 二级菜单 -->
					<template v-for="itemChild in item.subs">
						<el-submenu v-if="itemChild.subs && itemChild.subs.length" :index="itemChild.index" :key="itemChild.index"
							class="erji defaultMenu" :id="itemChild.id">
							<template slot="title"><i :class="itemChild.icon"></i><span>{{itemChild.title}}</span></template>

							<!-- 三级菜单 -->
							<el-menu-item v-for="itemChild_Child in itemChild.subs" :index="itemChild_Child.index"
								:key="itemChild_Child.index" class="defaultMenu" :id="itemChild_Child.id">
								<span slot="title">{{itemChild_Child.title}}</span>
							</el-menu-item>
						</el-submenu>

						<el-menu-item class="erji defaultMenu" :id="itemChild.id" v-else :index="itemChild.index"
							:key="itemChild.index"><span slot="title">{{itemChild.title}}</span>
						</el-menu-item>
					</template>
				</el-submenu>

				<el-menu-item v-else :index="item.index" :key="item.index" :id="item.id" class="defaultMenu"><span
						slot="title">{{item.title}}</span></el-menu-item>
			</template>

		</el-menu>
	</div>
</template>

<script>
	import bus from '../common/bus';
	export default {
		props: ["slidebarData"],
		data() {
			return {
				collapse: false
			}
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
		},
		created() {
			// 通过 Event Bus 进行组件间通信，来折叠侧边栏
			bus.$on('collapse', msg => {
				this.collapse = msg;
			})
		},
		methods: {
			addTab(key, keyPath) {
				console.log(key, keyPath)
				bus.$emit('navPath', keyPath)
			}
		},
		mounted() {
			// console.log(this.slidebarData)
			// for (let i = 0; i < this.slidebarData.length; i++) {
			// 	console.log(this.slidebarData[i].index)
			// }
			var self = this;
			bus.$emit('topnav', this.$route.matched[0].path);
			if (localStorage.getItem('ms_username') == 'admin') {
				setTimeout(function () {
					var roleDom = document.getElementsByClassName('defaultMenu');
					// console.log(roleDom)
					for (let i = 0; i < roleDom.length; i++) {
						roleDom[i].style.display = 'block';
					}
				}, 300);
			} else {
				var roleID = sessionStorage.getItem('userMenu').split(",");;
				for (let i = 0; i < roleID.length; i++) {
					setTimeout(function () {
						if (document.getElementById(roleID[i])) {
							document.getElementById(roleID[i]).style.display = 'block';
							document.getElementById(roleID[i]).classList.remove("defaultMenu");
						} else {
							// console.log('没有id为' + roleID[i] + '的元素')
						}
					}, 300)
				}
				var roleDom = document.getElementsByClassName('defaultMenu')
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
	.sidebar {
		display: block;
		position: absolute;
		left: calc(2vw - -3px);
		top: 100px;
		bottom: 0;
	}

	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 200px;
	}

	.sidebar-el-menu .el-submenu__title {
		width: 180px;
	}

	.sidebar>ul {
		height: 100%;
		overflow: scroll;
		overflow-x: hidden;
	}

	.sidebar>ul::-webkit-scrollbar {
		display: none;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}

	/*.sidebar>.sidebar-el-menu>.el-submenu .el-submenu__title{
		font-size: 16px !important;
	}*/


	/* 一级菜单选中open字体颜色 */
	/* .sidebar>.el-submenu.is-active.is-opened>.el-submenu__title>span { 
		color: #2d8cf0 !important;
	} */





	.sidebar>.sidebar-el-menu>.el-menu-item span {
		/*左侧菜单栏一级标题大小16px*/
		font-size: 16px !important;
	}



	.is-opened .el-submenu__title {
		/* 左侧菜单栏一级菜单展开背景色 在main.css的168行*/
		user-select: auto
	}

	.sidebar>.sidebar-el-menu>.el-submenu>.el-menu>.erji>.el-submenu__title {
		/*左侧菜单栏二级菜单栏文字大小14px*/
		font-size: 14px !important;
	}

	.sidebar>.sidebar-el-menu>.el-submenu>.el-menu>.el-menu-item {
		/*左侧菜单栏二级菜单栏文字大小14px*/
		font-size: 14px !important;
	}

	.sidebar>.sidebar-el-menu>.el-submenu>.el-menu>.erji>.el-menu>.el-menu-item>span {
		/*三级菜单文字大小*/
		font-size: 14px !important;
	}


	.defaultMenu {
		display: none;
	}
</style>