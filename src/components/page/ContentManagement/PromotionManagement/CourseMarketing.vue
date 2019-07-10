<template>
	<div class="table">
		<div class="container">
			<div class="handle-box">
				<div class="addbtn">
					<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
						<i class="el-icon-info addbtn2"></i>
					</el-tooltip>
					<el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
				</div>
			</div>
			<el-table :data="list" border max-height="680" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
				<el-table-column type="selection" min-width="55"></el-table-column>
				<el-table-column prop="course_name" label="套课名称" min-width="100"></el-table-column>
				<el-table-column prop="poster_img1" label="海报" min-width="140">
					<template slot-scope="scope">
						<a :href="scope.row.poster_img1" target="true"><img :src="scope.row.poster_img1" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="poster_img2" label="长海报" min-width="140">
					<template slot-scope="scope">
						<a :href="scope.row.poster_img2" target="true"><img :src="scope.row.poster_img2" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="QR_code" label="小程序码" min-width="140">
					<template slot-scope="scope">
						<a :href="scope.row.QR_code" target="true"><img :src="scope.row.QR_code" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" :formatter="formatTime" min-width="140"></el-table-column>
				<el-table-column prop="update_time" label="修改时间" :formatter="formatTime" min-width="140"></el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="this.size" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
				</el-pagination>
			</div>
			<!--新增弹框一级-->
			<div class="categories-news" v-if="this.addFormVisible">
				<div class="categories-news-main">
					<div class="categories-news-title">
						<span>{{this.isEditForm?'修改':'新增'}}</span>
						<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
					</div>
					<div class="categories-news-content">
						<div class="addoreditwrap">
							<!--课程-->
							<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
								<el-form-item label="课程名称:" prop="course_name">
									<el-input placeholder="请输入课程名称" v-model="addForm.course_name" ref="searchText"></el-input>
									<el-button type="primary" icon="search" @click="searchExam" class="sbtn sbtn1">搜索</el-button>
								</el-form-item>
								<el-form-item label="海报:" prop="poster_img1">
									<el-input v-model="addForm.poster_img1"></el-input>
									<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="长海报:" prop="poster_img2">
									<el-input v-model="addForm.poster_img2"></el-input>
									<el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="小程序码:" prop="QR_code">
									<el-input v-model="addForm.QR_code"></el-input>
									<el-button @click="selectMedia3" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="促销价:" prop="promotional_price">
									<el-input v-model="addForm.promotional_price"></el-input>
									<div class="sbtn sbtn1">
										<span class="inputText">元</span>
									</div>
								</el-form-item>
								<el-form-item label="状态:" prop="status">
									<el-select v-model="addForm.status">
										<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<div class="categories-news-button">
								<button @click="confirmAdd">确定</button>
								<button @click="addFormVisible = false">取消</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!--新增弹框二级-->
			<div class="categories-news" v-if="this.selectExam">
				<div class="categories-news-main">
					<div class="categories-news-title">
						<i class="iconfont icon-msnui-close-fat" @click="selectExam = false"></i>
					</div>
					<div class="categories-news-content">
						<div class="addoreditwrap">
							<!--大讲堂课程列表-->
							<span id="">大讲堂课程列表</span>
							<el-table :data="examList1" :max-height="400" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
								<el-table-column prop="name" label="课程名称" min-width="100"></el-table-column>
								<el-table-column prop="lecturer" label="课程老师" min-width="100"></el-table-column>
								<el-table-column prop="ori_price" label="原价" min-width="100"></el-table-column>
								<el-table-column label="操作" width="100">
									<template slot-scope="scope">
										<el-button size="small" @click="confirmSelectExamdjt(scope.$index, scope.row)">选择</el-button>
									</template>
								</el-table-column>
							</el-table>
							<!--商学院课程列表-->
							<span id="">商学院课程列表</span>
							<el-table :data="examList2" :max-height="400" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
								<el-table-column prop="name" label="课程名称" min-width="100"></el-table-column>
								<el-table-column prop="lecturer" label="课程老师" min-width="100"></el-table-column>
								<el-table-column prop="ori_price" label="原价" min-width="100"></el-table-column>
								<el-table-column label="操作" width="100">
									<template slot-scope="scope">
										<el-button size="small" @click="confirmSelectExamsxy(scope.$index, scope.row)">选择</el-button>
									</template>
								</el-table-column>
							</el-table>
							<!--fm课程列表-->
							<span id="">fm课程列表</span>
							<el-table :data="examList3" :max-height="400" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
								<el-table-column prop="name" label="课程名称" min-width="100"></el-table-column>
								<el-table-column prop="lecturer" label="课程老师" min-width="100"></el-table-column>
								<el-table-column prop="ori_price" label="原价" min-width="100"></el-table-column>
								<el-table-column label="操作" width="100">
									<template slot-scope="scope">
										<el-button size="small" @click="confirmSelectExamfm(scope.$index, scope.row)">选择</el-button>
									</template>
								</el-table-column>
							</el-table>
							<div class="categories-news-button">
								<button @click="selectExam = false">取消</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia" @overSelectFile="overSelectFile"></media-select>
      <media-select v-if="isSelect2" @close="closeMedia" @overSelectMedia="overSelectMedia2" @overSelectFile="overSelectFile2"></media-select>
      <media-select v-if="isSelect3" @close="closeMedia" @overSelectMedia="overSelectMedia3" @overSelectFile="overSelectFile3"></media-select>
			<!--进度条弹框-->
			<div class="categories-news" v-if="this.progressVisible">
				<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
			</div>
		</div>
	</div>
