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
	import Distribution from '../page/Distribution/Distribution';
	import bus from '../common/bus';
	export default {
		data() {
			return {
				inputVisible: false,
				navPath: '',
				tabsVal: "Distribution",
				tabList: [
					{
						title: '分销数据',
						name: 'Distribution',
						disabled: true,
						closable: false,
						component: Distribution
					}
				]
			}
		},
		methods: {
			closeTab(tag) {
				console.log(tag)
				this.tabList.splice(this.tabList.indexOf(tag), 1);
				this.tabsVal = "Distribution";
				this.$router.push("Distribution");
			},
			tabclick(val) {
				console.log(val)
				this.$router.push(val.name);
			}
		},
		mounted() {
			bus.$on('navPath', (name, val) => {//处理传过来的值
				var titname;
				if (name[1] == 'Distribution') {
					titname = '分销数据'
				} else if (name[1] == 'Order') {
					titname = '订单管理'
				} else if (name[1] == 'Partnercs') {
					titname = '合伙人管理'
				}
				if (this.tabList.filter(f => f.name == name[1]) == 0) {
					var component = resolve => require([`../page/Distribution/${name[1]}`], resolve)//合伙人管理
					this.tabList.push({
						title: titname,
						name: name[1],
						disabled: false,
						closable: true,
						component: component
					})
				}
				this.tabsVal = name[1]
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