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
	import searchFor from '../page/ContentManagement/Class/searchFor.vue';
	import bus from '../common/bus';
	export default {
		data() {
			return {
				inputVisible: false,
				navPath: '',
				tabsVal: "searchFor",
				tabList: [
					{
						title: '热门搜索',
						name: 'searchFor',
						disabled: true,
						closable: false,
						component: searchFor
					}
				]
			}
		},
		methods: {
			closeTab(tag) {
				console.log(tag)
				console.log(this.tabList.indexOf(tag))
				var tabListName = []
				for (let i = 0; i < this.tabList.length; i++) {
					tabListName[i] = this.tabList[i].name;
				}
				console.log(tabListName)
				this.tabList.splice(tabListName.indexOf(tag), 1);
				this.tabsVal = "searchFor";
				this.$router.push("searchFor");
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
				if (name[name.length - 1] == 'searchFor') {
					titname = '热门搜索'
				} else if (name[name.length - 1] == 'Courier1') {
					titname = '套课列表'
				} else if (name[name.length - 1] == 'Courier2') {
					titname = '小节列表'
				} else if (name[name.length - 1] == 'Courier3') {
					titname = '套课分享'
				} else if (name[name.length - 1] == 'Category') {
					titname = '频道分类'
				} else if (name[name.length - 1] == 'Course') {
					titname = '大讲堂-课程列表'
				} else if (name[name.length - 1] == 'Categoryzj') {
					titname = '套课“灼见”'
				} else if (name[name.length - 1] == 'Sections') {
					titname = '大讲堂-小节列表'
				} else if (name[name.length - 1] == 'ClassComment') {
					titname = '课程留言'
				} else if (name[name.length - 1] == 'Courseshare') {
					titname = '大讲堂-课程分享'
				} else if (name[name.length - 1] == 'FMcourse') {
					titname = 'FM-课程列表'
				} else if (name[name.length - 1] == 'FMlist') {
					titname = 'FM-小节列表'
				} else if (name[name.length - 1] == 'FMshare') {
					titname = 'FM-课程分享'
				} else if (name[name.length - 1] == 'school1') {
					titname = '商学院-年费价格表'
				} else if (name[name.length - 1] == 'school2') {
					titname = '商学院-模块分类'
				} else if (name[name.length - 1] == 'school3') {
					titname = '商学院-课程列表'
				} else if (name[name.length - 1] == 'school4') {
					titname = '商学院-小节列表'
				} else if (name[name.length - 1] == 'school5') {
					titname = '商学院-课程分享'
				} else if (name[name.length - 1] == 'Classification') {
					titname = '读书解读分类'
				} else if (name[name.length - 1] == 'ReadingList') {
					titname = '图书列表'
				} else if (name[name.length - 1] == 'Label') {
					titname = '标签管理'
				} else if (name[name.length - 1] == 'ActivityCity') {
					titname = '活动城市'
				} else if (name[name.length - 1] == 'ActivityTicket') {
					titname = '活动门票'
				} else if (name[name.length - 1] == 'Activity') {
					titname = '活动列表'
				} else if (name[name.length - 1] == 'ActivityRegistrations') {
					titname = '报名列表'
				} else if (name[name.length - 1] == 'HomeBanner') {
					titname = '首页banner'
				} else if (name[name.length - 1] == 'InvitationPoster') {
					titname = '邀请海报'
				} else if (name[name.length - 1] == 'MineLB') {
					titname = '我的轮播图'
				} else if (name[name.length - 1] == 'CourseMarketing') {
					titname = '课程促销'
				} else if (name[name.length - 1] == 'contentpush') {
					titname = '内容发送'
				} else if (name[name.length - 1] == 'ChanPinMoKuai') {
					titname = '产品模块'
				} else if (name[name.length - 1] == 'ImgMedialibrary') {
					titname = '图片媒体库'
				} else if (name[name.length - 1] == 'AudioMedialibrary') {
					titname = '音频媒体库'
				} else if (name[name.length - 1] == 'ModuleSettings') {
					titname = '模块设置'
				} else if (name[name.length - 1] == 'CourseSettings') {
					titname = '课程设置'
				}
				if (this.tabList.filter(f => f.name == name[name.length - 1]) == 0) {
					var component = resolve => require([`../page/ContentManagement/${name[0]}/${name[name.length - 1]}`], resolve)
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