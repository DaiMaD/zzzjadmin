<template>
	<div class="wrapper">
		<!--订单管理-->
		<v-sidebar :slidebarData="slidebarData5"></v-sidebar>
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
	import vTabs from './Tabs5.vue';
	export default {
		data() {
			return {
				collapse: false,
				slidebarData5: [{
					icon: 'el-icon-star-on',
					index: '5',
					title: '订单管理',
					subs: [{
						index: 'CourseOrder',
						title: '课程订单'
					},
					{
						index: 'ActiveOrders',
						title: '活动订单'
					},
					{
						index: 'WithdrawManage',
						title: '提现管理',
						subs: [
							{
								index: 'IncomeDetails',
								title: '收益明细'
							},
							{
								index: 'AskForIncome',
								title: '提现申请'

							}
						]
					}
					]
				}],
				// slidebarData5: []
			}
		},
		components: {
			vSidebar, vTabs
		},
		created() {
			var _this = this;
			bus.$on('collapse', msg => {
				this.collapse = msg;
			})
			// this.$axios.get(
			// 	'https://www.easy-mock.com/mock/5cbfb7b171c9ad5836c9beab/vuehoutai/getAllRoute'
			// )
			// 	.then(res => {
			// 		console.log(res.data);
			// 		for (let i = 0; i < res.data.length; i++) {
			// 			if (res.data[i].id == 4) {
			// 				// console.log(res.data[i]);
			// 				_this.slidebarData5.push(res.data[i])
			// 				console.log(_this.slidebarData5);

			// 			}
			// 		}
			// 	})
		}
	}
</script>
<style type="text/css">
	.el-menu--horizontal>.el-menu-item {
		width: 12%;
	}
</style>