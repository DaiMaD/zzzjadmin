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
	import AdministratorList from '../page/SystemManagement/AdministratorList/AdministratorList';
	import bus from '../common/bus';
	export default {
		data() {
			return {
				inputVisible: false,
				navPath: '',
				tabsVal: "AdministratorList",
				tabList: [
					{
						title: '管理员列表',
						name: 'AdministratorList',
						disabled: true,
						closable: false,
						component: AdministratorList
					}
				]
			}
		},
		methods: {
			closeTab(tag) {
				this.tabList.splice(this.tabList.indexOf(tag), 1);
				this.tabsVal = "AdministratorList";
				this.$router.push("AdministratorList");
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
				if (name[1] == 'AdministratorList') {
					titname = '管理员列表'
				} else if (name[1] == 'Help') {
					titname = '帮助信息'
				} else if (name[1] == 'AdministratorList2') {
					titname = '管理员列表2'
				} else if (name[1] == 'UpdateHistory') {
					titname = '版本更新'
				}
				if (this.tabList.filter(f => f.name == name[1]) == 0) {
					var component = resolve => require([`../page/SystemManagement/${name[1]}/${name[1]}`], resolve)//合伙人管理
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