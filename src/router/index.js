import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const home = resolve => require(['../components/common/Home'], resolve)
//  const login = resolve => require(['pageView/demo'], resolve)  
const home2 = resolve => require(['../components/common/Home2'], resolve)
const home3 = resolve => require(['../components/common/Home3'], resolve)
const home4 = resolve => require(['../components/common/Home4'], resolve)
const home5 = resolve => require(['../components/common/Home5'], resolve)
const home6 = resolve => require(['../components/common/Home6'], resolve)
const home7 = resolve => require(['../components/common/Home7'], resolve)
const login = relative => require(['pageView/Login'], relative)

// ----------------内容管理---------------------
const Category = resolve => require(['pageView/ContentManagement/LectureContents/Category'], resolve) //大讲堂
const Categoryzj = resolve => require(['pageView/ContentManagement/LectureContents/Categoryzj'], resolve)
const Course = resolve => require(['pageView/ContentManagement/LectureContents/Course'], resolve)
const Sections = resolve => require(['pageView/ContentManagement/LectureContents/Sections'], resolve)
const ClassComment = resolve => require(['pageView/ContentManagement/LectureContents/ClassComment'], resolve)
const Courseshare = resolve => require(['pageView/ContentManagement/LectureContents/Courseshare'], resolve)

const FMcourse = resolve => require(['pageView/ContentManagement/FMClass/FMcourse'], resolve) //FM音频课程
const FMlist = resolve => require(['pageView/ContentManagement/FMClass/FMlist'], resolve)
const FMshare = resolve => require(['pageView/ContentManagement/FMClass/FMshare'], resolve)

const Courier1 = resolve => require(['pageView/ContentManagement/Class/Courier1'], resolve) //上课-套课列表
const Courier2 = resolve => require(['pageView/ContentManagement/Class/Courier2'], resolve)
const Courier3 = resolve => require(['pageView/ContentManagement/Class/Courier3'], resolve)
const searchFor = resolve => require(['pageView/ContentManagement/Class/searchFor'], resolve)

const school1 = resolve => require(['pageView/ContentManagement/School/school1'], resolve) //商学院课程
const school2 = resolve => require(['pageView/ContentManagement/School/school2'], resolve)
const school3 = resolve => require(['pageView/ContentManagement/School/school3'], resolve)
const school4 = resolve => require(['pageView/ContentManagement/School/school4'], resolve)
const school5 = resolve => require(['pageView/ContentManagement/School/school5'], resolve)

const ReadingList = resolve => require(['pageView/ContentManagement/Reading/ReadingList'], resolve) //读书
const Classification = resolve => require(['pageView/ContentManagement/Reading/Classification'], resolve)

const label = resolve => require(['pageView/ContentManagement/LabelManagement/Label'], resolve) //标签管理

const ImgMedialibrary = resolve => require(['pageView/ContentManagement/Medialibrary/ImgMedialibrary'], resolve) //媒体库--图片
const AudioMedialibrary = resolve => require(['pageView/ContentManagement/Medialibrary/AudioMedialibrary'], resolve) //媒体库--音频

const ActivityCity = resolve => require(['pageView/ContentManagement/ActivityManageMent/ActivityCity'], resolve) //活动管理
const ActivityTicket = resolve => require(['pageView/ContentManagement/ActivityManageMent/ActivityTicket'], resolve)
const ActivityRegistrations = resolve => require(['pageView/ContentManagement/ActivityManageMent/ActivityRegistrations'], resolve)
const Activity = resolve => require(['pageView/ContentManagement/ActivityManageMent/Activity'], resolve)

const HomeBanner = resolve => require(['pageView/ContentManagement/PromotionManagement/HomeBanner'], resolve) //推广管理
const InvitationPoster = resolve => require(['pageView/ContentManagement/PromotionManagement/InvitationPoster'], resolve)
const MineLB = resolve => require(['pageView/ContentManagement/PromotionManagement/MineLB.vue'], resolve)
const CourseMarketing = resolve => require(['pageView/ContentManagement/PromotionManagement/CourseMarketing.vue'], resolve)

const contentpush = resolve => require(['pageView/ContentManagement/PushManagement/contentpush'], resolve) //推送

const ChanPinMoKuai = resolve => require(['pageView/ContentManagement/ChanPinMoKuai/ChanPinMoKuai'], resolve) // 产品模块管理

const ModuleSettings = resolve => require(['pageView/ContentManagement/IntegralMall/ModuleSettings'], resolve) // 积分兑换--模块设置
const CourseDesign = resolve => require(['pageView/ContentManagement/IntegralMall/CourseDesign'], resolve) // 积分兑换--课程设置





