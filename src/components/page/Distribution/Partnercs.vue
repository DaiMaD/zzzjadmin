<template>
	<div class="table">
		<div>
			<div class="xzbutton">
				<el-button type="primary" plain @click="clickone">总代理 / 合伙人</el-button>
			</div>

			<div v-show="boolean1">
				<div class="container">
					<div class="handle-box">
						<el-input size="medium" v-model="zdmobile" placeholder="请输入手机号" class="handle-select mr10" clearable></el-input>

						<el-select v-model="city">
							<el-option v-for="item in ddtypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-button type="primary" icon="search" @click="zongdaiSearch">查询</el-button>
						<el-button type="info" icon="add" @click="handleAdd">新增</el-button>
						<el-button type="info" icon="add" @click="qingchu">清除</el-button>
						<el-table :data="list" border style="width: 100%" stripe :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
							<el-table-column prop="name" label="总代理姓名" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="mobile" label="总代理手机号" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="city" label="地区" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="contract_start_time" label="合约生效时间" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="contract_year" label="签约期限（年）" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="gold_coin" label="金币收益" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="create_time" label="创建时间" width="200" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="update_time" label="修改时间" width="200" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column label="操作" width="250" fixed="right">
								<template slot-scope="scope">
									<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
									<el-button size="small" type="danger" @click="myDeletezdl(scope.$index, scope.row)">删除</el-button>
									<el-button size="small" type="danger" @click="myZdljbsy(scope.$index, scope.row)">金币明细</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>

			</div>
			<!-- 合伙人 -->
			<div v-show="boolean2">
				<!-- 搜索功能 -->
				<div class="container">
					<div class="handle-box">
						<el-form label-position="left" style="width: 100%">
							<el-input size="medium" v-model="mobilehhr" placeholder="请输入合伙人手机号" class="handle-select mr10" clearable></el-input>
							<el-input size="medium" v-model="mobilezdl" placeholder="请输入总代理手机号" class="handle-select mr10" clearable></el-input>
							<el-button type="primary" icon="search" @click="search">查询</el-button>
							<el-button type="info" icon="add" @click="handleAddhhr">新增</el-button>
							<el-button type="info" icon="add" @click="qingchu">清除</el-button>
						</el-form>
						<!-- 内容展示 -->
						<el-table :data="list1" border style="width: 100%" stripe :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
							<el-table-column prop="city_partner_name" label="合伙人姓名"></el-table-column>
							<el-table-column prop="city_partner_mobile" label="合伙人手机号"></el-table-column>
							<el-table-column prop="zongdai_name" label="上级总代理"></el-table-column>
							<el-table-column prop="zongdai_mobile" label="总代理手机号"></el-table-column>
							<el-table-column prop="contract_start_time" label="合同生效时间" :formatter="formatTime"></el-table-column>
							<el-table-column prop="contract_year" label="签约期限（年）"></el-table-column>
							<el-table-column prop="rate" label="收益分配(总代理|城市合伙人)"></el-table-column>
							<el-table-column prop="gold_coin" label="金币收益"></el-table-column>
							<el-table-column prop="create_time" label="创建时间" width="200" :formatter="formatTime"></el-table-column>
							<el-table-column prop="update_time" label="修改时间" width="200" :formatter="formatTime"></el-table-column>
							<el-table-column label="操作" width="250" fixed="right">
								<template slot-scope="scope">
									<el-button size="small" @click="handleEdithhr(scope.$index, scope.row)">编辑</el-button>
									<el-button size="small" type="danger" @click="myDeletehhr(scope.$index, scope.row)">删除</el-button>
									<el-button size="small" type="danger" @click="myZdljbsy(scope.$index, scope.row)">金币明细</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
			<!-- -------分页------------- -->
			<div v-if="boolean2" class="pagination">
				<el-pagination @current-change="handleCurrentChange2" layout="total, prev, pager, next" :total="this.total1"></el-pagination>
			</div>
			<!-- -------分页------------- -->
			<div v-else class="pagination">
				<el-pagination @current-change="handleCurrentChange1" layout="total, prev, pager, next" :total="this.total"></el-pagination>
			</div>
			<!--新增弹框 总代理-->
			<div class="categories-news" v-if="this.addFormVisible">
				<div class="categories-news-main">
					<div class="categories-news-content">
						<el-form :model="addForm" :rules="addFormRules" label-position="left" label-width="120px">
							<el-form-item label="总代理姓名:" prop="name">
								<el-input v-model="addForm.name"></el-input>
							</el-form-item>
							<el-form-item label="总代理手机号:" prop="mobile">
								<el-input v-model="addForm.mobile" width="90"></el-input>
							</el-form-item>
							<el-form-item label="负责推广区域:" prop="city">
								<el-select v-model="addForm.city">
									<el-option v-for="item in ddtypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item inline label="合约生效时间:" prop="contract_start_time" class="inline-block">
								<div class="inline-block">
									<span class="demonstration"></span>
									<el-date-picker v-model="addForm.contract_start_time" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp"></el-date-picker>
								</div>
							</el-form-item>
							<el-form-item label="签约期限:" prop="contract_year">
								<el-input size="medium" v-model="addForm.contract_year" placeholder="请输入签约期限" class="handle-select mr10" clearable></el-input>
							</el-form-item>
						</el-form>
					</div>
					<div class="categories-news-button">
						<button @click="confirmAdd">确定</button>
						<button @click="addFormVisible = false">取消</button>
					</div>
				</div>
			</div>

			<!--新增弹框 合伙人-->
			<div class="categories-news" v-if="this.addFormVisiblehhr">
				<div class="categories-news-main">
					<div class="categories-news-content">
						<el-form :model="addForm1" :rules="addFormRules1" label-position="left" label-width="120px">
							<el-form-item label="合伙人姓名:" prop="city_partner_name">
								<el-input v-model="addForm1.city_partner_name"></el-input>
							</el-form-item>
							<el-form-item label="合伙人手机号:" prop="city_partner_mobile">
								<el-input v-model="addForm1.city_partner_mobile" width="90"></el-input>
							</el-form-item>
							<el-form-item label="总代理姓名:" prop="zongdai_name">
								<el-input v-model="addForm1.zongdai_name" width="90"></el-input>
							</el-form-item>
							<el-form-item label="总代理手机号:" prop="zongdai_mobile">
								<el-input v-model="addForm1.zongdai_mobile" width="90"></el-input>
							</el-form-item>
							<el-form-item label="总代理邀请码:" prop="zongdai_invite_code">
								<el-input v-model="addForm1.zongdai_invite_code" width="90"></el-input>
							</el-form-item>
							<el-form-item label="合伙人邀请码:" prop="city_partner_invite_code">
								<el-input v-model="addForm1.city_partner_invite_code" width="90"></el-input>
							</el-form-item>
							<el-form-item inline label="合约生效时间:" prop="contract_start_time" class="inline-block">
								<div class="inline-block">
									<span class="demonstration"></span>
									<el-date-picker v-model="addForm1.contract_start_time" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp"></el-date-picker>
								</div>
							</el-form-item>
							<el-form-item label="签约期限:" prop="contract_year">
								<el-input v-model="addForm1.contract_year" placeholder="请输入签约期限"></el-input>
							</el-form-item>
							<el-form-item label="总代收益比例:" prop="zongdai_rate">
								<el-input v-model="addForm1.zongdai_rate" width="90"></el-input>
							</el-form-item>
							<el-form-item label="合伙人收益比例:" prop="city_partner_rate">
								<el-input v-model="addForm1.city_partner_rate" width="90"></el-input>
							</el-form-item>
						</el-form>
					</div>
					<div class="categories-news-button">
						<button @click="confirmAddhhr">确定</button>
						<button @click="addFormVisiblehhr = false">取消</button>
					</div>
				</div>
			</div>
			<!-- dialog -->
			<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
				<el-table :data="gridData" border style="width: 100%" :max-height="400" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
					<el-table-column prop="username" label="用户名"></el-table-column>
					<el-table-column prop="mobile" label="手机号"></el-table-column>
					<el-table-column prop="goldcoin_change" label="金币收益"></el-table-column>
					<el-table-column prop="create_time" label="下单时间" :formatter="formatTime"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		getZongdai,
		getCitypartner,
		getByMobile,
		getByTime,
		getByContractYear,
		zongdaigetByMobile,
		zongdaigetByTime,
		zongdaigetByContractYear,
		zongdaigetByCity,
		getByCheckStatus,
		postZongdai,
		putZongdai,
		postCitypartner,
		putcitypartner,
		goldCoinLog,
		deleteZongdai,
		Deletecitypartner,
		getByZDMobile
	} from "../../../api/api";
	import {
		formatDate,
		handleCommonAvatarSuccess,
		datetime_to_unix,
		formatDate_MM
	} from "../../Utility/Utility";
	export default {
		// data开始
		data() {
			var validateName = (rule, value, callback) => {
				if(/^\s*$/.test(value)) {
					callback(new Error("请输入正确的内容,不可以是空格"));
				} else {
					callback();
				}
			};
			return {
				cur_page: 1,
				size: 10,
				parentid: 1,
				list: [],
				list1: [],
				dlist: [],
				total: 0,
				total1: 0,
				contentShow: false,
				editShow: false,
				boola: false,
				mobilehhr: "",
				mobilezdl: "",
				boolean1: true,
				boolean2: false,
				// 搜索
				mobile: "", //手机号
				starttime: "", //时间
				Bytime: "", //总代时间
				yearnum: "", //期限
				zdyearnum: "", //总代期限
				zdmobile: "", //总代手机号
				city: "北京市", //总代地区
				//名称不能为空
				addFormRules: {
					name: [{
							required: true,
							message: "名称字段不能为空"
						},
						{
							validator: validateName,
							trigger: "blur"
						}
					],
					mobile: [{
							required: true,
							message: "手机号不能为空"
						},
						{
							validator: validateName,
							trigger: "blur"
						}
					],
					contract_year: [{
							required: true,
							message: "年限不能为空"
						},
						{
							validator: validateName,
							trigger: "blur"
						}
					]
				},
				//名称不能为空
				addFormRules1: {
					city_partner_name: [{
							required: true,
							message: "名称字段不能为空"
						},
						{
							validator: validateName,
							trigger: "blur"
						}
					],
					city_partner_mobile: [{
							required: true,
							message: "手机号不能为空"
						},
						{
							validator: validateName,
							trigger: "blur"
						}
					],
					contract_year: [{
							required: true,
							message: "年限不能为空"
						},
						{
							validator: validateName,
							trigger: "blur"
						}
					]
				},
				//订单状态
				ddtypeOptions: [{
						value: "北京市",
						label: "北京市"
					},
					{
						value: "上海市",
						label: "上海市"
					},
					{
						value: "天津市",
						label: "天津市"
					},
					{
						value: "重庆市",
						label: "重庆市"
					},
					{
						value: "山西省",
						label: "山西省"
					},
					{
						value: "辽宁省",
						label: "辽宁省"
					},
					{
						value: "吉林省",
						label: "吉林省"
					},
					{
						value: "黑龙江省",
						label: "黑龙江省"
					},
					{
						value: "江苏省",
						label: "江苏省"
					},
					{
						value: "浙江省",
						label: "浙江省"
					},
					{
						value: "安徽省",
						label: "安徽省"
					},
					{
						value: "福建省",
						label: "福建省"
					},
					{
						value: "江西省",
						label: "江西省"
					},
					{
						value: "山东省",
						label: "山东省"
					},
					{
						value: "河南省",
						label: "河南省"
					},
					{
						value: "河北省",
						label: "河北省"
					},
					{
						value: "湖南省",
						label: "湖南省"
					},
					{
						value: "湖北省",
						label: "湖北省"
					},
					{
						value: "广东省",
						label: "广东省"
					},
					{
						value: "海南省",
						label: "海南省"
					},
					{
						value: "四川省",
						label: "四川省"
					},
					{
						value: "贵州省",
						label: "贵州省"
					},
					{
						value: "云南省",
						label: "云南省"
					},
					{
						value: "陕西省",
						label: "陕西省"
					},
					{
						value: "甘肃省",
						label: "甘肃省"
					},
					{
						value: "青海省",
						label: "青海省"
					},
					{
						value: "台湾省",
						label: "台湾省"
					},
					{
						value: "新疆维吾尔自治区",
						label: "新疆维吾尔自治区"
					},
					{
						value: "宁夏回族自治区",
						label: "宁夏回族自治区"
					},
					{
						value: "西藏自治区",
						label: "西藏自治区"
					},
					{
						value: "广西壮族自治区",
						label: "广西壮族自治区"
					},
					{
						value: "内蒙古自治区",
						label: "内蒙古自治区"
					}
				],
				//订单来源
				ddlyOptions: [{
						value: 0,
						label: "全部"
					},
					{
						value: 1,
						label: "Android"
					},
					{
						value: 2,
						label: "iOS"
					},
					{
						value: 3,
						label: "小程序"
					}
				],
				dialogFormVisible: false,
				gridData: [],
				addForm: {
					name: "", //总代姓名
					mobile: "", //手机号
					city: "", //城市
					contract_start_time: 0, //合同开始时间
					contract_year: 1, //合同年限
					status: 1 //状态
				},
				addForm1: {
					city_partner_name: "", //城市合伙人姓名
					city_partner_mobile: "", //城市合伙人手机
					zongdai_name: "", //总代姓名
					zongdai_mobile: "", //总代手机
					contract_start_time: 0, //合约开始时间
					contract_year: 1, //合约年限
					zongdai_invite_code: "", //总代邀请码
					city_partner_invite_code: "", //合伙人邀请码
					zongdai_rate: "", //总代比例
					city_partner_rate: "", //合伙人比例
					status: 1 //状态
				},
				click_text: "总代理",
				selectResult: false,
				//新增界面是否显示
				addFormVisible: false,
				addFormVisiblehhr: false,
				//进度条是否显示
				progressVisible: false,
				progressPercent: 0,
				booler: 1
			};
			// return结束
		},
		// data结束
		mounted() {
			this.getData();
		},

		methods: {
			qingchu() {
				this.getData();
				this.zdmobile = "";
				this.city = "";
				this.Bytime = "";
				this.mobilehhr = "";
				this.mobilezdl = "";
				this.starttime = "";
				this.yearnum = "";
				// 合伙人数据展示
				getCitypartner(this.cur_page, this.size).then(res => {
					console.log(res.data.data);
					// this.list = res.data.data;
					if(!res.data.data ||
						res.data.data === [] ||
						res.data.data.length === 0
					) {
						if(this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData();
						} else {
							this.list1 = [];
						}
					} else {
						this.list1 = res.data.data;
						if (res.data.count) {
                this.total1 = res.data.count
             }else{
             		this.total1 = res.data.length
             }
					}
				});
			},
			// 总代理金币明细
			myZdljbsy(index, row) {
				console.log(row);
				console.log(row.user_id);
				goldCoinLog(row.user_id).then(res => {
					console.log(res.data.result);
					if(!res.data.result ||
						res.data.result === [] ||
						res.data.result.length === 0
					) {
						this.gridData = [];
					} else {
						this.gridData = res.data.result;
						if(res.data.count) {
							this.total = res.data.count;
						}else{
             		this.total = res.data.length
             }
					}
				});
				this.dialogFormVisible = true;
			},
			clickone(type) {
				if((type = "first")) {
					this.boolean1 = !this.boolean1;
				}
				if((type = "second")) {
					this.boolean2 = !this.boolean2;
				}
				console.log(this.boolean2);
				if(this.boolean2 == true) {
					// 合伙人数据展示
					getCitypartner(this.cur_page, this.size).then(res => {
						console.log(res.data.data);
						// this.list = res.data.data;
						if(!res.data.data ||
							res.data.data === [] ||
							res.data.data.length === 0
						) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list1 = [];
							}
						} else {
							this.list1 = res.data.data;
							if (res.data.count) {
                this.total1 = res.data.count
              }else{
             		this.total1 = res.data.length
             }
						}
					});
				} else {
					this.getData();
				}
			},
			//总代搜索
			zongdaiSearch() {
				// 总代手机号查询
				if(this.zdmobile !== "") {
					zongdaigetByMobile(this.zdmobile, this.cur_page, this.size).then(
						res => {
							if(!res.data.data ||
								res.data.data === [] ||
								res.data.data.length === 0
							) {
								if(this.cur_page - 1 > 0) {
									this.cur_page -= 1;
									this.getData();
								} else {
									this.list = [];
								}
							} else {
								this.list = res.data.data;
								if (res.data.count) {
	                this.total = res.data.count
	              }else{
	             		this.total = res.data.length
	             }
							}
						}
					);
					// 总代地区查询
				} else if(this.city !== "") {
					zongdaigetByCity(this.city, this.cur_page, this.size).then(res => {
						if(!res.data.data ||
							res.data.data === [] ||
							res.data.data.length === 0
						) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list = [];
							}
						} else {
							this.list = res.data.data;
							if (res.data.count) {
                this.total = res.data.count
              }else{
             		this.total = res.data.length
             	}
						}
					});
					// 总代签约日期查询
				} else if(this.Bytime !== "") {
					// 当日时间 00:00:00 当作起始时间 23:59:59当作结束时间
					let Dat = formatDate(this.Bytime); //当日日期

					//yyyy-MM-dd 转换成 时间戳
					let unix1 = datetime_to_unix(Dat);
					let unix2 = datetime_to_unix(Dat + 86399);
					zongdaigetByTime(unix1, unix2).then(res => {
						console.log(res);
						if(!res.data || res.data === [] || res.data.length === 0) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list = [];
							}
						} else {
							this.list = res.data;
							if (res.data.count) {
                this.total = res.data.count
              }else{
             		this.total = res.data.length
             	}
						}
					});
					// 总代按签约期限
				} else if(this.zdyearnum !== "") {
					console.log(this.zdyearnum);
					zongdaigetByContractYear(this.zdyearnum).then(res => {
						if(!res.data || res.data === [] || res.data.length === 0) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list = [];
							}
						} else {
							this.list = res.data;
							if (res.data.count) {
                this.total = res.data.count
              }else{
             		this.total = res.data.length
             	}
						}
					});
				}
			},
			//城市合伙人搜索
			search() {
				// 城市合伙人手机号查询
				if(this.mobilehhr !== "") {
					getByMobile(this.mobilehhr, this.cur_page, this.size).then(res => {
						console.log(this.mobilehhr);
						if(!res.data || res.data === [] || res.data.length === 0) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list1 = [];
							}
						} else {
							this.list1 = res.data.data;
							if(res.data.count) {
								this.total1 = res.data.count;
							}else{
             		this.total1 = res.data.length
             	}
						}
					});
					// 总代理手机号查询
				} else if(this.mobilezdl !== "") {
					getByZDMobile(this.mobilezdl, this.cur_page, this.size).then(res => {
						console.log(this.mobilezdl);
						if(!res.data || res.data === [] || res.data.length === 0) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list1 = [];
							}
						} else {
							this.list1 = res.data.data;
							if (res.data.count) {
                this.total1 = res.data.count
              }else{
             		this.total1 = res.data.length
             	}
						}
					});
					// 合伙人日期查询
				} else if(this.starttime !== "") {
					// 当日时间 00:00:00 当作起始时间 23:59:59当作结束时间
					let Dat = formatDate(this.starttime); //当日日期

					//yyyy-MM-dd 转换成 时间戳
					let unix1 = datetime_to_unix(Dat);
					let unix2 = datetime_to_unix(Dat + 86399);
					getByTime(unix1, unix2, this.cur_page, this.size).then(res => {
						if(!res.data || res.data === [] || res.data.length === 0) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list1 = [];
							}
						} else {
							this.list1 = res.data.data;
							if (res.data.count) {
                this.total1 = res.data.count
              }else{
             		this.total1 = res.data.length
             	}
						}
					});
					// 合伙人按签约期限
				} else if(this.yearnum !== "") {
					getByContractYear(this.yearnum, this.cur_page, this.size).then(res => {
						if(!res.data || res.data === [] || res.data.length === 0) {
							if(this.cur_page - 1 > 0) {
								this.cur_page -= 1;
								this.getData();
							} else {
								this.list1 = [];
							}
						} else {
							this.list1 = res.data.data;
							if (res.data.count) {
                this.total1 = res.data.count
              }else{
             		this.total1 = res.data.length
             	}
						}
					});
				}
			},
			// 总代理新增
			handleAdd() {
				this.select_cate = "";
				this.isEditForm = false;
				this.addForm = {
					name: "", //总代姓名
					mobile: "", //手机号
					city: "", //城市
					contract_start_time: 0, //合同开始时间
					contract_year: 1, //合同年限
					status: 1 //状态
				};
				this.addFormVisible = true;
			},
			// 合伙人新增
			handleAddhhr() {
				this.select_cate = "";
				this.isEditForm = false;
				this.addForm1 = {
					city_partner_name: "", //城市合伙人姓名
					city_partner_mobile: "", //城市合伙人手机
					zongdai_name: "", //总代姓名
					zongdai_mobile: "", //总代手机
					contract_start_time: 0, //合约开始时间
					contract_year: 1, //合约年限
					zongdai_invite_code: "", //总代邀请码
					city_partner_invite_code: "", //合伙人邀请码
					zongdai_rate: "", //总代比例
					city_partner_rate: "", //合伙人比例
					status: 1 //状态
				};
				this.addFormVisiblehhr = true;
			},
			//总代理新增弹框/编辑 确认按钮 点击
			confirmAdd() {
				if(this.isEditForm) {
					this.myPutActivityCityChange();
				} else {
					this.myPostActivityCityAdd();
				}
			},
			//合伙人新增弹框/编辑 确认按钮 点击
			confirmAddhhr() {
				if(this.isEditForm) {
					this.myPuhhrChange();
				} else {
					this.myhhrAdd();
				}
			},
			//新增
			myPostActivityCityAdd() {
				// 设置默认时间
				let myDate = new Date();
				this.addForm.contract_start_time = new Date(myDate).getTime();
				this.addForm1.contract_start_time = new Date(myDate).getTime();
				postZongdai(this.addForm).then(res => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.getData();
						this.$message({
							message: res.data,
							type: "error"
						});
					}
				});
			},
			//新增合伙人
			myhhrAdd() {
				// 设置默认时间
				let myDate = new Date();
				this.addForm.contract_start_time = new Date(myDate).getTime();
				this.addForm1.contract_start_time = new Date(myDate).getTime();
				postCitypartner(this.addForm1).then(res => {
					if(res.success === true) {
						this.addFormVisiblehhr = false;
						// 合伙人数据展示
						getCitypartner(this.cur_page, this.size).then(res => {
							console.log(res.data.data);
							// this.list = res.data.data;
							if(!res.data.data ||
								res.data.data === [] ||
								res.data.data.length === 0
							) {
								if(this.cur_page - 1 > 0) {
									this.cur_page -= 1;
									this.getData();
								} else {
									this.list1 = [];
								}
							} else {
								this.list1 = res.data.data;
								if(res.data.count) {
									this.total1 = res.data.count;
								}else{
             			this.total1 = res.data.length
             		}
							}
						});
					} else {
						// 合伙人数据展示
						getCitypartner(this.cur_page, this.size).then(res => {
							console.log(res.data.data);
							// this.list = res.data.data;
							if(!res.data.data ||
								res.data.data === [] ||
								res.data.data.length === 0
							) {
								if(this.cur_page - 1 > 0) {
									this.cur_page -= 1;
									this.getData();
								} else {
									this.list1 = [];
								}
							} else {
								this.list1 = res.data.data;
								if(res.data.count) {
									this.total1 = res.data.count;
								}else{
	             		this.total1 = res.data.length
	             	}
							}
						});
						this.$message({
							message: res.data,
							type: "error"
						});
					}
				});
			},
			//编辑按钮点击
			handleEdit(index, row) {
				this.text = row.content;
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					name: row.name, //总代姓名
					mobile: row.mobile, //手机号
					city: row.city, //城市
					contract_start_time: row.contract_start_time, //合同开始时间
					contract_year: row.contract_year, //合同年限
					status: 1 //状态
				};
				this.addFormVisible = true;
			},
			//编辑按钮点击
			handleEdithhr(index, row) {
				this.text = row.content;
				this.isEditForm = true;
				this.addForm1 = {
					id: row.id,
					city_partner_name: row.city_partner_name, //城市合伙人姓名
					city_partner_mobile: row.city_partner_mobile, //城市合伙人手机
					zongdai_name: row.zongdai_name, //总代姓名
					zongdai_mobile: row.zongdai_mobile, //总代手机
					contract_start_time: row.contract_start_time, //合约开始时间
					contract_year: row.contract_year, //合约年限
					zongdai_invite_code: row.zongdai_invite_code, //总代邀请码
					city_partner_invite_code: row.city_partner_invite_code, //合伙人邀请码
					zongdai_rate: row.zongdai_rate, //总代比例
					city_partner_rate: row.city_partner_rate, //合伙人比例
					status: 1 //状态
				};
				this.addFormVisiblehhr = true;
			},
			// 总代
			//编辑修改
			myPutActivityCityChange() {
				putZongdai(this.addForm, this.addForm.id).then(res => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.getData();
						this.$message({
							message: res.data,
							type: "error"
						});
					}
				});
			},
			//编辑修改  合伙人
			myPuhhrChange() {
				putcitypartner(this.addForm1, this.addForm1.id).then(res => {
					if(res.success === true) {
						this.addFormVisiblehhr = false;
						// 合伙人数据展示
						getCitypartner(this.cur_page, this.size).then(res => {
							console.log(res.data.data);
							// this.list = res.data.data;
							if(!res.data.data ||
								res.data.data === [] ||
								res.data.data.length === 0
							) {
								if(this.cur_page - 1 > 0) {
									this.cur_page -= 1;
									this.getData();
								} else {
									this.list1 = [];
								}
							} else {
								this.list1 = res.data.data;
								if(res.data.count) {
									this.total1 = res.data.count;
								}else{
	             		this.total1 = res.data.length
	             	}
							}
						});
					} else {
						// 合伙人数据展示
						getCitypartner(this.cur_page, this.size).then(res => {
							console.log(res.data.data);
							// this.list = res.data.data;
							if(!res.data.data ||
								res.data.data === [] ||
								res.data.data.length === 0
							) {
								if(this.cur_page - 1 > 0) {
									this.cur_page -= 1;
									this.getData();
								} else {
									this.list1 = [];
								}
							} else {
								this.list1 = res.data.data;
								if(res.data.count) {
									this.total1 = res.data.count;
								}else{
	             		this.total1 = res.data.length
	             	}
							}
						});

						this.$message({
							message: res.data,
							type: "error"
						});
					}
				});
			},
			getData() {
				// 总代数据展示
				getZongdai(this.cur_page, this.size).then(res => {
					console.log(res.data);
					// this.list = res.data.data;
					if(!res.data.data || res.data.data === [] || res.data.data.length === 0) {
						if(this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData();
						} else {
							this.list = [];
						}
					} else {
						this.list = res.data.data;
						if(res.data.count) {
							this.total = res.data.count;
						}else{
	         		this.total = res.data.data.length
	         	}
						console.log(this.total)
					}
				});
				// this.del_list=JSON.parse(JSON.stringify(this.list))
			},
			//删除总代理
			myDeletezdl(index, row) {
				// 新增删除提示
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						cancelButtonClass: "btn-custom-cancel",
						type: "warning"
					})
					.then(() => {
						deleteZongdai(row.id).then(res => {
							if(res.success === true) {
								this.select_cate = "";
								this.getData();
							}
						});

						this.$message({
							type: "success",
							message: "删除成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			//删除合伙人
			myDeletehhr(index, row) {
				// 新增删除提示
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						cancelButtonClass: "btn-custom-cancel",
						type: "warning"
					})
					.then(() => {
						Deletecitypartner(row.id).then(res => {
							if(res.success === true) {
								this.select_cate = "";
								// 合伙人数据展示
								getCitypartner(this.cur_page, this.size).then(res => {
									console.log(res.data.data);
									// this.list = res.data.data;
									if(!res.data.data ||
										res.data.data === [] ||
										res.data.data.length === 0
									) {
										if(this.cur_page - 1 > 0) {
											this.cur_page -= 1;
											this.getData();
										} else {
											this.list1 = [];
										}
									} else {
										this.list1 = res.data.data;
										if(res.data.count) {
										this.total1 = res.data.count;
									}else{
				         		this.total1 = res.data.length
				         	}
									}
								});
							}
						});

						this.$message({
							type: "success",
							message: "删除成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			//时间
			formatTime: function(row, column, cellValue) {
				return formatDate(cellValue);
			},
			//分页导航
			handleCurrentChange1(val) {
				console.log(val);
				// 总代数据展示
				getZongdai(this.cur_page, this.size).then(res => {
					console.log(res.data.data);
					// this.list = res.data.data;
					if(!res.data.data ||
						res.data.data === [] ||
						res.data.data.length === 0
					) {
						if(this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData();
						} else {
							this.list = [];
						}
					} else {
						this.list = res.data.data;
						if(res.data.count) {
							this.total = res.data.count;
						}else{
	         		this.total = res.data.length
	         	}
					}
				});
			},
			//分页导航
			handleCurrentChange2(val) {
				console.log(val);

				this.cur_page = val;
				// 合伙人数据展示
				getCitypartner(this.cur_page, this.size).then(res => {
					console.log(res.data.data);
					// this.list = res.data.data;
					if(!res.data.data ||
						res.data.data === [] ||
						res.data.data.length === 0
					) {
						if(this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData();
						} else {
							this.list1 = [];
						}
					} else {
						this.list1 = res.data.data;
						if(res.data.count) {
							this.total1 = res.data.count;
						}else{
	         		this.total1 = res.data.length
	         	}
					}
				});
			}
		}
	};
</script>

<style scoped>
	.handle-box {
		width: 100%;
	}
	/* .el-form{
  display: flex;
} */
	
	.el-input {
		margin: 0 20px 0 0;
	}
	
	.el-input__inner {
		width: 77%;
	}
	
	.el-input__inner,
	.el-select {
		margin: 0 20px 0 0;
	}
	/* .container{
  width: 1200px
} */
	
	button {
		height: 30px;
	}
	
	.el-table {
		width: 1200px;
	}
	
	.xzbutton span {
		margin: 20px;
		font-size: 14px;
	}
	.pagination{
		margin: 0 !important;
		padding: 20px !important;
		background: #fff !important;
	}
</style>