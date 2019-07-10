<template>
	<div class="table">
		<div class="crumbs">
			<!-- 选择题 -->
			<div class="container">
				<div class="handle-box">
					<el-select v-model="zhengshuval" placeholder="选择证书类型/级别" @change="selectType">
						<el-option v-for="item in zhengshutype" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="shenpival" placeholder="选择批改状态" @change="selectStatus">
						<el-option v-for="item in shenyuestatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
					<el-button type="info" icon="add" @click="qingchu">清除</el-button>
				</div>
				<el-table :data="list" border max-height="400" style="width: 100%" ref="multipleTable" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
					<el-table-column type="selection" min-width="55" fixed></el-table-column>
					<el-table-column type="index" :index="indexMethod" min-width="80" fixed></el-table-column>
					<el-table-column prop="paper_no" label="试卷编号" min-width="100" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="user_name" label="学员名称" min-width="100" :show-overflow-tooltip="true"></el-table-column>
					<!--<el-table-column prop="user_mobile" label="手机号" width="100"></el-table-column>-->
					<el-table-column prop="subject" label="证书类型" min-width="150" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="paper_status" label="批改状态" min-width="100" :formatter="formatStatus" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="check_person" label="批改人" min-width="100" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="exam_time" label="考试时间" min-width="100" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="check_time" label="批改时间" min-width="100" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" min-width="100" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="操作" min-width="100" fixed="right">
						<template slot-scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">批改</el-button>
							<!--<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>-->
						</template>
					</el-table-column>
				</el-table>
				<!-- -------分页------------- -->
				<div class="pagination">
		          <el-pagination
		           	background
	        			@size-change="handleSizeChange"
		      		@current-change="handleCurrentChange"
		      		:page-sizes="[10, 20, 30, 40]"
		      		:page-size="10"
		      		layout="total, sizes, prev, pager, next, jumper"
		      		:total="this.total"
		          ></el-pagination>
		        </div>
				<!--新增弹框-->
				<div class="categories-news" v-if="this.addFormVisible">
					<div class="categories-news-main">
						<div class="categories-news-title">
							<span>{{this.isEditForm?'批改':'新增'}}</span>
							<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
						</div>
						<div class="categories-news-content">
							<el-form :model="addForm" label-position="left" label-width="120px">
								<div class="title_jj">
									<p class="shnehename">
										<span>批改人:</span>&nbsp;&nbsp;&nbsp;
										<el-input style="width:160px;" v-model="addForm1.checkperson" placeholder="请输入批改人姓名 "  prop="peoples"/>
										<button @click="confirmAdd()" class="pigaiBtn" v-if="isPigai">提交</button>
									</p>
								</div>
								<!-- <div class="title_zs"><p>{{addForm1.subject}}</p></div> -->
								<div class="title_jj fubiaoti">
									<span>{{ guizeText }}</span>
								</div>
								<div class="title_jj jiandadata">
									<span>{{ jiandaText }}</span>
								</div>
								<ol id="list_ol">
									<li v-for="(datad, index) in jiandadata" :key="index" class="bianju">
										<div class="lirou">
											<p class="title_jj tigan">
												{{datad.content}} &nbsp;&nbsp;&nbsp;
												<el-input style="width:100px;" v-model="fraction[index]" placeholder="本题得分: "/>
											</p>
											<p class="myanswer">
												<span>我的答案:</span><br /> {{datad.my_answer}}
											</p>
											<br />
											<p>
												<p>正确答案:</p>
												<p class="jiandaSt">{{datad.answer}}</p>

											</p>
											<p>
												<span>答案解析:</span> {{datad.answer_desc}}
											</p>
										</div>
									</li>
								</ol>
								<div class="title_jj zonghedata">
									<span>{{ zongheText }}</span>
								</div>
								<ol id="list_ol">
									<li v-for="(dataf, index) in zonghedata" :key="index" class="bianju">
										<div class="lirou">
											<p class="title_jj tigan">
												{{dataf.content}} &nbsp;&nbsp;&nbsp;
												<el-input style="width:100px;" v-model="fraction2[index]" placeholder="本题得分: "/>
											</p>
											<p class="myanswer">
												<span>我的答案:</span><br /> {{dataf.my_answer}}
											</p>
											<p>
												<span>正确答案:</span>
												<p class="zongheSt">{{dataf.answer}}</p>
											</p>
											<p>
												<span>答案解析:</span> {{dataf.answer_desc}}
											</p>
										</div>
									</li>
								</ol>
								<div class="title_jj danxuanti">
									<span>{{ danxuanText }}</span>
								</div>
								<ol id="list_ol">
									<li v-for="(datay, index) in datas" :key="index" class="bianju danxuanbox" ref='danxuanbox'>
										<div class="lirou">
											<p class="title_jj tigan">
												{{datay.content}} &nbsp;&nbsp;&nbsp;
												<span style="color:red;">本题得分为: {{datay.my_mark}}</span>
											</p>
											<p>
												<span>选项A--</span> {{datay.option_a}}
											</p>
											<p>
												<span>选项B--</span> {{datay.option_b}}
											</p>
											<p>
												<span>选项C--</span> {{datay.option_c}}
											</p>
											<p>
												<span>选项D--</span> {{datay.option_d }}
											</p>
											<p>
												<span>我的答案==></span> {{datay.my_answer}}
											</p>
											<p>
												<span>正确答案==></span> {{datay.answer}}
											</p>

										</div>
									</li>
								</ol>
								<div class="title_jj danxuanti">
									<span>{{ duoxuanText }}</span>
								</div>
								<ol id="list_ol">
									<li v-for="(datab, index) in duoxuandata" :key="index" class="bianju">
										<div class="lirou">
											<p class="title_jj tigan">
												{{datab.content}} &nbsp;&nbsp;&nbsp;
												<span style="color:red;">本题得分为: {{datab.my_mark}}</span>
											</p>
											<p>
												<span>选项A--</span> {{datab.option_a}}
											</p>
											<p>
												<span>选项B--</span> {{datab.option_b}}
											</p>
											<p>
												<span>选项C--</span> {{datab.option_c}}
											</p>
											<p>
												<span>选项D--</span> {{datab.option_d}}
											</p>
											<p>
												<span>我的答案==></span> {{datab.my_answer}}
											</p>
											<p>
												<span>正确答案==></span> {{datab.answer}}
											</p>
										</div>
									</li>
								</ol>
								<div class="title_jj panduandata">
									<span>{{ panduanText }}</span>
								</div>
								<ol id="list_ol">
									<li v-for="(datac, index) in panduandata" :key="index" class="bianju">
										<div class="lirou">
											<p class="title_jj tigan">
												{{datac.content}} &nbsp;&nbsp;&nbsp;
												<span style="color:red;">本题得分为: {{datac.my_mark}}</span>
											</p>
											<p>
												<span>我的答案==></span> {{datac.my_answer}}
											</p>
											<p>
												<span>正确答案==></span> {{datac.answer}}
											</p>
										</div>
									</li>
								</ol>
							</el-form>
						</div>
						<div class="categories-news-button">
							<button @click="confirmAdd()" v-if="isPigai">提交</button>
							<button @click="addFormVisible = false">关闭</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import "quill/dist/quill.core.css";
	import "quill/dist/quill.snow.css";
	import "quill/dist/quill.bubble.css";
	import { quillEditor } from "vue-quill-editor";
	import {
		getpanduanti,
		addpanduanti,
		putpanduanti,
		Deletepanduanti,
		searchpanduanti,
		createPaper,
		getPaperList,
		getPaperInfo,
		paperScore,
		paperscoreid,
		commitUserPaper,
		selectSubjectData,
		selectPaperStatusData
	} from "../../../api/api";
	import {
		formatDate,
		handleCommonAvatarSuccess,
		handleCommonAudioSuccess
	} from "../../Utility/Utility";
	import { get } from "../../../api";
	const toolbarOptions = [
		["bold", "italic", "underline", "strike"], // toggled buttons
		["blockquote", "code-block"],

		[{
			header: 1
		}, {
			header: 2
		}], // custom button values
		[{
			list: "ordered"
		}, {
			list: "bullet"
		}],
		[{
			script: "sub"
		}, {
			script: "super"
		}], // superscript/subscript
		[{
			indent: "-1"
		}, {
			indent: "+1"
		}], // outdent/indent
		[{
			direction: "rtl"
		}], // text direction

		[{
			size: ["small", false, "large", "huge"]
		}], // custom dropdown
		[{
			header: [1, 2, 3, 4, 5, 6, false]
		}],

		[{
			color: []
		}, {
			background: []
		}], // dropdown with defaults from theme
		[{
			font: []
		}],
		[{
			align: []
		}],
		["link", "image", "video"],
		["clean"] // remove formatting button
	];
	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if(/^\s*$/.test(value)) {
					callback(new Error("请输入正确的内容,不可以是空格"));
				} else {
					callback();
				}
			};
			return {
				zhengshuval: '', //证书筛选初始值
				shenpival: '', //批改状态筛选初始值
				guizeText: '规则', //试题规则
				danxuanText: '单选介绍',
				duoxuanText: '多选介绍',
				panduanText: '判断介绍',
				jiandaText: '简答介绍',
				zongheText: '综合介绍',
				jiandalength:0,
				zonghelength:0,
				iszonghe:true,
				select_cate: "",
				cur_page: 1,
				list: [],
				total: 0,
				size: 10,
				contentShow: false,
				editShow: false,
				text: "",
				pushtype: "1",
				size: 10,

				fraction: [], //简答分数
				fraction2: [""], //综合分数
				isPigai: true,

				datas: [],
				duoxuandata: [],
				panduandata: [],
				jiandadata: [],
				zonghedata: [],

				//选择题==新增界面是否显示
				addFormVisible: false,
				//判断题==新增界面是否显示
				addFormVisible_pd: false,
				//简答题==新增界面是否显示
				addFormVisible_jd: false,
				//综合题==新增界面是否显示
				addFormVisible_zh: false,
				//进度条是否显示
				progressVisible: false,
				progressPercent: 0,
				//新增界面数据
				addForm: {
					id: "",
					user_id: "",
					certificate: 0, //证书类型
					paperlevel: "", //证书级别
					subject: "", //考试科目
					papermonth: "", //试卷考期
					papertime: "", //考试时间
					paper_total_score: "", //试卷总分
					paper_pass_score: "", //合格分数
					learn_time: "", //学习时长
				},
				addForm1: {
					user_id: "", //用户id
					papersocreid: "", //答题id
					checkperson: "", //阅卷人
					checkresult: "" //主观题得分数据
				},
				editorOption: {
					placeholder: "",
					theme: "snow", // or 'bubble'
					modules: {
						toolbar: {
							container: toolbarOptions, // 工具栏
							handlers: {
								image: function(value) {
									if(value) {
										document.querySelector(".avatar-uploader input").click();
									} else {
										this.quillEditor.format("image", false);
									}
								}
							}
						}
					}
				},
				isEditForm: false, //是否是编辑页面
				//分类状态
				statusOptions: [{
						value: 0,
						label: "不可用"
					},
					{
						value: 1,
						label: "可用"
					}
				], //付费属性
				typesOptions: [{
						value: 1,
						label: "金融管理师"
					},
					{
						value: 2,
						label: "金融理财师"
					}
				],
				//是否推荐
				recommendOptions: [{
						value: "单选",
						label: "单选"
					},
					{
						value: "多选",
						label: "多选"
					}
				],
				//是否推荐上首页/  home
				homeOptions: [{
						value: 0,
						label: "下线"
					},
					{
						value: 1,
						label: "上线"
					}
				],
				zhengshutype: [{
						value: "互联网金融管理师初级",
						label: "互联网金融管理师初级"
					},
					{
						value: "互联网金融管理师中级",
						label: "互联网金融管理师中级"
					},
					{
						value: "互联网金融理财师初级",
						label: "互联网金融理财师初级"
					},
					{
						value: "互联网金融理财师中级",
						label: "互联网金融理财师中级"
					}
				],
				shenyuestatus: [{
						value: 0,
						label: "未批改"
					},
					{
						value: 1,
						label: "已批改"
					}
				]
			};
		},
		created() {
			this.getData();
		},
		computed: {},
		methods: {
			indexMethod(index) {
				return index + 1;
			},
			qingchu() {
				this.getData();
				this.zhengshuval = "";
				this.shenpival = "";
			},
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await paperScore(this.cur_page, this.size).then(res => {
					console.log(res);
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
						}
					}
				});
				this.del_list = JSON.parse(JSON.stringify(this.list));
			},
			//点击批改时
			handleEdit(index, row) {
				this.isEditForm = true;
				if(row.paper_status == 1){
					this.isPigai = false
				}else if(row.paper_status == 0){
					this.isPigai = true
				}
				this.addForm1 = {
					user_id: '', //用户id
					papersocreid: '', //答题id
					checkperson: '', //阅卷人
					checkresult: '' //主观题得分数据
				};
				self = this;
				if(row.paper_no.indexOf('JRGLCJ') > -1 || row.paper_no.indexOf('JRLCCJ') > -1) {
					this.zonghedataShow = false;
					this.duoxuandataShow = false;
					this.guizeText = '共分为三个部分，总分100分，答题时间120分钟'
					this.danxuanText = '单选题：'
					this.duoxuanText = ''
					this.panduanText = '判断题：'
					this.jiandaText = '简答题：每小题8分'
					this.zongheText = ''
				} else if(row.paper_no.indexOf('JRGLZJ') > -1 || row.paper_no.indexOf('JRLCZJ') > -1) {
					this.zonghedataShow = true;
					this.duoxuandataShow = true;
					this.guizeText = '共分为五个部分，总分100分，答题时间120分钟'
					this.danxuanText = '单选题：'
					this.duoxuanText = '多选题：'
					this.panduanText = '判断题：'
					this.jiandaText = '简答题：每小题8分'
					this.zongheText = '综合题：每小题20分'
				}

				this.addForm = {
					id: row.id,
					user_id: row.user_id,
					paper_no: row.paper_no,
					subject: row.subject,
					paper_status: row.paper_status,
					check_person: row.check_person,
					check_time: row.check_time,
					create_time: row.create_time
					
				};
				var self = this;
				var inx = index;
				paperscoreid(this.addForm.id).then(res => {
					self.datas = res.data.danxuandata;
					self.duoxuandata = res.data.duoxuandata;
					self.panduandata = res.data.panduandata;
					self.jiandadata = res.data.jiandadata;
					self.zonghedata = res.data.zonghedata;
					console.log('iszonghe')
					console.log(self.zonghedata.length)
					self.jiandalength = res.data.jiandadata.length
					self.zonghelength = res.data.zonghedata.length
					console.log(res.data.jiandadata.length)
					console.log(res.data.zonghedata.length)
					for(var i = 0; i < res.data.jiandadata.length;i++){
						this.fraction[i] = res.data.jiandadata[i].my_mark
						this.addForm1.checkperson = row.check_person
					}
				});
				this.addFormVisible = true;
			},
			//批改弹窗 确认按钮 点击
			confirmAdd() {
				var self = this;
				console.log(this.addForm1.checkperson == '')
				//点击提交检测所有输入分值的输入框
				if (this.fraction.indexOf("") > -1 || this.addForm1.checkperson == ''){
					for (let i = 0; i < this.zonghelength; i++) {
						if (this.fraction2[i] == '') {
							var jige = i+1
							this.$alert('请填写第'+jige+'综合题分数', '请完整填写', {
					          confirmButtonText: '确定',
					          callback: action => {
					          	document.querySelector('.categories-news').scrollTop=0;
					          }
					       })
							
						}
					}
					for (let i = 0; i < this.jiandalength; i++) {
						if (this.fraction[i] == '') {
							var jige = i+1
							this.$alert('请填写第'+jige+'简答题分数', '请完整填写', {
					          confirmButtonText: '确定',
					          callback: action => {
					          	document.querySelector('.categories-news').scrollTop=0;
					          }
					       })
							
						}
					}
					if (this.addForm1.checkperson == '') {
						this.$alert('请填写审批人', '请完整填写', {
					          confirmButtonText: '确定',
					          callback: action => {
					          	document.querySelector('.categories-news').scrollTop=0;
					          }
					       })
					}
					
					
					
					
				}else{
					//点击提交提示确认提交弹框
					this.$confirm("确认提交?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						cancelButtonClass: "btn-custom-cancel",
						type: "warning"
					})
					.then(() => {
						let check = "";
						let check2 = "";
						let data_l = "";
						let data_2 = "";
						
						for(let i = 0; i < self.jiandadata.length; i++) {
							check = self.jiandadata[i].score_detail_id;
							var list = '"id":'+check+',"my_mark":'+this.fraction[i]+'#';
							data_l += list;
						}
						for(let i = 0; i < self.zonghedata.length; i++) {
							if(self.zongheText == ''){
								data_2 = ''
								console.log('没有综合题')
							}else {
								check2 = self.zonghedata[i].score_detail_id;
								var list2 = '"id":'+check2+',"my_mark":'+this.fraction2[i]+'#';
								data_2 += list2;
								console.log('有综合题')
							}
							
						}
						this.addForm1 = {
							user_id: this.addForm.user_id, //用户id
							papersocreid: this.addForm.id, //答题id
							checkperson: this.addForm1.checkperson, //阅卷人
							checkresult: data_l +data_2 //主观题得分数据
						};
						commitUserPaper(this.addForm1).then(res => {
							this.$message({
								type: "success",
								message: "提交成功!"
							});
							this.getData();
						});
						this.addFormVisible = false;
					})
					.catch((res) => {
						console.log(res)
						this.$message({
							type: "info",
							message: "已取消提交"
						});
					});
				}
						
				
				

			},
			//分页导航
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			handleSizeChange(val){
	      		this.size = val
	      		this.getData();
	      		document.getElementById("table").setAttribute("style","height: 1100px !important");
	      	},
			//根据试题编号搜索---选择题

			search() {
				if(this.select_cate !== "") {
					searchpanduanti(parseInt(this.select_cate)).then(res => {
						if(res.data == null) {
							this.list = null;
						} else {
							this.list = JSON.parse(JSON.stringify(this.del_list));
							this.list.splice(0, this.list.length, res.data);
						}
					});
				} else {
					this.list = JSON.parse(JSON.stringify(this.del_list));
				}
			},
			selectType(value) {
				console.log(value);
				selectSubjectData(value).then(res => {
					this.list = res.data
				})

			},
			selectStatus(value) {
				console.log(value)
				selectPaperStatusData(value).then(res => {
					this.list = res.data
				})
			},
			//------选择题删除--------
			myDelete(index, row) {
				console.log(row)
				// 新增删除提示
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						cancelButtonClass: "btn-custom-cancel",
						type: "warning"
					})
					.then(() => {

						Deletepanduanti(row.id).then(res => {
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

			//点击选中被删除项
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			//下拉框/时间值处理
			//批改状态
			formatStatus: function(row, column, cellValue) {
				if(cellValue === 0) {
					return "未批改";
				} else {
					return "已批改";
				}
			},
			//属性状态判断
			formatType: function(row, column, cellValue) {
				if(cellValue === 1) {
					return "单选";
				} else {
					return "多选";
				}
			},
			//推荐判断
			formatRecommend: function(row, column, cellValue) {
				if(cellValue === 1) {
					return "金融管理师";
				} else {
					return "金融理财师";
				}
			},
			//home判断
			formatHome: function(row, column, cellValue) {
				if(cellValue === 0) {
					return "否";
				} else {
					return "是";
				}
			},
			//时间
			formatTime: function(row, column, cellValue) {
				if(cellValue == null || cellValue == '' || cellValue == []){
					return '无'
				}else{
					return formatDate(cellValue);
				}
				
			},
			//详情
			isContentShow(index, row) {
				this.contentShow = true;
				console.log("hang", row);
				console.log(row.content);
				this.addForm.content = row.content;
			},
			//编辑富文本
			isEditShow(index, row) {
				this.editShow = true;
			},

			//取消编辑
			cancelEditing() {
				console.log(this.addForm.content);
				this.editShow = false;
				this.text = this.addForm.content;
			},

			submit() {
				this.addForm.content = this.text;
				this.editShow = false;
				this.$message.success("内容修改成功！");
				this.text = "";
			}
		},
		components: {
			quillEditor
		}
	};
</script>

<style scoped>
	.pigaiBtn {
		float: right;
		height: 36px;
		line-height: 36px;
		width: 60px;
		cursor: pointer;
		border: 1px solid #bfcbd9;
		background: #20a0ff;
		color: #fff;
		;
		outline: 0;
		border-radius: 4px;
		margin-left: 10px;
	}
	
	input {
		margin: 2px;
	}
	
	.title_zs,
	.fubiaoti,
	.danxuanti {
		font-size: 18px;
	}
	
	.tigan {
		font-weight: bold;
		font-size: 16px;
	}
	
	.shnehename span {
		font-size: 18px;
	}
	
	#list_ol {
		margin-left: 20px;
	}
	
	.lirou p {
		font-size: 14px;
	}
	
	.myanswer {
		background: #eee;
		min-height: 80px;
		border-radius: 5px;
		padding: 10px 10px;
	}
	
	.jiandaSt {
		font-size: 12px;
	}
	
	.zongheSt {
		font-size: 12px;
	}
	
	.el-input--small .el-input__inner {}
	
	.title_jj {
		margin: 10px 0;
	}
</style>