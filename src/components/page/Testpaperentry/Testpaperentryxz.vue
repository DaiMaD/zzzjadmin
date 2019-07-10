<template>
	<div class="table">
		<div class="crumbs">
			<!-- 选择题 -->
			<div class="container">
				<div class="handle-box">
					<el-input size="medium" v-model="examContent" placeholder="根据题干关键字查询" class="handle-select mr10" clearable ref='examcontent'></el-input>
					<el-input size="medium" v-model="examContent2" placeholder="课程名称查询" class="handle-select mr10" clearable ref='examcontent2'></el-input>

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
					<!--<el-table-column prop="answer" label="证书类型" width="100" :formatter="formatRecommend"></el-table-column>-->
					<el-table-column prop="from_person" label="出题人" width="50"></el-table-column>
					<el-table-column prop="course_name" label="课程名称" width="100" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="course_teacher" label="课程老师" width="100"></el-table-column>
					<el-table-column prop="type" label="题型" width="100"></el-table-column>
					<el-table-column prop="order" label="试题编号" width="100"></el-table-column>
					<el-table-column prop="content" label="题干" width="300" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="option_a" label="选项A" width="300" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="option_b" label="选项B" width="300" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="option_c" label="选项C" width="100" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="option_d" label="选项D" width="100" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="status" label="状态" width="70" :formatter="formatStatus"></el-table-column>
					<el-table-column prop="answer" label="正确答案" width="70"></el-table-column>
					<el-table-column prop="value" label="分值"></el-table-column>
					<el-table-column label="操作" width="180" fixed="right">
						<template slot-scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- -------分页------------- -->
				<div class="pagination">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
					</el-pagination>
				</div>
				<!--新增弹框  选择题-->
				<div class="categories-news" v-if="this.addFormVisible">
					<div class="categories-news-main">
						<div class="categories-news-title">
							<span>{{this.isEditForm?'修改':'新增'}}</span>
							<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
						</div>
						<div class="categories-news-content">
							<el-form :model="addForm" ref="addForm" label-position="left" label-width="120px">
								<el-form-item label="证书类型:" prop="certificate_type">
									<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox><br />
									<el-checkbox-group v-model="checkType" @change="checkMoreChange">
										<el-checkbox v-for="items in getZhengshuData" :label="items.subject" :key="items.value" class="check_type"></el-checkbox>
									</el-checkbox-group>
								</el-form-item>

								<el-form-item label="出题人:" prop="from_person">
									<el-input v-model="addForm.from_person"></el-input>
								</el-form-item>

								<el-form-item label="课程名称:" prop="course_name">
									<el-input v-model="addForm.course_name"></el-input>
								</el-form-item>

								<el-form-item label="课程老师:" prop="course_teacher">
									<el-input v-model="addForm.course_teacher"></el-input>
								</el-form-item>

								<el-form-item label="题型:" prop="type">
									<el-select v-model="addForm.type">
										<el-option v-for="item in recommendOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="试题编号:" prop="order">
									<el-input v-model="addForm.order"></el-input>
								</el-form-item>

								<el-form-item label="题干:" prop="content">
									<el-input v-model="addForm.content" width="90"></el-input>
								</el-form-item>

								<el-form-item label="选项:">
									<el-input placeholder="选项A" v-model="addForm.option_a" width="90"></el-input>
									<el-input placeholder="选项B" v-model="addForm.option_b" width="90"></el-input>
									<el-input placeholder="选项C" v-model="addForm.option_c" width="90"></el-input>
									<el-input placeholder="选项D" v-model="addForm.option_d" width="90"></el-input>
								</el-form-item>

								<el-form-item label="正确答案:" prop="answer">
									<el-input v-model="addForm.answer" width="90"></el-input>
								</el-form-item>

								<el-form-item label="分值:" prop="value">
									<el-input v-model="addForm.value" width="90"></el-input>
								</el-form-item>

								<el-form-item label="答案解析:" prop="answer_desc">
									<el-input v-model="addForm.answer_desc" width="90"></el-input>
								</el-form-item>

								<el-form-item label="状态:" prop="status">
									<el-select v-model="addForm.status">
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
		getxuanzeti,
		addxuanzeti,
		putxuanzeti,
		Deletexuanzeti,
		searchxuanzeti,
		getpanduanti,
		addpanduanti,
		certificationSubject,
		searchxuanzeti2,
		searchxuanzeti3
	} from "../../../api/api";
	import {
		formatDate,
		handleCommonAvatarSuccess,
		handleCommonAudioSuccess
	} from "../../Utility/Utility";
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
				checkType: ['互联网金融理财师初级'],
				checkAll: false,
				isIndeterminate: true,
				allZhengshuType: [],
				examContent: '',
				examContent2: '',
				select_cate: "",
				cur_page: 1,
				list: [],
				total: 0,
				size: 20,
				contentShow: false,
				editShow: false,
				text: "",
				pushtype: "1",
				//名称不能为空
				// addFormRules: {
				//   name: [
				//     { required: true, message: '名称字段不能为空' },
				//     { validator: validateName, trigger: 'blur' }
				//   ],
				//   lecturer: [
				//     { required: true, message: '讲师名称不能为空' },
				//     { validator: validateName, trigger: 'blur' }
				//   ],
				//   ori_price: [
				//     { required: true, message: '原始价格不能为空' },
				//     { validator: validateName, trigger: 'blur' }
				//   ],
				//   sale_price: [
				//     { required: true, message: '销售价格不能为空' },
				//     { validator: validateName, trigger: 'blur' }
				//   ],

				// },
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
					is_jrglcj_certification: 0, //金融管理初级
					is_jrglzj_certification: 0, //金融管理中级
					is_jrglgj_certification: 0, //金融管理高级
					is_jrlccj_certification: 0, //金融理财初级
					is_jrlczj_certification: 0, //金融理财中级
					is_jrlcgj_certification: 0, //金融理财高级
					from_person: "", //出题人
					course_name: "", //课程名称
					course_teacher: "", //课程老师
					type: "", //题型
					order: "", //试题编号
					content: "", //题干
					option_a: "", //选项A
					option_b: "", //选项B
					option_c: "", //选项C
					option_d: "", //选项D
					answer: "", //正确答案
					value: "", //分值
					answer_desc: "", //答案解析
					status: 0
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
						value: "单选题",
						label: "单选题"
					},
					{
						value: "多选题",
						label: "多选题"
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
				]
			};
		},
		created() {
			this.getData();
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
			qingchu() {
				this.examContent = '';
				this.addForm.certification_type = '';
				this.examContent2 = '';
				this.getData();
				this.select_cate = "";
			},
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() { //页码，每页数量
				await getxuanzeti(this.cur_page, this.size).then(res => {
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
						this.total = res.data.count;
						console.log(this.total)
						console.log(res.data)
					}
				});
				this.del_list = JSON.parse(JSON.stringify(this.list));
			},
			//分页导航
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			handleSizeChange(val) {
				this.size = val
				this.getData();
				document.getElementById("table").setAttribute("style", "height: 1100px !important");
			},
			//根据试题编号搜索---选择题

			search() {
				//				var examcontent = this.$refs.examcontent.value;
				//				var examcontent2 = this.$refs.examcontent2.value;
				if(this.examContent != '') {
					searchxuanzeti(this.examContent, 1, this.size).then(res => {
						console.log(res)
						this.list = res.data.data;
					});
				} else if(this.examContent2 != '') {
					searchxuanzeti3(this.examContent2, 1, this.size).then(res => {
						console.log(res)
						this.list = res.data.data;
					});
				}

			},

			selectStatus(value) {
				console.log(value, 1, this.size)
				searchxuanzeti2(value, 1, this.size).then(res => {
					console.log(res)
					this.list = res.data.data
				})
			},

			//
			checkZhengshuType(value) {
				console.log(value)
			},
			//------选择题删除--------
			myDelete(index, row) {
				// 新增删除提示
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						cancelButtonClass: "btn-custom-cancel",
						type: "warning"
					})
					.then(() => {
						Deletexuanzeti(row.id).then(res => {
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
				this.addForm = {
					is_jrglcj_certification: 0, //金融管理初级
					is_jrglzj_certification: 0, //金融管理中级
					is_jrglgj_certification: 0, //金融管理高级
					is_jrlccj_certification: 0, //金融理财初级
					is_jrlczj_certification: 0, //金融理财中级
					is_jrlcgj_certification: 0, //金融理财高级
					from_person: "", //出题人
					course_name: "", //课程名称
					course_teacher: "", //课程老师
					type: "", //题型
					order: "", //试题编号
					content: "", //题干
					answer: "", //正确答案
					value: "", //分值
					answer_desc: "", //答案解析
					status: 0
				}
				this.allZhengshuType = [];
				this.checkType = ["互联网金融理财师初级"]

				certificationSubject(this.cur_page, this.size).then(res => {
					console.log(res.data.data)
					this.getZhengshuData = res.data.data;
					for(let i = 0; i < res.data.data.length; i++) {
						console.log(res.data.data[i].subject, res.data.data[i].certification_type)
						this.allZhengshuType.push(res.data.data[i].subject)
					}
					console.log(this.allZhengshuType)
				})
				this.select_cate = "";
				this.text = "";
				this.isEditForm = false;
				this.addFormVisible = true;
			},
			//新增
			myPostCoursesAdd() {
				//				console.log('新增')
				//				console.log(this.checkType)
				if(this.checkType.indexOf("互联网金融管理师初级") > -1) {
					this.addForm.is_jrglcj_certification = 1;
				}
				if(this.checkType.indexOf("互联网金融管理师中级") > -1) {
					this.addForm.is_jrglzj_certification = 1
				}
				if(this.checkType.indexOf("互联网金融理财师初级") > -1) {
					this.addForm.is_jrlccj_certification = 1
				}
				if(this.checkType.indexOf("互联网金融理财师中级") > -1) {
					this.addForm.is_jrlczj_certification = 1
				}
				console.log(this.addForm)
				addxuanzeti(this.addForm).then(res => {
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
			handleCheckAllChange(val) {
				//				
				this.checkType = val ? this.allZhengshuType : [];
				this.isIndeterminate = false;
				console.log(this.checkType)
			},
			checkMoreChange(value) {
				console.log(value)
				console.log(this.checkType)
				var checkVal = value;
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.allZhengshuType.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.allZhengshuType.length;
			},
			//选择题编辑按钮点击
			handleEdit(index, row) {
				this.checkType = ['互联网金融管理师初级']
				//获取所有证书
				certificationSubject(this.cur_page, this.size).then(res => {
					//					console.log(res.data.data)
					this.getZhengshuData = res.data.data;
					//					console.log(this.getZhengshuData)
					for(let i = 0; i < res.data.data.length; i++) {
						//						console.log(res.data.data[i].subject, res.data.data[i].certification_type)
						this.allZhengshuType.push(res.data.data[i].subject)
					}
				})
				if(row.is_jrglcj_certification == 1) {
					this.checkType.push('互联网金融管理师初级')
				}
				if(row.is_jrglcj_certification == 0) {
					this.checkType.splice(this.checkType.indexOf('互联网金融管理师初级'), 1)
				}
				if(row.is_jrglzj_certification == 1) {
					this.checkType.push('互联网金融管理师中级')
				}
				if(row.is_jrglzj_certification == 0) {
					this.checkType.splice(this.checkType.indexOf('互联网金融管理师中级'), 1)
				}
				if(row.is_jrlccj_certification == 1) {
					this.checkType.push('互联网金融理财师初级')
					console.log(this.checkType)
				}
				if(row.is_jrlccj_certification == 0) {
					this.checkType.splice(this.checkType.indexOf('互联网金融理财师初级'), 1)
				}
				if(row.is_jrlczj_certification == 1) {
					this.checkType.push('互联网金融理财师中级')
				}
				if(row.is_jrlczj_certification == 0) {
					this.checkType.splice(this.checkType.indexOf('互联网金融理财师中级'), 1)
				}
				this.text = row.content;
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					certificate_type: row.certificate_type,
					from_person: row.from_person,
					course_name: row.course_name,
					course_teacher: row.course_teacher,
					type: row.type,
					order: row.order,
					content: row.content,
					option_a: row.option_a,
					option_b: row.option_b,
					option_c: row.option_c,
					option_d: row.option_d,
					answer: row.answer,
					value: row.value,
					answer_desc: row.answer_desc,
					status: row.status
				};
				this.addFormVisible = true;
			},
			//----------选择题修改--------------
			myPutCoursesChange() {
				console.log('修改')
				putxuanzeti(this.addForm, this.addForm.id).then(res => {
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
			//属性状态判断
			//  formatType: function(row, column, cellValue) {
			//    if (cellValue === 1) {
			//      return "单选";
			//    } else {
			//      return "多选";
			//    }
			//  },
			//推荐判断
			formatRecommend: function(row, column, cellValue) {

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
				return formatDate(cellValue);
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
	.check_type {
		margin-left: 30px;
	}
	
	.handle-box {
		height: 32px;
	}
	
	.handle-box .addbtn {
		float: right;
	}
</style>