// ----------------订单管理---------------------
const CourseOrder = resolve => require(['pageView/OrderManagement/CourseOrder/CourseOrder'], resolve) //订单管理
const ActiveOrders = resolve => require(['pageView/OrderManagement/ActiveOrders/ActiveOrders'], resolve)
const AskForIncome = resolve => require(['pageView/OrderManagement/WithdrawManage/AskForIncome'], resolve) //提现管理--提现申请
const IncomeDetails = resolve => require(['pageView/OrderManagement/WithdrawManage/IncomeDetails'], resolve) //提现管理--收入明细
const InvoiceOrder = resolve => require(['pageView/OrderManagement/InvoiceOrder/InvoiceOrder'], resolve) //？发票订单
const Invoice = resolve => require(['pageView/OrderManagement/Invoice/Invoice'], resolve) //？发票信息


// ----------------用户管理---------------------
const UserList = resolve => require(['pageView/UserManagement/UserList/UserList'], resolve) //用户管理
const Collection = resolve => require(['pageView/UserManagement/Collection/Collection'], resolve)
const WxUsers = resolve => require(['pageView/UserManagement/WxUsers/WxUsers'], resolve)
const Partner = resolve => require(['pageView/UserManagement/Partner/Partner'], resolve)

// 系统管理
const AdministratorList = resolve => require(['pageView/SystemManagement/AdministratorList/AdministratorList'], resolve) //系统管理
const AdministratorList2 = resolve => require(['pageView/SystemManagement/AdministratorList2/AdministratorList2'], resolve) //系统管理
const Help = resolve => require(['pageView/SystemManagement/Help/Help'], resolve)
const UpdateHistory = resolve => require(['pageView/SystemManagement/UpdateHistory/UpdateHistory'], resolve)

//分销管理
const Distribution = resolve => require(['pageView/Distribution/Distribution'], resolve) //分销数据
const Order = resolve => require(['pageView/Distribution/Order'], resolve) //订单管理
const Partnercs = resolve => require(['pageView/Distribution/Partnercs'], resolve) //合伙人管理
const CardCoupon = resolve => require(['pageView/Distribution/CardCoupon'], resolve) //卡券管理

//考试系统
const Testpaperentry_xz = resolve => require(['pageView/Testpaperentry/Testpaperentryxz'], resolve) //选择题
const Testpaperentry_pd = resolve => require(['pageView/Testpaperentry/Testpaperentrypd'], resolve) //判断题
const Testpaperentry_jd = resolve => require(['pageView/Testpaperentry/Testpaperentryjd'], resolve) //判断题
const Testpaperentry_zh = resolve => require(['pageView/Testpaperentry/Testpaperentryzh'], resolve) //判断题
const Testpaperentry_shenpi = resolve => require(['pageView/Testpaperentry/Testpaperentryshenpi'], resolve) //阅卷审批
const Testpaperentry_yulan = resolve => require(['pageView/Testpaperentry/Testpaperentryyulan'], resolve) //阅卷审批
const Testpaperentry_pigai = resolve => require(['pageView/Testpaperentry/Testpaperentrypigai'], resolve) //阅卷批改
const Testpaperentrksbm = resolve => require(['pageView/Testpaperentry/Testpaperentrksbm'], resolve) //学籍管理-考试报名
const Testpaperentrjgcx = resolve => require(['pageView/Testpaperentry/Testpaperentrjgcx'], resolve) //学籍管理-学籍管理

