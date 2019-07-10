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
	import Testpaperentryshenpi from '../page/Testpaperentry/Testpaperentryshenpi';
	import bus from '../common/bus';
	export default {
		data() {
			return {
				inputVisible: false,
				navPath: '',
				tabsVal: "Testpaperentryshenpi",
				tabList: [
					{
						title: '考试管理',
						name: 'Testpaperentryshenpi',
						disabled: true,
						closable: false,
						component: Testpaperentryshenpi
					}
				]
			}
		},
		methods: {
			closeTab(tag) {
				this.tabList.splice(this.tabList.indexOf(tag), 1);
				this.tabsVal = "Testpaperentryshenpi";
				this.$router.push("Testpaperentryshenpi");
			},
			tabclick(val) {
				console.log(val)
				this.$router.push(val.name);
			}
		},
		mounted() {
			bus.$on('navPath', (name, val) => {//处理传过来的值
				var titname;
				if (name[name.length - 1] == 'Testpaperentryshenpi') {
					titname = '考试管理'
				} else if (name[name.length - 1] == 'Testpaperentryyulan') {
					titname = '试卷预览'
				} else if (name[name.length - 1] == 'Testpaperentrypigai') {
					titname = '试卷批改'
				} else if (name[name.length - 1] == 'Testpaperentrksbm') {
					titname = '考试报名'
				} else if (name[name.length - 1] == 'Testpaperentrjgcx') {
					titname = '考试结果查询'
				} else if (name[name.length - 1] == 'Testpaperentryxz') {
					titname = '题库-选择题'
				} else if (name[name.length - 1] == 'Testpaperentrypd') {
					titname = '题库-判断题'
				} else if (name[name.length - 1] == 'Testpaperentryjd') {
					titname = '题库-简答题'
				} else if (name[name.length - 1] == 'Testpaperentryzh') {
					titname = '题库-综合题'
				}
				if (this.tabList.filter(f => f.name == name[name.length - 1]) == 0) {
					var component = resolve => require([`../page/Testpaperentry/${name[name.length - 1]}`], resolve)//合伙人管理
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