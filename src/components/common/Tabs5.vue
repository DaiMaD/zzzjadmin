<template>
	<div id="tabs">
		<el-tabs type="card" v-model="tabsVal" @tab-remove="closeTab" @tab-click="tabclick">
			<el-tab-pane v-for="item in tabList" :key="item.name" :name="item.name" :label="item.title"
				:closable="item.closable">
				<component :is="item.component"></component>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import CourseOrder from '../page/OrderManagement/CourseOrder/CourseOrder';
	import bus from '../common/bus';
	export default {
		data() {
			return {
				inputVisible: false,
				navPath: '',
				tabsVal: "CourseOrder",
				tabList: [
					{
						title: '课程订单',
						name: 'CourseOrder',
						disabled: true,
						closable: false,
						component: CourseOrder
					}
				]
			}
		},
		methods: {
			closeTab(tag) {
				this.tabList.splice(this.tabList.indexOf(tag), 1);
				this.tabsVal = "CourseOrder";
				this.$router.push("CourseOrder");
			},
			tabclick(val) {
				console.log(val)
				this.$router.push(val.name);
			}
		},
		mounted() {
			bus.$on('navPath', (name, val) => {//处理传过来的值
				console.log(name)
				var titname;
				if (name[name.length - 1] == 'ActiveOrders') {
					titname = '活动订单'
				} else if (name[name.length - 1] == 'CourseOrder') {
					titname = '课程订单'
				} else if (name[name.length - 1] == 'AskForIncome') {
					titname = '提现申请'
				} else if (name[name.length - 1] == 'IncomeDetails') {
					titname = '收益明细'
				}
				if (this.tabList.filter(f => f.name == name[name.length - 1]) == 0) {
					var component = resolve => require([`../page/OrderManagement/${name[1]}/${name[name.length - 1]}`], resolve)//合伙人管理
					this.tabList.push({
						title: titname,
						name: name[name.length - 1],
						disabled: false,
						closable: true,
						component: component
					})
				}
				this.tabsVal = name[name.length - 1]
			});
		}
	}
</script>

<style scoped>
	#tabs {
		position: fixed;
		right: calc(2vw - 2px);
		top: 100px;
		z-index: 5;
		width: calc(96% - 189px);
		height: 38px;
		background: #f0f0f0;
		border-bottom: 4px solid #ccc;
		border-top: 4px solid #ccc;
	}

	.el-tag {
		margin: 3px;
	}
</style>