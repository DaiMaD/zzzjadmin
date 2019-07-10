<template>
	<div class="table">
		<div class="crumbs">
			<!-- 选择题 -->
			<div class="container">
				<div class="handle-box">
					<el-select v-model="addForm.certification_type" placeholder="选择证书类型/级别" @change="selectStatus">
						<el-option v-for="item in zhengshutype" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
					<div class="addbtn">
						<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
							<i class="el-icon-info addbtn2"></i>
						</el-tooltip>
						<el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
					</div>
					<el-button type="info" icon="add" @click="qingchu">清除</el-button>
				</div>
				<el-table :data="list" border stripe max-height="400" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
					<el-table-column type="selection" width="55" fixed></el-table-column>
					<el-table-column prop="certification_type" label="证书类型/级别" :formatter="formatType" width="150" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="paper_total_score" label="总分数" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="subject" label="考试科目" width="150" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="paper_pass_score" label="合格分数" :show-overflow-tooltip="true"></el-table-column>
					<!--<el-table-column prop="learn_time" label="学习时长最低值"></el-table-column>-->
					<el-table-column prop="paper_time" label="考试总时长(分钟)" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="status" label="状态" :formatter="formatStatus" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" width="100" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="update_time" label="修改时间" width="100" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="操作" width="230" fixed="right">
						<template slot-scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
							<el-button type="primary" icon="add" @click="buttonchouti(scope.$index, scope.row)">抽题</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- -------分页------------- -->
				<div class="pagination">
					<el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next" :total="this.total"></el-pagination>
				</div>
				<!--新增弹框-->
				<div class="categories-news" v-if="this.addFormVisible">
					<div class="categories-news-main">
						<div class="categories-news-title">
							<span>{{this.isEditForm?'修改':'新增'}}</span>
							<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
						</div>
						<div class="categories-news-content">
							<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="120px">
								<el-form-item label="证书类型:" prop="certification_type">
									<el-select v-model="getZhengshuVal" placeholder="选择证书类型/级别" @change="changeType">
										<el-option v-for="item in getZhengshuData" :key="item.certification_type" :label="item.subject" :value="item.certification_type"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="总分数:" prop="paper_total_score">
									<el-input v-model="addForm.paper_total_score"></el-input>
								</el-form-item>

								<el-form-item label="考试科目:" prop="subject">
									<el-input v-model="addForm.subject"></el-input>
								</el-form-item>

								<el-form-item label="合格分数:" prop="paper_pass_score">
									<el-input v-model="addForm.paper_pass_score"></el-input>
								</el-form-item>

								<!--<el-form-item label="学习时长最低值:" prop="learn_time">
                  <el-input v-model="addForm.learn_time"></el-input>
                </el-form-item>-->

								<el-form-item label="考试总时长(分钟):" prop="paper_time">
									<el-input v-model="addForm.paper_time"></el-input>
								</el-form-item>

								<el-form-item label="状态:" prop="status">
									<el-select v-model="addForm.status" placeholder="是否上线">
										<el-option v-for="item in homeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
						</div>
						<div class="categories-news-button">
							<button @click="confirmAdd">确定</button>
							<button @click="addFormVisible = false">取消</button>
						</div>
					</div>
				</div>

				<!--详情-->
				<div class="categories-news" v-if="this.contentShow">
					<div class="categories-news-main categories-content-main">
						<div class="categories-news-title">
							<span>详情</span>
							<i class="iconfont icon-msnui-close-fat" @click="contentShow = false"></i>
						</div>
						<div class="categories-news-content" v-html="this.addForm.content"></div>
					</div>
				</div>

				<!--富文本弹框-->
				<div class="categories-news" v-if="this.editShow">
					<div class="categories-news-main categories-content-main">
						<div class="categories-news-title">
							<span>详情</span>
							<i class="iconfont icon-msnui-close-fat" @click="cancelEditing"></i>
							<el-upload class="avatar-uploader uploader-none" :show-file-list="false" action :on-change="handleTextImageSuccess" :auto-upload="false">
								<!-- :on-success="uploadSuccess" -->
								<!-- :on-error="uploadError" -->
								<!-- :before-upload="beforeUpload" -->
							</el-upload>
						</div>
						<div class="categories-news-content">
							<quill-editor ref="myQuillEditor" v-model="text" :options="editorOption"></quill-editor>
							<el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
						</div>
					</div>
				</div>

				<!--进度条弹框-->
				<div class="categories-news" v-if="this.progressVisible">
					<!--<el-progress :text-inside="true" :stroke-width="18" :percentage="this.progressPercent"></el-progress>-->

					<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
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
		getgenPaper,
		postgenPaper,
		putgenPaper,
		deletegenPaper,
		searchpanduanti,
		createPaper,
		certificationSubject,
		selectPaperTypeData
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
				getZhengshuData: [],
				getZhengshuVal: '',
				select_cate: "",
				cur_page: 1,
				list: [],
				total: 0,
				size: 10,
				contentShow: false,
				editShow: false,
				text: "",
				pushtype: "1",
				zhengshuType: 1,
				zhengshuLevel: 1,
				// 名称不能为空
				addFormRules: {
					paper_total_score: [{
							required: true,
							message: '总分数不能为空'
						},
						{
							validator: validateName,
							trigger: 'blur'
						}
					],
					subject: [{
							required: true,
							message: '课程名称不能为空'
						},
						{
							validator: validateName,
							trigger: 'blur'
						}
					],
					paper_pass_score: [{
							required: true,
							message: '合格分数不能为空'
						},
						{
							validator: validateName,
							trigger: 'blur'
						}
					],
					learn_time: [{
							required: true,
							message: '学习最低时长不能为空'
						},
						{
							validator: validateName,
							trigger: 'blur'
						}
					],
					paper_time: [{
							required: true,
							message: '考试时长不能为空'
						},
						{
							validator: validateName,
							trigger: 'blur'
						}
					],
				},
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
					certification_type: '', //证书类型
					paper_total_score: "", //试卷总分
					paper_pass_score: "", //试卷合格分数
					learn_time: "", //申请考试时学习时长
					paper_time: "", //考试时长
					numbers: 0, //试卷数量
					status: 0, //状态（1 上线 0下线）
					paper_level: 1, //考试级别（1 初级  2 中级）
					paper_month: "初七", //试卷考期
					subject: "" //考试科目
				},
				addForm1: {
					certificate: 1, //证书类型
					papertime: "", //考试时长
					paperlevel: 1, //考试级别（1 初级  2 中级）
					papermonth: "", //试卷考期
					subject: "" //考试科目
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
				//    statusOptions: [
				//      {
				//        value: 0,
				//        label: "不可用"
				//      },
				//      {
				//        value: 1,
				//        label: "可用"
				//      }
				//    ], //付费属性
				//    typesOptions: [
				//      {
				//        value: 1,
				//        label: "初级"
				//      },
				//      {
				//        value: 2,
				//        label: "中级"
				//      }
				//    ],
				//是否推荐
				//    recommendOptions: [
				//      {
				//        value: "单选",
				//        label: "单选"
				//      },
				//      {
				//        value: "多选",
				//        label: "多选"
				//      }
				//    ],
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
						value: 1,
						label: "互联网金融管理师初级"
					},
					{
						value: 2,
						label: "互联网金融管理师中级"
					},
					{
						value: 3,
						label: "互联网金融理财师初级"
					},
					{
						value: 4,
						label: "互联网金融理财师中级"
					}
				],
				shenyuestatus: [{
						value: 1,
						label: "未审阅"
					},
					{
						value: 2,
						label: "以审阅"
					}
				]
			};
		},
		created() {
			this.getData();
			this.getZhengshu();
			var _this = this;
			document.onkeydown = function(event) {
				var e = window.event || arguments.callee.caller.arguments[0];
				if(e.keyCode == 75) {
					_this.addKey();
				}
				if(e.keyCode == 27) {
					_this.closeKey();
				}
			};
		},
		computed: {},
		methods: {
			addKey() {
				this.isEditForm = false;
				this.handleAdd();
				this.addFormVisible = true;
			},
			closeKey() {
				this.addFormVisible = false;
			},
			changeType(value) {
				console.log(value)
				this.addForm.certification_type = value;
				if(value == 1 || value == 3) {
					this.addForm.paper_level = 1;
				} else if(value == 2 || value == 4) {
					this.addForm.paper_level = 2;
				}
			},
			indexMethod(index) {
				return index + 1;
			},
			qingchu() {
				this.addForm.certification_type = '';
				this.getData();
				this.addForm.zhengshutype = "";
			},
			// 点击抽题,将当前选择的参数值赋值给addForm并提示
			buttonchouti(index, row) {
				var self = this;
				if(row.certification_type == 1) {
					self.zhengshuType = 1;
					self.zhengshuLevel = 1;
				} else if(row.certification_type == 2) {
					self.zhengshuType = 1;
					self.zhengshuLevel = 2;
				} else if(row.certification_type == 3) {
					self.zhengshuType = 2;
					self.zhengshuLevel = 1;
				} else if(row.certification_type == 4) {
					self.zhengshuType = 2;
					self.zhengshuLevel = 2;
				}
				console.log('证书类型' + this.zhengshuType)
				console.log('证书等级' + this.zhengshuLevel)
				this.addForm1 = {
					certificate: self.zhengshuType, //证书类型
					subject: row.subject, //考试科目
					paperlevel: self.zhengshuLevel, //考试级别（1 初级  2 中级）
					papermonth: row.paper_month, //试卷考期
					papertime: row.paper_time, //考试时长
					papertotalscore: row.paper_total_score, //试卷总分
					paperpassscore: row.paper_pass_score, //试卷合格分数
					learntime: row.learn_time, //学习时长
					paperlistid: row.id //试卷id
				};
				console.log(this.addForm1)
				this.$confirm("是否抽选此类形题?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						cancelButtonClass: "btn-custom-cancel",
						type: "warning"
					})
					.then(() => {
						createPaper(this.addForm1).then(res => {
							console.log(res);
						});
						this.$message({
							type: "success",
							message: "成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消"
						});
					});
			},
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await getgenPaper(this.cur_page, this.size).then(res => {
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
						console.log(this.list)
						if(res.data.count) {
							this.total = res.data.count;
						}
					}
				});
				this.del_list = JSON.parse(JSON.stringify(this.list));
			},
			getZhengshu() {
				certificationSubject(this.cur_page, this.size).then(res => {
					this.getZhengshuData = res.data.data;
				})
			},
			selectStatus(value) {
				console.log(value)
				selectPaperTypeData(value).then(res => {
					this.list = res.data;
				})
			},
			//分页导航
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
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
			//

			//------删除--------
			myDelete(index, row) {
				// 新增删除提示
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						cancelButtonClass: "btn-custom-cancel",
						type: "warning"
					})
					.then(() => {
						deletegenPaper(row.id).then(res => {
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

			//再次获取数据，以消除分页后单页数据数量减少
			//批量删除
			batchDelete() {
				let str = "";
				this.multipleSelection.forEach((selection, index) => {
					str += `${selection.id},`;
				});
				if(str.endsWith(",")) {
					str = str.slice(0, -1);
				}

				postCoursesList(str).then(res => {
					if(res.success === true) {
						this.getData();
					}
				});
			},

			//点击选中被删除项
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			//新增弹框按钮点击显示==选择题
			handleAdd() {
				this.select_cate = "";
				this.text = "";
				this.isEditForm = false;
				this.addForm = {
					certification_type: 0, //证书类型
					paper_total_score: "", //试卷总分
					paper_pass_score: "", //试卷合格分数
					learn_time: "", //申请考试时学习时长
					paper_time: "", //考试时长
					numbers: 0, //试卷数量
					status: 0, //状态（1 上线 0下线）
					paper_level: 1, //考试级别（1 初级  2 中级）
					paper_month: "初七", //试卷考期
					subject: "" //考试科目
				};
				this.addFormVisible = true;
			},
			//新增
			myPostCoursesAdd() {
				//  	console.log(this.addForm);
				postgenPaper(this.addForm).then(res => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: "error"
						});
					}
				});
			},
			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs["addForm"].validate(valid => {
					if(valid) {
						if(this.isEditForm) {
							this.myPutCoursesChange();
						} else {
							this.myPostCoursesAdd();
						}
					}
				});
			},
			//选择题编辑按钮点击
			handleEdit(index, row) {
				// this.text=row.content;
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					certification_type: row.certification_type, //证书类型
					paper_total_score: row.paper_total_score, //试卷总分
					paper_pass_score: row.paper_pass_score, //试卷合格分数
					paper_time: row.paper_time, //考试时长
					numbers: row.numbers, //试卷数量
					status: row.status, //状态（1 上线 0下线）
					paper_level: row.paper_level, //考试级别（1 初级  2 中级）
					paper_month: row.paper_month, //试卷考期
					subject: row.subject //考试科目
				};
				console.log(this.addForm);
				this.addFormVisible = true;
			},
			//----------选择题修改--------------
			myPutCoursesChange() {
				putgenPaper(this.addForm, this.addForm.id).then(res => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: "error"
						});
					}
				});
			},
			//下拉框/时间值处理
			//分类状态判断
			formatStatus: function(row, column, cellValue) {
				if(cellValue === 0) {
					return "不可用";
				} else {
					return "可用";
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
				if(cellValue == null || cellValue == '' || cellValue == [] || cellValue == 0) {
					return '无'
				} else {
					return formatDate(cellValue);
				}
			},
			formatType: function(row, column, cellValue) {
				if(cellValue == 1) {
					return '互联网金融管理师初级'
				}
				if(cellValue == 2) {
					return '互联网金融管理师中级'
				}
				if(cellValue == 3) {
					return '互联网金融理财师初级'
				}
				if(cellValue == 4) {
					return '互联网金融理财师中级'
				}
			},
			formatStatus: function(row, column, cellValue) {
				if(cellValue == 0) {
					return '下线'
				}
				if(cellValue == 1) {
					return '上线'
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
	.handle-box {
		height: 32px;
	}
	
	.handle-box .addbtn {
		float: right;
	}
</style>