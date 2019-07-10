<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-tickets"></i>分销管理</el-breadcrumb-item>
				<el-breadcrumb-item>分销数据</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div>
			<div class="xxts">
				<!-- 实时统计 -->
				<div class="box_sstj">
					<p>实时统计:</p>
					<div class="box">
						<p>昨日订单总数</p>
						<span>{{yesterdayordernum}}</span>
					</div>
					<div class="box">
						<p>昨日订单总金额（元）</p>
						<span>{{yesterdayorderpay}}</span>
					</div>
					<div class="box">
						<p>昨日佣金（元）</p>
						<span>{{yesterdaygoldcoin}}</span>
					</div>
					<div class="box">
						<p>昨日注册人数/付费人数</p>
						<span>{{yesterdayregistnum}}/{{yesterdaypayusernum}}</span>
					</div>
				</div>
				<!-- 年累计总数据 -->
				<div class="rj">
					<p>年累计总数据:</p>
					<div class="box">
						<p>订单总数</p>
						<span>{{yearordernum}}</span>
					</div>
					<div class="box">
						<p>订单总金额（元）</p>
						<span>{{yearorderpay}}</span>
					</div>
					<div class="box">
						<p>佣金（元）</p>
						<span>{{yeargoldcoin}}</span>
					</div>
					<div class="box">
						<p>注册人数/付费人数</p>
						<span>{{yearregistnum}}/{{yearpayusernum}}</span>
					</div>
				</div>
				<div class="tjtb">
					<p>统计图表:</p>
					<div class="box_tjtb">
						<span>查询内容:</span>
						<el-radio-group v-model="radio1" @change="tubiaoChange1">
							<el-radio-button label="订单数"></el-radio-button>
							<el-radio-button label="订单金额"></el-radio-button>
							<el-radio-button label="佣金"></el-radio-button>
							<el-radio-button label="注册用户数"></el-radio-button>
							<el-radio-button label="付费用户数"></el-radio-button>
						</el-radio-group>
					</div>
					<div class="box_tjtb">
						<span>查询时间:</span>
						<el-radio-group v-model="radio2" @change="tubiaoChange2">
							<el-radio-button label="最近7天"></el-radio-button>

							<el-radio-button label="最近15天"></el-radio-button>

							<el-radio-button label="最近30天"></el-radio-button>
						</el-radio-group>
					</div>
					<div id="chartLine"></div>
				</div>
				<!-- 全国总代理业绩汇总 -->
				<br>
				<br>
				<br>
				<div class="quyuBox">
					<el-row>
						<el-col :span="12">
							<span>查询内容:</span>
							<el-radio-group v-model="radio3" @change="quyuChange1">
								<el-radio-button label="销售业绩"></el-radio-button>
								<el-radio-button label="付费用户数"></el-radio-button>
							</el-radio-group>
							<br />
							<br />
							<br />
							<span>查询时间:</span>
							<el-radio-group v-model="radio4" @change="quyuChange2">
								<el-radio-button label="最近7天"></el-radio-button>
								<el-radio-button label="最近30天"></el-radio-button>
								<el-radio-button label="最近90天"></el-radio-button>
							</el-radio-group>
							<div id="chartPie"></div>
						</el-col>
						<el-col :span="12">
							<div class="qgzdl">
								<p>全国总代理业绩汇总:</p>
								<br>

								<el-table :data="list" :max-height="500" border style="width: 100%" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
									<!-- <el-table-column type="selection" width="55" fixed></el-table-column> -->
									<!-- <el-table-column type="index" :index="indexMethod" width="80" fixed></el-table-column> -->
									<!-- <el-table-column prop="id" label="ID" fixed></el-table-column> -->
									<el-table-column prop="city" label="省市"></el-table-column>
									<el-table-column prop="zdname" label="总代理姓名"></el-table-column>
									<el-table-column prop="partnernum" label="城市合伙人数"></el-table-column>
									<el-table-column prop="registnum" label="注册用户数"></el-table-column>
									<el-table-column prop="payusernumbers" label="付费用户数"></el-table-column>
									<el-table-column prop="ordertotalpaynumber" label="销售业绩"></el-table-column>
								</el-table>
							</div>
						</el-col>

					</el-row>
				</div>
				<!-- 城市合伙人业绩汇总 -->
				<br>
				<br>
				<br>
				<div id="qyzdlBox">
					<el-row>
						<el-col :span="12">
							<span>查询内容:</span>
							<el-radio-group v-model="radio5" @change="zongdaiChange1">
								<el-radio-button label="销售业绩"></el-radio-button>
								<el-radio-button label="付费用户数"></el-radio-button>
							</el-radio-group>
							<br />
							<br />
							<br />
							<span>查询时间:</span>
							<el-radio-group v-model="radio6" @change="zongdaiChange2">
								<el-radio-button label="最近7天"></el-radio-button>
								<el-radio-button label="最近30天"></el-radio-button>
								<el-radio-button label="最近90天"></el-radio-button>
							</el-radio-group>
							<div id="chartPie2"></div>
						</el-col>
						<el-col :span="12">
							<div class="qgzdl">
								<p>城市合伙人业绩汇总: &nbsp;&nbsp;&nbsp;
									<span style="font-size:16px;">请选择总代理:</span>
									<el-select v-model="zongdaicode" style='width:100px' @change="zongdailist()">
										<el-option v-for="item in IsOptions2" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
			
								</p>
								<br>
								<el-table :data="list1" :max-height="500" border style="width: 100%" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
									<el-table-column prop="name" label="城市合伙姓名"></el-table-column>
									<el-table-column prop="registnum" label="注册用户数"></el-table-column>
									<el-table-column prop="payusernumbers" label="付费用户数"></el-table-column>
									<el-table-column prop="ordertotalpaynumber" label="销售业绩"></el-table-column>
								</el-table>
							</div>
						</el-col>
					</el-row>
				</div>
				
				
			</div>
		</div>

	</div>
