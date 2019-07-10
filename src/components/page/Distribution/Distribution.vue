<template>
	<div class="table">
		<div>
			<div class="xxts">
				<!-- 实时统计 -->
				<div class="box_sstj">
					<p class="sstj_title">实时统计:</p>
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
					<p class="rj_title">年累计总数据:</p>
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
							<el-radio-button label="1">订单数</el-radio-button>
							<el-radio-button label="2">订单金额</el-radio-button>
							<el-radio-button label="3">佣金</el-radio-button>
							<el-radio-button label="4">注册用户数</el-radio-button>
							<el-radio-button label="5">付费用户数</el-radio-button>
						</el-radio-group>
					</div>
					<div class="box_tjtb">
						<span>查询时间:</span>
						<el-radio-group v-model="radio2" @change="tubiaoChange2">
							<el-radio-button label="1">最近7天</el-radio-button>

							<el-radio-button label="2">最近15天</el-radio-button>

							<el-radio-button label="3">最近90天</el-radio-button>
						</el-radio-group>
					</div>
					<div id="chartLine"></div>
				</div>
				<!-- 全国总代理业绩汇总 -->
				<div class="quyuBox">
					<p>全国总代理业绩汇总:</p>
					<el-row>
						<el-col :span="12">
							<div class="box_tjtb">
								<span>查询内容:</span>
								<el-radio-group v-model="radio3" @change="quyuChange1">
									<el-radio-button label="1">销售业绩</el-radio-button>
									<el-radio-button label="2">付费用户数</el-radio-button>
									<el-radio-button label="3">注册用户数</el-radio-button>
								</el-radio-group>
							</div>
							<div class="box_tjtb">
								<span>查询时间:</span>
								<el-radio-group v-model="radio4" @change="quyuChange2">
									<el-radio-button label="1">最近7天</el-radio-button>
									<el-radio-button label="2">最近30天</el-radio-button>
									<el-radio-button label="3">最近90天</el-radio-button>
								</el-radio-group>
							</div>
							<div id="chartPie"></div>
						</el-col>
						<el-col :span="12">
							<div class="qgzdl">
								<el-table :data="list" :max-height="400" border stripe style="width: 100%" :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
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
				<div id="qyzdlBox">
					<p>城市合伙人业绩汇总:</p>
					<el-row>
						<el-col :span="12">
							<div class="box_tjtb">
								<span>查询内容:</span>
								<el-radio-group v-model="radio5" @change="zongdaiChange1">
									<el-radio-button label="1">销售业绩</el-radio-button>
									<el-radio-button label="2">付费用户数</el-radio-button>
									<el-radio-button label="3">注册用户数</el-radio-button>
								</el-radio-group>
							</div>
							<div class="box_tjtb">
								<span>查询时间:</span>
								<el-radio-group v-model="radio6" @change="zongdaiChange2">
									<el-radio-button label="1">最近7天</el-radio-button>
									<el-radio-button label="2">最近30天</el-radio-button>
									<el-radio-button label="3">最近90天</el-radio-button>
								</el-radio-group>
							</div>
							<div id="chartPie2"></div>
						</el-col>
						<el-col :span="12">
							<div class="qgzdl">
								<div class="box_tjtb">
									<span style="font-size:16px;">请选择总代理:</span>
									<el-select v-model="zongdaicode" style='width:100px' @change="zongdailist">
										<el-option v-for="item in IsOptions2" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</div>
								<br>
								<el-table :data="list1" :max-height="400" border stripe style="width: 100%" :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
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
	import { promotiondata, promotiondata3, promotiondata4, zongdaiinfo,getDrawlineData,getDrawpie1Data,getDrawpie2Data } from '../../../api/api';
	import { formatDate, handleCommonAvatarSuccess,getAgoday,getAgo } from '../../Utility/Utility';
	import { get } from '../../../api';
	// import { quillEditor } from 'vue-quill-editor';
	export default {
		data() {
			return {
				radio1: '1',
				radio2: '1',
				radio3: '1',
				radio4: '1',
				radio5: '1',
				radio6: '1',
				dataarr: [],
				dayarr:[],
				select_cate: '', //查询id
				list: [], //数据
				list1: [], //数据
				del_list: [], //查询时缓存的全部数据
				contentShow: false,
				zongdaicode: 'ZG3821',
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
				tubiaoChange1Val: '1',
				tubiaoChange2Val: '1',
				quyuChange1val:'1',
				quyuChange2val:'1',
				zongdaiChange1val:'1',
				zongdaiChange2val:'1',
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
						console.log(res.data)
					}
				})

				this.del_list = JSON.parse(JSON.stringify(this.list))

				zongdaiinfo().then(res => {
					this.IsOptions2 = res.data;
					console.log(res)
				})
			},
			
			drawLineCharts() { //绘制初始化图表折线图
				var self = this;
				var daysarr = getAgoday(-7).join(',');
					getDrawlineData(self.radio1,daysarr).then(res => {
						self.dataarr = res.data.dataarray;
						self.dayarr = res.data.dayarray;
						self.tongjitubiao = echarts.init(document.getElementById('chartLine'))
						// 绘制图表
						self.option = {
							title: {
								text: ''
							},
							tooltip: {},
							xAxis: {
								data: self.dayarr
							},
							yAxis: {},
							series: [{
								name: '订单数',
								type: 'line',
								data: self.dataarr
							}]
						}
						self.tongjitubiao.setOption(self.option);
					})
			},
			tubiaoChange1(value) { //第一个选项发生变化时
				this.tubiaoChange1Val = value;
				console.log(value)
				var self = this;
				//				设置七天内数据
				if(this.tubiaoChange2Val == '1') {
					var daysarr = getAgoday(-7).join(',');
					var self = this;
					if(value == '1') {
						const loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawlineData(1,daysarr).then(res => {
							self.option.series[0].name = '订单数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
							loading.close();
						})
					} else if(value == '2') {
						getDrawlineData(2,daysarr).then(res => {
							self.option.series[0].name = '订单金额';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '3') {
						getDrawlineData(3,daysarr).then(res => {
							self.option.series[0].name = '佣金';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '4') {
						getDrawlineData(4,daysarr).then(res => {
							self.option.series[0].name = '注册用户数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '5') {
						getDrawlineData(5,daysarr).then(res => {
							self.option.series[0].name = '付费用户数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					}
				} else if(this.tubiaoChange2Val == '2') {
					var daysarr = getAgoday(-30).join(',');
					if(value == '1') {
						getDrawlineData(1,daysarr).then(res => {
							self.option.series[0].name = '订单数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '2') {
						getDrawlineData(2,daysarr).then(res => {
							self.option.series[0].name = '订单金额';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '3') {
						getDrawlineData(3,daysarr).then(res => {
							self.option.series[0].name = '佣金';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '4') {
						getDrawlineData(4,daysarr).then(res => {
							self.option.series[0].name = '注册用户数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '5') {
						getDrawlineData(5,daysarr).then(res => {
							self.option.series[0].name = '付费用户数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					}
				} else if(this.tubiaoChange2Val == '3') {
					var daysarr = getAgoday(-90).join(',');
					if(value == '1') {
						getDrawlineData(1,daysarr).then(res => {
							self.option.series[0].name = '订单数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '2') {
						getDrawlineData(2,daysarr).then(res => {
							self.option.series[0].name = '订单金额';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '3') {
						getDrawlineData(3,daysarr).then(res => {
							self.option.series[0].name = '佣金';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '4') {
						getDrawlineData(4,daysarr).then(res => {
							self.option.series[0].name = '注册用户数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					} else if(value == '5') {
						getDrawlineData(5,daysarr).then(res => {
							self.option.series[0].name = '付费用户数';
							self.option.series[0].data = res.data.dataarray
							self.tongjitubiao.setOption(self.option);
						})
					}
				}

			},
			tubiaoChange2(value) { //第二个选项发生变化时
				this.tubiaoChange2Val = value;
				console.log(value)
				var self = this;
				if(this.tubiaoChange1Val == '1') {
					if(value == '1') {
						var daysarr = getAgoday(-7).join(',');
						getDrawlineData(1,daysarr).then(res => {
							self.option.series[0].name = '订单数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '2') {
						var daysarr = getAgoday(-30).join(',');
						getDrawlineData(1,daysarr).then(res => {
							self.option.series[0].name = '订单数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '3') {
						var daysarr = getAgoday(-90).join(',');
						getDrawlineData(1,daysarr).then(res => {
							self.option.series[0].name = '订单数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					}
				}else if(this.tubiaoChange1Val == '2'){
					if(value == '1') {
						var daysarr = getAgoday(-7).join(',');
						getDrawlineData(2,daysarr).then(res => {
							self.option.series[0].name = '订单金额';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '2') {
						var daysarr = getAgoday(-30).join(',');
						getDrawlineData(2,daysarr).then(res => {
							self.option.series[0].name = '订单金额';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '3') {
						var daysarr = getAgoday(-90).join(',');
						getDrawlineData(2,daysarr).then(res => {
							self.option.series[0].name = '订单金额';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					}
				}else if(this.tubiaoChange1Val == '3'){
					if(value == '1') {
						var daysarr = getAgoday(-7).join(',');
						getDrawlineData(3,daysarr).then(res => {
							self.option.series[0].name = '佣金';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '2') {
						var daysarr = getAgoday(-30).join(',');
						getDrawlineData(3,daysarr).then(res => {
							self.option.series[0].name = '佣金';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '3') {
						var daysarr = getAgoday(-90).join(',');
						getDrawlineData(3,daysarr).then(res => {
							self.option.series[0].name = '佣金';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					}
				}else if(this.tubiaoChange1Val == '4'){
					if(value == '1') {
						var daysarr = getAgoday(-7).join(',');
						getDrawlineData(4,daysarr).then(res => {
							self.option.series[0].name = '注册用户数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '2') {
						var daysarr = getAgoday(-30).join(',');
						getDrawlineData(4,daysarr).then(res => {
							self.option.series[0].name = '注册用户数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '3') {
						var daysarr = getAgoday(-90).join(',');
						getDrawlineData(4,daysarr).then(res => {
							self.option.series[0].name = '注册用户数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					}
				}else if(this.tubiaoChange1Val == '5'){
					if(value == '1') {
						var daysarr = getAgoday(-7).join(',');
						getDrawlineData(5,daysarr).then(res => {
							self.option.series[0].name = '付费用户数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '2') {
						var daysarr = getAgoday(-30).join(',');
						getDrawlineData(5,daysarr).then(res => {
							self.option.series[0].name = '付费用户数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					} else if(value == '3') {
						var daysarr = getAgoday(-90).join(',');
						getDrawlineData(5,daysarr).then(res => {
							self.option.series[0].name = '付费用户数';
							this.option.series[0].data = res.data.dataarray
							this.option.xAxis.data = res.data.dayarray
							this.tongjitubiao.setOption(this.option);
						})
					}
				}
				
			},
			drawPieCharts() { //绘制区域饼子图
				var self = this;
				var endtime1 = new Date(),endtime2=endtime1.getFullYear()+"-"+(endtime1.getMonth()+1)+"-"+endtime1.getDate();
				var endtime = endtime2;
				if (this.radio4 == '1') {
					var starttime = getAgo(-7)
					console.log(starttime)
					console.log(endtime)
				}
				getDrawpie1Data(starttime,endtime).then(res => {
					self.quyufenbu = echarts.init(document.getElementById('chartPie'))
					// 绘制图表
					self.optionPie = {
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
							data: res.data.salesdata
						}
						]
					}
					self.quyufenbu.setOption(this.optionPie);
				})
				
			},
			quyuChange1(value) {
				var self = this;
				this.quyuChange1val = value;
				var endtime1 = new Date(),endtime2=endtime1.getFullYear()+"-"+(endtime1.getMonth()+1)+"-"+endtime1.getDate();
				var endtime = endtime2;
				if (this.quyuChange2val == '1') {
					var starttime = getAgo(-7)
					if (value == '1') {
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '销售业绩';
							self.optionPie.series[0].data = res.data.salesdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					} else if(value == '2'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '付费用户数';
							self.optionPie.series[0].data = res.data.payuserdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					} else if(value == '3'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '注册用户数';
							self.optionPie.series[0].data = res.data.registdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}
				}else if (this.quyuChange2val == '2') {
					var starttime = getAgo(-30)
					if (value == '1') {
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '销售业绩';
							self.optionPie.series[0].data = res.data.salesdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					} else if(value == '2'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '付费用户数';
							self.optionPie.series[0].data = res.data.payuserdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}else if(value == '3'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '注册用户数';
							self.optionPie.series[0].data = res.data.registdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}
				}else if (this.quyuChange2val == '3') {
					var starttime = getAgo(-90)
					if (value == '1') {
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '销售业绩';
							self.optionPie.series[0].data = res.data.salesdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					} else if(value == '2'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '付费用户数';
							self.optionPie.series[0].data = res.data.payuserdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					} else if(value == '3'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '注册用户数';
							self.optionPie.series[0].data = res.data.registdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}
				}
				
			},
			quyuChange2(value) {
				console.log(value)
				this.quyuChange2val = value;
				var self = this;
				var endtime1 = new Date(),endtime2=endtime1.getFullYear()+"-"+(endtime1.getMonth()+1)+"-"+endtime1.getDate();
				var endtime = endtime2;
				if(this.quyuChange1val == '1'){
					if(value == '1'){
						var starttime = getAgo(-7)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '销售业绩';
							self.optionPie.series[0].data = res.data.salesdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}else if(value == '2'){
						var starttime = getAgo(-30)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '销售业绩';
							self.optionPie.series[0].data = res.data.salesdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}else if(value == '3'){
						var starttime = getAgo(-90)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '销售业绩';
							self.optionPie.series[0].data = res.data.salesdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}
				}else if(this.quyuChange1val == '2'){
					if(value == '1'){
						var starttime = getAgo(-7)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '付费用户数';
							self.optionPie.series[0].data = res.data.payuserdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}else if(value == '2'){
						var starttime = getAgo(-30)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '付费用户数';
							self.optionPie.series[0].data = res.data.payuserdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}else if(value == '3'){
						var starttime = getAgo(-90)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '付费用户数';
							self.optionPie.series[0].data = res.data.payuserdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}
				}else if(this.quyuChange1val == '3'){
					if(value == '1'){
						var starttime = getAgo(-7)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '注册用户数';
							self.optionPie.series[0].data = res.data.registdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}else if(value == '2'){
						var starttime = getAgo(-30)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '注册用户数';
							self.optionPie.series[0].data = res.data.registdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}else if(value == '3'){
						var starttime = getAgo(-90)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie1Data(starttime,endtime).then(res => {
							self.optionPie.series[0].name = '注册用户数';
							self.optionPie.series[0].data = res.data.registdata;
							self.quyufenbu.setOption(self.optionPie);
							loading.close()
						})
					}
				}
			},
			drawPie2Charts() { //绘制区域饼子图
				var self = this;
				var endtime1 = new Date(),endtime2=endtime1.getFullYear()+"-"+(endtime1.getMonth()+1)+"-"+endtime1.getDate();
				var endtime = endtime2;
				if (this.radio6 == '1') {
					var starttime = getAgo(-7)
					console.log(starttime)
					console.log(endtime)
				}
				getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
					console.log(res)
					self.zongdaili = echarts.init(document.getElementById('chartPie2'))
					// 绘制图表
					self.optionPie2 = {
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
							data: res.data.salesdata
						}
						]
					}
					self.zongdaili.setOption(self.optionPie2);
				})
				
			},
			zongdailist(val) {
				this.radio5 = '1';
				this.radio6 = '1';
				var endtime1 = new Date(),endtime2=endtime1.getFullYear()+"-"+(endtime1.getMonth()+1)+"-"+endtime1.getDate();
				var endtime = endtime2;
				var starttime = getAgo(-7)
//				getDrawpie2Data(val,starttime,endtime).then(res => {
					this.drawPie2Charts();
//				})
				promotiondata4(this.zongdaicode).then(res => {
					if(!res.data || res.data === [] || res.data.length === 0) {
						this.list1 = [];
					} else {
						this.list1 = res.data;
					}
				})
				
			},
			zongdaiChange1(value){
				this.zongdaiChange1val = value;
				var endtime1 = new Date(),endtime2=endtime1.getFullYear()+"-"+(endtime1.getMonth()+1)+"-"+endtime1.getDate();
				var endtime = endtime2;
				if (this.zongdaiChange2val == '1') {
					var starttime = getAgo(-7)
					if (value == '1') {
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '销售业绩';
							this.optionPie2.series[0].data = res.data.salesdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close()
						})
					} else if(value == '2'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '付费用户数';
							this.optionPie2.series[0].data = res.data.payuserdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					} else if(value == '3'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '注册用户数';
							this.optionPie2.series[0].data = res.data.registdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}
				}else if (this.zongdaiChange2val == '2') {
					var starttime = getAgo(-30)
					if (value == '1') {
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '销售业绩';
							this.optionPie2.series[0].data = res.data.salesdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					} else if(value == '2'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '付费用户数';
							this.optionPie2.series[0].data = res.data.payuserdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					} else if(value == '3'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '注册用户数';
							this.optionPie2.series[0].data = res.data.registdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}
				}else if (this.zongdaiChange2val == '3') {
					var starttime = getAgo(-90)
					if (value == '1') {
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '销售业绩';
							this.optionPie2.series[0].data = res.data.salesdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					} else if(value == '2'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '付费用户数';
							this.optionPie2.series[0].data = res.data.payuserdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					} else if(value == '3'){
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '注册用户数';
							this.optionPie2.series[0].data = res.data.registdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}
				}
			},
			zongdaiChange2(value){
				this.zongdaiChange2val = value;
				var endtime1 = new Date(),endtime2=endtime1.getFullYear()+"-"+(endtime1.getMonth()+1)+"-"+endtime1.getDate();
				var endtime = endtime2;
				if(this.zongdaiChange1val == '1'){
					if(value == '1'){
						var starttime = getAgo(-7)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '销售业绩';
							this.optionPie2.series[0].data = res.data.salesdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}else if(value == '2'){
						var starttime = getAgo(-30)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '销售业绩';
							this.optionPie2.series[0].data = res.data.salesdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}else if(value == '3'){
						var starttime = getAgo(-90)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '销售业绩';
							this.optionPie2.series[0].data = res.data.salesdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}
				}else if(this.zongdaiChange1val == '2'){
					if(value == '1'){
						var starttime = getAgo(-7)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '付费用户数';
							this.optionPie2.series[0].data = res.data.payuserdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}else if(value == '2'){
						var starttime = getAgo(-30)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '付费用户数';
							this.optionPie2.series[0].data = res.data.payuserdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}else if(value == '3'){
						var starttime = getAgo(-90)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							console.log(res)
							this.optionPie2.series[0].name = '付费用户数';
							this.optionPie2.series[0].data = res.data.payuserdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}
				}else if(this.zongdaiChange1val == '3'){
					if(value == '1'){
						var starttime = getAgo(-7)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '注册用户数';
							this.optionPie2.series[0].data = res.data.registdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}else if(value == '2'){
						var starttime = getAgo(-30)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							this.optionPie2.series[0].name = '注册用户数';
							this.optionPie2.series[0].data = res.data.registdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
					}else if(value == '3'){
						var starttime = getAgo(-90)
						var loading = this.$loading({
				          lock: true,
				          text: 'Loading',
				          spinner: 'el-icon-loading',
				          background: 'rgba(0, 0, 0, 0.7)'
				        });
						getDrawpie2Data(this.zongdaicode,starttime,endtime).then(res => {
							console.log(res)
							this.optionPie2.series[0].name = '注册用户数';
							this.optionPie2.series[0].data = res.data.registdata;
							this.zongdaili.setOption(this.optionPie2);
							loading.close();
						})
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
		height: auto;
		width: 100%;
		margin: 20px 0;
		background: #fff;
		border-radius: 5px;
		overflow: scroll;
	}
	.sstj_title,.rj_title {
		padding: 10px;
		color: #666;
	}
	.tjtb,.quyuBox,#qyzdlBox{
		margin: 10px 0;
		background: #fff;
		border-radius: 5px;
		font-size:12px;
		width: 100%;
		overflow: scroll;
	}
	#qyzdlBox{
		min-height: 700px;
	}
	.tjtb>p,.quyuBox>p,#qyzdlBox>p{
		padding: 10px;
		color: #666;
		font-size: 16px;
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
	.table {
		background: #f0f0f0;
		padding: 10px;
	}
</style>