</template>

<script>
	import { getExamcuxiao, putExamcuxiao, deleteHomeBannerOne, postExamcuxiao, DelExamcuxiao, getPicURL, getAllexam } from '../../../../api/api';
	import { formatDate, handleCommonAvatarSuccess } from '../../../Utility/Utility'

	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if(/^\s*$/.test(value)) {
					callback(new Error('请输入正确的姓名,不可以是空格'));
				} else {
					callback();
				}
			};
			return {
				isSelect:false,
      		isSelect2:false,
      		isSelect3:false,
				select_cate: '', //查询id
				list: [], //数据
				examList1: [], //大讲堂课程列表
				examList2: [], //商学院课程列表
				examList3: [], //fm课程列表
				del_list: [], //查询时缓存的全部数据
				cur_page: 1, //当前页
				total: 0,
				size: 10,
				selectExam: false,
				//新增界面是否显示
				addFormVisible: false,
				//名称不能为空
				addFormRules: {
					name: [{
							required: true,
							message: '名称字段不能为空'
						},
						{
							validator: validateName,
							trigger: 'blur'
						}
					]
				},
				parentOptions: [{
					value: 1,
					label: '大讲堂'
				}, {
					value: 2,
					label: '商学院'
				}, {
					value: 3,
					label: 'FM'
				}],
				//新增界面数据
				addForm: {
					status: 0,
					parent_id: 0,
					course_name: '',
					poster_img1: '',
					poster_img2: '',
					QR_code: '',
					promotional_price: ''
				},
				//是否是编辑页面
				isEditForm: false,

				//进度条是否显示
				progressVisible: false,
				progressPercent: 0,
				statusOptions: [{
					value: 0,
					label: '下线'
				}, {
					value: 1,
					label: '上线'
				}]
			}
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
			selectMedia(){
  			this.isSelect = true;
  		},
  		selectMedia2(){
  			this.isSelect2 = true;
  		},
  		selectMedia3(){
  			this.isSelect3 = true;
  		},
  		closeMedia(){
			this.isSelect = false
			this.isSelect2 = false
			this.isSelect3 = false
		},
  		overSelectMedia(str){
			this.addForm.poster_img1 = str
		},
		overSelectFile(str){
			this.addForm.poster_img1 = str
		},
		overSelectMedia2(str){
			this.addForm.poster_img2 = str
		},
		overSelectFile2(str){
			this.addForm.poster_img2 = str
		},
		overSelectMedia3(str){
			this.addForm.QR_code = str
		},
		overSelectFile3(str){
			this.addForm.QR_code = str
		},
			formatStatus: function(row, column, cellValue) {
				if(cellValue === 0) {
					return '下线';
				} else {
					return '上线';
				}
			},

			formatType: function(row, column, cellValue) {
				switch(cellValue) {
					case 1:
						return '课程';
						break;
					case 2:
						return '活动';
						break;
					case 3:
						return '长海报';
						break;
					case 4:
						return '商学院';
						break;
					case 5:
						return '长海报支付';
						break;
				}

			},
			classType: function(row, column, cellValue) {
				switch(cellValue) {
					case 1:
						return '大讲堂';
						break;
					case 2:
						return '商学院';
						break;
					case 3:
						return 'FM';
						break;
				}

			},
			//时间
			formatTime: function(row, column, cellValue) {
				if(cellValue) {
					return formatDate(cellValue)
				} else {
					return ''
				}
			},
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {

				getExamcuxiao().then(res => {
					console.log(res)
					if(!res.data.data || res.data.data == [] || res.data.data == 0) {
						if(this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData()
						} else {
							this.list = [];
						}
					} else {
						this.list = res.data.data;
						if(res.data.count) {
							this.total = res.data.count
						}
					}

				});
				this.del_list = JSON.parse(JSON.stringify(this.list))
			},

			//分页导航
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			handleSizeChange(val) {
				this.size = val
				this.getData();
			},
			//删除
			myDelete(index, row) {
				// 新增删除提示
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: "btn-custom-cancel",
					type: 'warning'
				}).then(() => {
					DelExamcuxiao(row.id).then((res) => {
						if(res.success === true) {
							this.select_cate = '';
							this.getData();
						}
					});
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			//点击选中被删除项
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			//新增弹框显示
			handleAdd() {
				this.select_cate = '';
				this.isEditForm = false;
				this.addForm = {
					status: 0,
					course_name: '',
					poster_img1: '',
					poster_img2: '',
					QR_code: '',
					parent_id: 0
				};

				this.addFormVisible = true;
			},

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					console.log(valid);
					if(valid) {
						if(this.isEditForm) {
							this.myPutHomeBannerChange();
						} else {
							this.myPostHomeBannerAdd();
						}
					}
				})

			},

			//新增
			myPostHomeBannerAdd() {
				console.log(this.addForm)
				postExamcuxiao(this.addForm).then(res => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
						this.$message({
							type: 'success',
							message: '新增成功!'
						});
					} else {
						this.$message({
							message: res.data,
							type: "error"
						})
					}
				})
			},
			searchExam(row) {
				this.selectExam = true;
				console.log(this.addForm.course_name)
				getAllexam(this.addForm.course_name).then(res => {
					console.log(res)
					this.examList1 = res.data.djtcourse
					this.examList2 = res.data.sxycourse
					this.examList3 = res.data.fmcourse
				})
			},
			confirmSelectExamdjt(index, row) {
				this.selectExam = false
				console.log(row)
				this.addForm.parent_id = 1
				this.addForm.course_name = row.name
			},
			confirmSelectExamsxy(index, row) {
				this.selectExam = false
				console.log(row)
				this.addForm.parent_id = 2
				this.addForm.course_name = row.name
			},
			confirmSelectExamfm(index, row) {
				this.selectExam = false
				console.log(row)
				this.addForm.parent_id = 3
				this.addForm.course_name = row.name
			},

			//编辑按钮点击
			handleEdit(index, row) {
				this.isEditForm = true;
				this.addForm = {
					status: row.status,
					id: row.id,
					parent_id: row.parent_id,
					course_name: row.course_name,
					poster_img1: row.poster_img1,
					poster_img2: row.poster_img2,
					QR_code: row.QR_code,
					promotional_price: row.promotional_price
				};
				this.addFormVisible = true;

			},

			//修改
			myPutHomeBannerChange() {
				console.log(this.addForm)
				putExamcuxiao(this.addForm.id, this.addForm).then(res => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
						this.$message({
							type: 'success',
							message: '编辑成功!'
						});
					} else {
						this.$message({
							message: res.data,
							type: 'error'
						});
					}
				})
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		height: 32px;
	}
	
	.handle-box .addbtn {
		float: right;
	}
	
	.payBox {
		margin-top: 16px;
	}
	
	.sbtn {
		margin: 0 !important;
		width: 85px !important;
	}
	
	.sbtn1 {
		margin-left: 38px !important;
	}
	
	.inputText {}
</style>