</template>

<script>
	import echarts from 'echarts'
	import { promotiondata, promotiondata3, promotiondata4, zongdaiinfo } from '../../../api/api';
	import { formatDate, handleCommonAvatarSuccess } from '../../Utility/Utility';
	import { get } from '../../../api';
	// import { quillEditor } from 'vue-quill-editor';
	export default {
		data() {
			return {
				radio1: '订单数',
				radio2: '最近7天',
				radio3: '销售业绩',
				radio4: '最近7天',
				radio5: '销售业绩',
				radio6: '最近7天',
				select_cate: '', //查询id
				list: [], //数据
				list1: [], //数据
				del_list: [], //查询时缓存的全部数据
				contentShow: false,
				zongdaicode: '郭理伟',
				Order: 9999,
				msg: 'Welcome to Your Vue.js App',
				//当夜内容展示
				addForm: {
					pushtitle: '',
					pushcontent: '',
				},
				// 实时统计
				yesterdayordernum: 0,
				yesterdayorderpay: 0,
				yesterdaygoldcoin: 0,
				yesterdayregistnum: 0,
				yesterdaypayusernum: 0,
				//年累计
				yearordernum: 0,
				yearorderpay: 0,
				yeargoldcoin: 0,
				yearregistnum: 0,
				yearpayusernum: 0,

				//属性状态
				IsOptions2: [],
				IsOptions1: [{
						value: 'ZM1234',
						label: '王大锤王总'
					},
					{
						value: 'ZM1234',
						label: '刘大崔'
					}
				],
				tongjitubiao: null,
				quyufenbu: null,
				zongdaili: null,
				tubiaoChange1Val: '订单数',
				tubiaoChange2Val: '最近7天',
				quyuChange1val:'销售业绩',
				quyuChange2val:'最近7天',
				zongdaiChange1val:'销售业绩',
				zongdaiChange2val:'最近7天',
				option: {},
				optionPie: {},
				optionPie2: {}
			}
		},
		mounted() {
			// this.drawLine();
			this.getData();
			// this.echarts1option();
			this.drawLineCharts(); //绘制折线统计图表
			this.drawPieCharts(); //绘制区域分布饼图
			this.drawPie2Charts();//绘制总代理饼图
			
		},

		methods: {
			getData() {
				//获取统计数据
				promotiondata().then(res => {
//					console.log(res.data.yesterdaydata)
					// 实时统计
					this.yesterdayordernum = res.data.yesterdaydata.yesterdayordernum
					this.yesterdayorderpay = res.data.yesterdaydata.yesterdayorderpay
					this.yesterdaygoldcoin = res.data.yesterdaydata.yesterdaygoldcoin
					this.yesterdayregistnum = res.data.yesterdaydata.yesterdayregistnum
					this.yesterdaypayusernum = res.data.yesterdaydata.yesterdaypayusernum
					// 年累计
					this.yearordernum = res.data.yeardata.yearordernum
					this.yearorderpay = res.data.yeardata.yearorderpay
					this.yeargoldcoin = res.data.yeardata.yeargoldcoin
					this.yearregistnum = res.data.yeardata.yearregistnum
					this.yearpayusernum = res.data.yeardata.yearpayusernum
				})
				//获取总代理
				promotiondata3().then(res => {
					if(!res.data || res.data === [] || res.data.length === 0) {
						this.list = [];
					} else {
						this.list = res.data;
					}

				});
				promotiondata4('ZG3821').then(res => {
					if(!res.data || res.data === [] || res.data.length === 0) {
						this.list1 = [];
					} else {
						this.list1 = res.data;
					}
				})

				this.del_list = JSON.parse(JSON.stringify(this.list))

				zongdaiinfo().then(res => {
					this.IsOptions2 = res.data
				})
			},
			zongdailist() {
				promotiondata4(this.zongdaicode).then(res => {
					if(!res.data || res.data === [] || res.data.length === 0) {
						this.list1 = [];
					} else {
						this.list1 = res.data;
					}
				})
			},
			drawLineCharts() { //绘制初始化图表折线图
				this.tongjitubiao = echarts.init(document.getElementById('chartLine'))
				// 绘制图表
				this.option = {
					title: {
						text: ''
					},
					tooltip: {},
					xAxis: {
						data: ["4-16", "4-17", "4-18", "4-19", "4-20", "4-21", "4-22"]
					},
					yAxis: {},
					series: [{
						name: '销量',
						type: 'line',
						data: [5, 20, 36, 10, 10, 20, 60]
					}]
				}
				this.tongjitubiao.setOption(this.option);
			},
			tubiaoChange1(value) { //第一个选项发生变化时
				this.tubiaoChange1Val = value;
				//				设置七天内数据
				if(this.tubiaoChange2Val == '最近7天') {
					if(value == '订单数') {
						this.option.series[0].data = [5, 20, 36, 10, 10, 20, 60]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '订单金额') {
						this.option.series[0].data = [8, 28, 38, 18, 12, 33, 16]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '佣金') {
						this.option.series[0].data = [12, 22, 46, 20, 50, 30, 40]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '注册用户数') {
						console.log(this.option.series[0].data)
						this.option.series[0].data = [22, 32, 46, 20, 50, 10, 40]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '付费用户数') {
						this.option.series[0].data = [44, 30, 36, 20, 5, 33, 21]
						this.tongjitubiao.setOption(this.option);
					}
				} else if(this.tubiaoChange2Val == '最近15天') {
					if(value == '订单数') {
						this.option.series[0].data = [5, 20, 36, 10, 10, 20, 60, 5, 20, 36, 10, 10, 20, 60, 22]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '订单金额') {
						this.option.series[0].data = [8, 28, 38, 18, 12, 33, 16, 5, 20, 36, 10, 10, 20, 60, 33]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '佣金') {
						this.option.series[0].data = [12, 22, 46, 20, 50, 30, 40, 12, 22, 46, 20, 50, 30, 40, 10]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '注册用户数') {
						console.log(this.option.series[0].data)
						this.option.series[0].data = [22, 32, 46, 20, 50, 10, 40, 22, 32, 46, 20, 50, 10, 40, 53]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '付费用户数') {
						this.option.series[0].data = [44, 30, 36, 20, 5, 33, 21, 44, 30, 36, 20, 5, 33, 21, 44]
						this.tongjitubiao.setOption(this.option);
					}
				} else if(this.tubiaoChange2Val == '最近30天') {
					if(value == '订单数') {
						this.option.series[0].data = [5, 20, 36, 10, 10, 20, 60, 5, 20, 36, 10, 10, 20, 60, 22, 5, 20, 36, 10, 10, 20, 60, 5, 20, 36, 10, 10, 20, 60, 22]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '订单金额') {
						this.option.series[0].data = [8, 28, 38, 18, 12, 33, 16, 5, 20, 36, 10, 10, 20, 60, 33, 8, 28, 38, 18, 12, 33, 16, 5, 20, 36, 10, 10, 20, 60, 33]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '佣金') {
						this.option.series[0].data = [12, 22, 46, 20, 50, 30, 40, 12, 22, 46, 20, 50, 30, 40, 10, 12, 22, 46, 20, 50, 30, 40, 12, 22, 46, 20, 50, 30, 40, 10]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '注册用户数') {
						console.log(this.option.series[0].data)
						this.option.series[0].data = [22, 32, 46, 20, 50, 10, 40, 22, 32, 46, 20, 50, 10, 40, 53, 22, 32, 46, 20, 50, 10, 40, 22, 32, 46, 20, 50, 10, 40, 53]
						this.tongjitubiao.setOption(this.option);
					} else if(value == '付费用户数') {
						this.option.series[0].data = [44, 30, 36, 20, 5, 33, 21, 44, 30, 36, 20, 5, 33, 21, 44, 44, 30, 36, 20, 5, 33, 21, 44, 30, 36, 20, 5, 33, 21, 44]
						this.tongjitubiao.setOption(this.option);
					}
				}

			},
			tubiaoChange2(value) { //第二个选项发生变化时
				this.tubiaoChange2Val = value;
				console.log(value)
				console.log(this.option.xAxis.data)
				if(value == '最近7天') {
					this.option.series[0].data = [12, 22, 46, 20, 50, 30, 40];
					this.option.xAxis.data = ["4-16", "4-17", "4-18", "4-19", "4-20", "4-21", "4-22"]
					this.tongjitubiao.setOption(this.option);
				} else if(value == '最近15天') {
					this.option.series[0].data = [12, 22, 46, 20, 50, 30, 40, 12, 22, 46, 20, 50, 30, 40, 20];
					this.option.xAxis.data = ["4-16", "4-16", "4-16", "4-16", "4-16", "4-16", "4-14", "4-15", "4-16", "4-17", "4-18", "4-19", "4-20", "4-21", "4-22"]
					this.tongjitubiao.setOption(this.option);
				} else if(value == '最近30天') {
					this.option.series[0].data = [12, 22, 46, 20, 50, 30, 40, 12, 22, 46, 20, 50, 30, 40, 12, 22, 46, 20, 50, 30, 40, 12, 22, 46, 20, 50, 30, 40, 32, 22];
					this.option.xAxis.data = ["4-16", "4-16", "4-16", "4-16", "4-16", "4-16", "4-14", "4-15", "4-16", "4-17", "4-18", "4-19", "4-20", "4-21", "4-22", "4-16", "4-16", "4-16", "4-16", "4-16", "4-16", "4-14", "4-15", "4-16", "4-17", "4-18", "4-19", "4-20", "4-21", "4-22"]
					this.tongjitubiao.setOption(this.option);
				}
			},
			drawPieCharts() { //绘制区域饼子图
				this.quyufenbu = echarts.init(document.getElementById('chartPie'))
				// 绘制图表
				this.optionPie = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%))"
					},
					series: [{
						name: '销售业绩',
						type: 'pie',
						radius: ['30%', '50%'],
						label: {
							normal: {
			                    formatter: '{b|{b}:}{c|{c}:}{per|{d}%}',
			                    rich: {
			                        a: {
			                            color: '#999',
			                            lineHeight: 22,
			                            
			                            align: 'center'
			                        },
			                        b: {
			                            fontSize: 11,
			                            lineHeight: 33
			                        },
			                        c: {
			                        	fontSize: 11,
			                        	color: '#999'
			                        },
			                        per: {
			                        	fontSize: 11,
			                            color: '#999',
			                            padding: [2, 4]
			                        }
			                    }
		                    }
						},
						data: [
							{value: 335,name: '上海'},
							{value: 310,name: '北京'},
							{value: 234,name: '江苏'},
							{value: 135,name: '深圳'},
							{value: 555,name: '山东'},
							{value: 1563,name: '山西'},
							{value: 45,name: '河北'},
							{value: 123,name: '河南'},
							{value: 232,name: '浙江'},
							{value: 567,name: '广东'}
						]
					}
					]
				}
				this.quyufenbu.setOption(this.optionPie);
			},
			quyuChange1(value) {
				this.quyuChange1val = value;
				if (this.quyuChange2val == '最近7天') {
					if (value == '销售业绩') {
						this.optionPie.series[0].name = '销售业绩';
						this.optionPie.series[0].data = [{value: 335,name: '上海'},{value: 310,name: '北京'},{value: 234,name: '江苏'},{value: 135,name: '深圳'},{value: 555,name: '山东'},{value: 1563,name: '山西'},{value: 45,name: '河北'},{value: 123,name: '河南'},{value: 232,name: '浙江'},{value: 567,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					} else if(value == '付费用户数'){
						this.optionPie.series[0].name = '付费用户数';
						this.optionPie.series[0].data = [{value: 232,name: '上海'},{value: 555,name: '北京'},{value: 234,name: '江苏'},{value: 532,name: '深圳'},{value: 32,name: '山东'},{value: 545,name: '山西'},{value: 123,name: '河北'},{value: 123,name: '河南'},{value: 422,name: '浙江'},{value: 233,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
	
					}
				}else if (this.quyuChange2val == '最近30天') {
					if (value == '销售业绩') {
						this.optionPie.series[0].name = '销售业绩';
						this.optionPie.series[0].data = [{value: 1900,name: '上海'},{value: 2877,name: '北京'},{value: 4667,name: '江苏'},{value: 3556,name: '深圳'},{value: 7234,name: '山东'},{value: 8443,name: '山西'},{value: 1233,name: '河北'},{value: 3432,name: '河南'},{value: 6666,name: '浙江'},{value: 5344,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					} else if(value == '付费用户数'){
						this.optionPie.series[0].name = '付费用户数';
						this.optionPie.series[0].data = [{value: 7632,name: '上海'},{value: 9455,name: '北京'},{value: 4734,name: '江苏'},{value: 6932,name: '深圳'},{value: 3442,name: '山东'},{value: 4245,name: '山西'},{value: 3223,name: '河北'},{value: 4623,name: '河南'},{value: 4922,name: '浙江'},{value: 5633,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
	
					}
				}else if (this.quyuChange2val == '最近90天') {
					if (value == '销售业绩') {
						this.optionPie.series[0].name = '销售业绩';
						this.optionPie.series[0].data = [{value: 31335,name: '上海'},{value: 43210,name: '北京'},{value: 3234,name: '江苏'},{value: 3235,name: '深圳'},{value: 25255,name: '山东'},{value: 9563,name: '山西'},{value: 12675,name: '河北'},{value: 8223,name: '河南'},{value: 17232,name: '浙江'},{value: 32567,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					} else if(value == '付费用户数'){
						this.optionPie.series[0].name = '付费用户数';
						this.optionPie.series[0].data = [{value: 43332,name: '上海'},{value: 44455,name: '北京'},{value: 11234,name: '江苏'},{value: 52332,name: '深圳'},{value: 23322,name: '山东'},{value: 23245,name: '山西'},{value: 22223,name: '河北'},{value: 41723,name: '河南'},{value: 53422,name: '浙江'},{value: 31233,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
	
					}
				}
				
			},
			quyuChange2(value) {
				this.quyuChange2val = value;
				if(this.quyuChange1val == '销售业绩'){
					if(value == '最近7天'){
						this.optionPie.series[0].data = [{value: 335,name: '上海'},{value: 310,name: '北京'},{value: 234,name: '江苏'},{value: 135,name: '深圳'},{value: 555,name: '山东'},{value: 1563,name: '山西'},{value: 45,name: '河北'},{value: 123,name: '河南'},{value: 232,name: '浙江'},{value: 567,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					}else if(value == '最近30天'){
						this.optionPie.series[0].data = [{value: 1900,name: '上海'},{value: 2877,name: '北京'},{value: 4667,name: '江苏'},{value: 3556,name: '深圳'},{value: 7234,name: '山东'},{value: 8443,name: '山西'},{value: 1233,name: '河北'},{value: 3432,name: '河南'},{value: 6666,name: '浙江'},{value: 5344,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					}else if(value == '最近90天'){
						this.optionPie.series[0].data = [{value: 31335,name: '上海'},{value: 43210,name: '北京'},{value: 3234,name: '江苏'},{value: 3235,name: '深圳'},{value: 25255,name: '山东'},{value: 9563,name: '山西'},{value: 12675,name: '河北'},{value: 8223,name: '河南'},{value: 17232,name: '浙江'},{value: 32567,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					}
				}else if(this.quyuChange1val == '付费用户数'){
					if(value == '最近7天'){
						this.optionPie.series[0].data = [{value: 232,name: '上海'},{value: 555,name: '北京'},{value: 234,name: '江苏'},{value: 532,name: '深圳'},{value: 32,name: '山东'},{value: 545,name: '山西'},{value: 123,name: '河北'},{value: 123,name: '河南'},{value: 422,name: '浙江'},{value: 233,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					}else if(value == '最近30天'){
						this.optionPie.series[0].data = [{value: 7632,name: '上海'},{value: 9455,name: '北京'},{value: 4734,name: '江苏'},{value: 6932,name: '深圳'},{value: 3442,name: '山东'},{value: 4245,name: '山西'},{value: 3223,name: '河北'},{value: 4623,name: '河南'},{value: 4922,name: '浙江'},{value: 5633,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					}else if(value == '最近90天'){
						this.optionPie.series[0].data = [{value: 43332,name: '上海'},{value: 44455,name: '北京'},{value: 11234,name: '江苏'},{value: 52332,name: '深圳'},{value: 23322,name: '山东'},{value: 23245,name: '山西'},{value: 22223,name: '河北'},{value: 41723,name: '河南'},{value: 53422,name: '浙江'},{value: 31233,name: '广东'}];
						this.quyufenbu.setOption(this.optionPie);
					}
				}
			},
			drawPie2Charts() { //绘制区域饼子图
				this.zongdaili = echarts.init(document.getElementById('chartPie2'))
				// 绘制图表
				this.optionPie2 = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%))"
					},
					series: [{
						name: '销售业绩',
						type: 'pie',
						radius: ['30%', '50%'],
						label: {
							normal: {
			                    formatter: '{b|{b}:}{c|{c}:}{per|{d}%}',
			                    backgroundColor: 'rgba(0,0,0,0)',
//			                    borderColor: '#aaa',
//			                    borderWidth: 1,
//			                    borderRadius: 4,
			                    rich: {
			                        a: {
			                            color: '#999',
			                            lineHeight: 22,
			                            
			                            align: 'center'
			                        },
			                        b: {
			                            fontSize: 10,
			                            lineHeight: 33
			                        },
			                        c: {
			                        	fontSize: 10,
			                        	color: '#999'
			                        },
			                        per: {
			                        	fontSize: 10,
			                            color: '#999',
			                            padding: [2, 4]
			                        }
			                    }
		                    }
						},
						data: [
							{value: 335,name: '上海'},
							{value: 310,name: '北京'},
							{value: 234,name: '江苏'},
							{value: 135,name: '深圳'},
							{value: 555,name: '山东'},
							{value: 1563,name: '山西'},
							{value: 45,name: '河北'},
							{value: 123,name: '河南'},
							{value: 232,name: '浙江'},
							{value: 567,name: '广东'}
						]
					}
					]
				}
				this.zongdaili.setOption(this.optionPie2);
			},
			zongdaiChange1(value){
				this.zongdaiChange1val = value;
				if (this.zongdaiChange2val == '最近7天') {
					if (value == '销售业绩') {
						this.optionPie2.series[0].name = '销售业绩';
						this.optionPie2.series[0].data = [{value: 335,name: '上海'},{value: 310,name: '北京'},{value: 234,name: '江苏'},{value: 135,name: '深圳'},{value: 555,name: '山东'},{value: 1563,name: '山西'},{value: 45,name: '河北'},{value: 123,name: '河南'},{value: 232,name: '浙江'},{value: 567,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					} else if(value == '付费用户数'){
						this.optionPie2.series[0].name = '付费用户数';
						this.optionPie2.series[0].data = [{value: 232,name: '上海'},{value: 555,name: '北京'},{value: 234,name: '江苏'},{value: 532,name: '深圳'},{value: 32,name: '山东'},{value: 545,name: '山西'},{value: 123,name: '河北'},{value: 123,name: '河南'},{value: 422,name: '浙江'},{value: 233,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
	
					}
				}else if (this.zongdaiChange2val == '最近30天') {
					if (value == '销售业绩') {
						this.optionPie2.series[0].name = '销售业绩';
						this.optionPie2.series[0].data = [{value: 1900,name: '上海'},{value: 2877,name: '北京'},{value: 4667,name: '江苏'},{value: 3556,name: '深圳'},{value: 7234,name: '山东'},{value: 8443,name: '山西'},{value: 1233,name: '河北'},{value: 3432,name: '河南'},{value: 6666,name: '浙江'},{value: 5344,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					} else if(value == '付费用户数'){
						this.optionPie2.series[0].name = '付费用户数';
						this.optionPie2.series[0].data = [{value: 7632,name: '上海'},{value: 9455,name: '北京'},{value: 4734,name: '江苏'},{value: 6932,name: '深圳'},{value: 3442,name: '山东'},{value: 4245,name: '山西'},{value: 3223,name: '河北'},{value: 4623,name: '河南'},{value: 4922,name: '浙江'},{value: 5633,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
	
					}
				}else if (this.zongdaiChange2val == '最近90天') {
					if (value == '销售业绩') {
						this.optionPie2.series[0].name = '销售业绩';
						this.optionPie2.series[0].data = [{value: 31335,name: '上海'},{value: 43210,name: '北京'},{value: 3234,name: '江苏'},{value: 3235,name: '深圳'},{value: 25255,name: '山东'},{value: 9563,name: '山西'},{value: 12675,name: '河北'},{value: 8223,name: '河南'},{value: 17232,name: '浙江'},{value: 32567,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					} else if(value == '付费用户数'){
						this.optionPie2.series[0].name = '付费用户数';
						this.optionPie2.series[0].data = [{value: 43332,name: '上海'},{value: 44455,name: '北京'},{value: 11234,name: '江苏'},{value: 52332,name: '深圳'},{value: 23322,name: '山东'},{value: 23245,name: '山西'},{value: 22223,name: '河北'},{value: 41723,name: '河南'},{value: 53422,name: '浙江'},{value: 31233,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
	
					}
				}
			},
			zongdaiChange2(value){
				this.zongdaiChange2val = value;
				if(this.zongdaiChange1val == '销售业绩'){
					if(value == '最近7天'){
						this.optionPie2.series[0].data = [{value: 335,name: '上海'},{value: 310,name: '北京'},{value: 234,name: '江苏'},{value: 135,name: '深圳'},{value: 555,name: '山东'},{value: 1563,name: '山西'},{value: 45,name: '河北'},{value: 123,name: '河南'},{value: 232,name: '浙江'},{value: 567,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					}else if(value == '最近30天'){
						this.optionPie2.series[0].data = [{value: 1900,name: '上海'},{value: 2877,name: '北京'},{value: 4667,name: '江苏'},{value: 3556,name: '深圳'},{value: 7234,name: '山东'},{value: 8443,name: '山西'},{value: 1233,name: '河北'},{value: 3432,name: '河南'},{value: 6666,name: '浙江'},{value: 5344,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					}else if(value == '最近90天'){
						this.optionPie2.series[0].data = [{value: 31335,name: '上海'},{value: 43210,name: '北京'},{value: 3234,name: '江苏'},{value: 3235,name: '深圳'},{value: 25255,name: '山东'},{value: 9563,name: '山西'},{value: 12675,name: '河北'},{value: 8223,name: '河南'},{value: 17232,name: '浙江'},{value: 32567,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					}
				}else if(this.zongdaiChange1val == '付费用户数'){
					if(value == '最近7天'){
						this.optionPie2.series[0].data = [{value: 232,name: '上海'},{value: 555,name: '北京'},{value: 234,name: '江苏'},{value: 532,name: '深圳'},{value: 32,name: '山东'},{value: 545,name: '山西'},{value: 123,name: '河北'},{value: 123,name: '河南'},{value: 422,name: '浙江'},{value: 233,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					}else if(value == '最近30天'){
						this.optionPie2.series[0].data = [{value: 7632,name: '上海'},{value: 9455,name: '北京'},{value: 4734,name: '江苏'},{value: 6932,name: '深圳'},{value: 3442,name: '山东'},{value: 4245,name: '山西'},{value: 3223,name: '河北'},{value: 4623,name: '河南'},{value: 4922,name: '浙江'},{value: 5633,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					}else if(value == '最近90天'){
						this.optionPie2.series[0].data = [{value: 43332,name: '上海'},{value: 44455,name: '北京'},{value: 11234,name: '江苏'},{value: 52332,name: '深圳'},{value: 23322,name: '山东'},{value: 23245,name: '山西'},{value: 22223,name: '河北'},{value: 41723,name: '河南'},{value: 53422,name: '浙江'},{value: 31233,name: '广东'}];
						this.zongdaili.setOption(this.optionPie2);
					}
				}
			}

		}
	}
</script>

<style scoped>
	.box {
		float: left;
		width: 150px;
		height: 70px;
		background-color: rgb(201, 201, 201);
		margin: 20px 40px;
		text-align: center;
	}
	
	.box p {
		font-size: 14px;
		padding: 14px 0 6px 0;
		color: #fff;
	}
	
	.box span {
		font-size: 18px;
		color: #fff;
	}
	
	.box_tjtb {
		margin: 20px;
	}
	
	.tjtb span {
		font-size: 14px;
	}
	.quyuBox span {
		font-size: 14px;;
	}
	#chartLine {
		width: 800px;
		height: 300px
	}
	
	#chartPie {
		width: 100%;
		height: 300px;
	}
	#chartPie2 {
		width: 100%;
		height: 300px;
	}
	
	.box_sstj,
	.rj {
		float: left;
		width: 100%
	}
	/* .el-table th{
  background-color: rgb(64,158,255);
} */
	
	td>div {
		height: 35px !important;
	}
	
	.boxbk {
		background: rgba(242, 242, 242, 1);
	}
</style>