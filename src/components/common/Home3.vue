<template>
	<div class="wrapper">
		<!--分销管理-->
		<v-sidebar :slidebarData="slidebarData3" v-if="slidebarData3.length>0"></v-sidebar>
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
	import { getRouteTree } from '../../api/api';
	export default {
		data() {
			return {
				collapse: false,
				// slidebarData3: [
				// 	{
				// 		create_time: 1562117582882,
				// 		icon: "el-icon-phone",
				// 		id: 37,
				// 		index: "Distribution",
				// 		menu_type: 2,
				// 		parent_menu_id: 36,
				// 		subs: [],
				// 		title: "分销数据",
				// 		update_time: 1562117582882
				// 	},
				// 	{
				// 		create_time: 1562117666195,
				// 		icon: "el-icon-phone",
				// 		id: 39,
				// 		index: "Partnercs",
				// 		menu_type: 2,
				// 		parent_menu_id: 36,
				// 		subs: [],
				// 		title: "合伙人管理",
				// 		update_time: 1562117666195
				// 	}
				// ],
				slidebarData3: [],
				id: +new Date()
			}
		},
		components: {
			vSidebar, vTabs
		},
		created() {
			getRouteTree().then(res => {
				this.slidebarData3 = res.data[1].subs;
				console.log(res.data[1].subs)
			})
			bus.$on('collapse', msg => {
				this.collapse = msg;
			})
		},
		mounted() {
		},
	}
</script>
<style type="text/css">
	.el-menu--horizontal>.el-menu-item {
		width: 12%;
	}
</style>