<template>
	<div class="wrapper">
		<!--订单管理-->
		<v-sidebar :slidebarData="slidebarData5" v-if="slidebarData5.length>0"></v-sidebar>
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
	import bus from '../common/bus';
	import { getRouteTree } from '../../api/api';
	import vTabs from './Tabs5.vue';
	export default {
		data() {
			return {
				collapse: false,
				slidebarData5: []
			}
		},
		components: {
			vSidebar, vTabs
		},
		created() {
			getRouteTree().then(res => {
				this.slidebarData5 = res.data[3].subs;
			})
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