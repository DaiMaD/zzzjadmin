<template>
	<div class="wrapper">
		<!--分销管理-->
		<v-sidebar :slidebarData="slidebarData3"></v-sidebar>
		<v-tabs></v-tabs>
		<!--<div class="content" :class="{'content-collapse':collapse}">
			<transition name="move" mode="out-in">
				<router-view></router-view>
			</transition>
		</div>-->
	</div>
</template>

<script>
	import vSidebar from './Sidebar.vue';
	import vTabs from './Tabs3.vue';
	import bus from '../common/bus';
	export default {
		data() {
			return {
				collapse: false,
				slidebarData3: [{
					icon: 'el-icon-phone',
					index: 'fenxiao',
					title: '分销管理',
					subs: [{
						index: 'Distribution',
						title: '分销数据'
					},
					// {
					// 	index: 'Order',
					// 	title: '订单管理'
					// },
					{
						index: 'Partnercs',
						title: '合伙人管理'
					}
					]
				}]
			}
		},
		components: {
			vSidebar, vTabs
		},
		created() {
			bus.$on('collapse', msg => {
				this.collapse = msg;
			})
		}
	}
</script>
<style type="text/css">
	.el-menu--horizontal>.el-menu-item {
		width: 12%;
	}
</style>