const constRouterMap = [{
	path: '/',
	redirect: '/login'
},
{
	path: '/login',
	component: login, //登录页
},
{
	path: '/home',
	component: home, //主页面
	children: [

	]
},
{
	path: '/home2',
	component: home2, //内容管理
	children: [{
		path: '/home2',
		redirect: '/searchFor' //重定向到课程分类页
	}, {
		path: '/category', //讲堂内容--课程分类
		component: Category
	}, {
		path: '/Courier1', //上课--今日真知速递--套课列表
		component: Courier1
	}, {
		path: '/Courier2', //上课--今日真知速递--小节列表
		component: Courier2
	}, {
		path: '/Courier3', //上课--今日真知速递--套课分享
		component: Courier3
	}, {
		path: '/searchFor', //上课--热门搜索
		component: searchFor
	}, {
		path: '/categoryzj', //讲堂内容--灼见
		component: Categoryzj
	}, {
		path: '/course', //讲堂内容--课程列表
		component: Course
	}, {
		path: '/Courseshare', //讲堂内容--课程列表分享
		component: Courseshare
	}, {
		path: '/Sections', //讲堂内容--小节列表  // vue-datasource组件
		component: Sections
	}, {
		path: '/classComment', //讲堂内容--课程留言
		component: ClassComment
	}, {
		path: '/FMcourse', //FM音频课程--课程列表
		component: FMcourse
	}, {
		path: '/FMlist', //FM音频课程--小节列表
		component: FMlist
	}, {
		path: '/FMshare', //FM音频课程--小节列表
		component: FMshare
	}, {
		path: '/school1', //商学院课程--年费价格表
		component: school1
	}, {
		path: '/school2', //商学院课程--商学院分类
		component: school2
	}, {
		path: '/school3', //商学院课程--商学院课程列表
		component: school3
	}, {
		path: '/school4', //商学院课程--商学院城市列表
		component: school4
	}, {
		path: '/school5', //商学院分享课程--商学院城市列表
		component: school5
	}, {
		path: '/Classification', //读书-分类
		component: Classification
	}, {
		path: '/ReadingList', //读书-图书列表
		component: ReadingList
	}, {
		path: '/label', //标签管理
		component: label
	}, {
		path: '/ImgMedialibrary', //媒体库
		component: ImgMedialibrary
	}, {
		path: '/AudioMedialibrary', //媒体库
		component: AudioMedialibrary
	}, {
		path: '/activityCity', //活动城市
		component: ActivityCity
	}, {
		path: '/activityTicket', //活动门票
		component: ActivityTicket
	}, {
		path: '/ActivityRegistrations', //报名列表
		component: ActivityRegistrations
	}, {
		path: '/activity', //活动列表
		component: Activity
	}, {
		path: '/homeBanner', //首页轮播图
		component: HomeBanner
	}, {
		path: '/InvitationPoster', //首页轮播图
		component: InvitationPoster
	}, {
		path: '/MineLB',
		component: MineLB
	}, {
		path: '/CourseMarketing',
		component: CourseMarketing
	}, {
		path: '/contentpush', //推送
		component: contentpush
	}, {
		path: '/ChanPinMoKuai', //产品模块管理
		component: ChanPinMoKuai
	}, {
		path: '/ModuleSettings', //积分兑换--模块设置
		component: ModuleSettings
	}, {
		path: '/CourseDesign', //积分兑换--课程设置
		component: CourseDesign
	}]
},
{
	path: '/home3',
	component: home3, //分销管理
	children: [{
		path: '/',
		redirect: '/Distribution' //重定向到分销数据
	},
	{
		path: '/Distribution', //分销数据
		component: Distribution
	}, {
		path: '/Order', //订单管理
		component: Order
	}, {
		path: '/Partnercs', //合伙人管理
		component: Partnercs
	}, {
		path: '/CardCoupon', //卡券管理
		component: CardCoupon
	}
	]
},
{
	path: '/home4',
	component: home4, //考试管理
	children: [{
		path: '/',
		redirect: '/Testpaperentryshenpi' //重定向到课程分类页
	}, {
		path: '/Testpaperentryxz', //选择题
		component: Testpaperentry_xz
	}, {
		path: '/Testpaperentrypd', //判断
		component: Testpaperentry_pd
	}, {
		path: '/Testpaperentryjd', //简答
		component: Testpaperentry_jd
	}, {
		path: '/Testpaperentryzh', //中和
		component: Testpaperentry_zh
	}, {
		path: '/Testpaperentryshenpi', //中和
		component: Testpaperentry_shenpi
	}, {
		path: '/Testpaperentryyulan', //中和
		component: Testpaperentry_yulan
	}, {
		path: '/Testpaperentrypigai', //批改
		component: Testpaperentry_pigai
	}, {
		path: '/Testpaperentrksbm', //报名
		component: Testpaperentrksbm
	}, {
		path: '/Testpaperentrjgcx', //结果查询
		component: Testpaperentrjgcx
	}]
},
{
	path: '/home5',
	component: home5, //订单管理
	children: [{
		path: '/',
		redirect: '/CourseOrder' //重定向到课程订单
	}, {
		path: '/courseOrder', //课程订单
		component: CourseOrder
	}, {
		path: '/ActiveOrders', //活动订单
		component: ActiveOrders
	}, {
		path: '/invoiceOrder', //发票订单
		component: InvoiceOrder
	}, {
		path: '/invoice', //发票信息
		component: Invoice
	}, {
		path: '/Partner', //合伙人列表
		component: Partner
	}, {
		path: '/AskForIncome', //提现管理--提现申请
		component: AskForIncome
	}, {
		path: '/IncomeDetails', //提现管理--收入明细
		component: IncomeDetails
	}]
},
{
	path: '/home6',
	component: home6, //用户管理
	children: [{
		path: '/',
		redirect: '/UserList' //重定向到用户列表
	},
	{
		path: '/UserList', //用户列表
		component: UserList
	}, {
		path: '/Collection', //用户收藏
		component: Collection
	}, {
		path: '/WxUsers', //微信用户
		component: WxUsers
	}
	]
},
{
	path: '/home7',
	component: home7, //系统管理
	children: [{
		path: '/',
		redirect: '/AdministratorList' //重定向到管理员列表
	},
	{
		path: '/AdministratorList', //管理员列表
		component: AdministratorList
	}, {
		path: '/Help', //帮助信息
		component: Help
	}, {
		path: '/AdministratorList2', //帮助信息
		component: AdministratorList2
	}, {
		path: '/UpdateHistory',//更新记录
		component: UpdateHistory
	}
	]
}
]





var router = new Router({
	routes: constRouterMap
})

router.beforeEach((to, from, next) => {
	if (to.fullPath != '/login') {
		if (JSON.parse(localStorage.getItem("user"))) {
			next()
		} else {
			console.log('未登录')
			alert('登录过期，请重新登录')
			next('/');
			console.log(to)
			console.log(from)
		}
	} else {
		//		alert('登录界面')
		console.log(to)
		console.log(from)
	}

	next()
})

export default router