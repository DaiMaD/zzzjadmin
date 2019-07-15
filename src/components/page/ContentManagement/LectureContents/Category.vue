<template>
	<div class="table" id="table">
		<!---------------->
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
				<el-input size="medium" v-model="select_cate" placeholder="请输入关键词查询" class="handle-select mr10" clearable>
				</el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<div class="addbtn">
					<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
						<i class="el-icon-info addbtn2"></i>
					</el-tooltip>
					<el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
				</div>
			</div>
			<el-table :data="list" border max-height="800" style="width: 100%" ref="multipleTable"
				@selection-change="handleSelectionChange"
				:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
				<el-table-column type="selection" width="55" fixed="left"></el-table-column>
				<el-table-column prop="id" label="分类ID" min-width="60" fixed></el-table-column>
				<el-table-column prop="lecturer" label="类别名称" min-width="80"></el-table-column>
				<el-table-column prop="learn_people" label="默认学习人数" min-width="80"></el-table-column>
				<el-table-column prop="head_img" label="banner图" min-width="100">
					<template slot-scope="scope">
						<a :href="scope.row.head_img" target="true"><img :src="scope.row.head_img" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="分类状态" min-width="100" :formatter="formatStatus"></el-table-column>
				</el-table-column>
				<el-table-column label="操作" min-width="180" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>

			</el-table>

			<!--详情-->
			<div class="categories-news" v-if="this.contentShow">
				<div class="categories-news-main categories-content-main">
					<div class="categories-news-title">
						<span>详情</span>
						<i class="iconfont icon-msnui-close-fat" @click="contentShow = false"></i>
					</div>
					<div class="categories-news-content" v-html="this.addForm.content">
					</div>
				</div>
			</div>

			<!-- -------分页------------- -->
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
					:total="this.total">
				</el-pagination>
			</div>

			<!-- ------------新增弹框------------- -->
			<div class="categories-news" v-if="this.addFormVisible">
				<div class="categories-news-main">
					<div class="categories-news-title">
						<span>新增</span>
						<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
					</div>
					<div class="categories-news-content">
						<el-form :model="addForm" ref="addForm" label-position="left" label-width="80px">
							<el-form-item label="类别头像" prop="cover_img">
								<el-input v-model="addForm.cover_img"></el-input>
								<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
							<el-form-item label="类别名称 :" prop="lecturer">
								<el-input v-model="addForm.lecturer"></el-input>
							</el-form-item>
							<el-form-item label="频道简介:" prop="position">
								<el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.position"></el-input>
							</el-form-item>
							<el-form-item label="灼见标题:" prop="zhuojian_title">
								<el-input v-model="addForm.zhuojian_title"></el-input>
							</el-form-item>
							<el-form-item label="默认学习人数:" prop="learn_people">
								<el-input v-model="addForm.learn_people"></el-input>
							</el-form-item>
							<el-form-item label="banner图" prop="head_img">
								<el-input v-model="addForm.head_img"></el-input>
								<el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
							<el-form-item label="老师简介:" prop="lecturer_brief">
								<el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.lecturer_brief"></el-input>
							</el-form-item>
							<el-form-item label="分类状态:" prop="status">
								<el-select v-model="addForm.status">
									<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="类型:" prop="ishot">
								<el-select v-model="addForm.ishot">
									<el-option v-for="item in ishotOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<!------------------------------------>
							<el-form-item label="分类类型:" prop="type">
								<el-select v-model="addForm.type">
									<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</div>
					<!-- 确定 /  取消 按钮 -->
					<div class="categories-news-button">
						<button @click="confirmAdd">确定</button>
						<button @click="addFormVisible = false">取消</button>
					</div>
				</div>
			</div>
			<media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia"
				@overSelectFile="overSelectFile"></media-select>
			<media-select v-if="isSelect2" @close="closeMedia2" @overSelectMedia="overSelectMedia2"
				@overSelectFile="overSelectFile2"></media-select>
			<!--进度条弹窗-->
			<div class="categories-news" v-if="this.progressVisible">
				<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
			</div>
		</div>
	</div>
</template>
<script>
	import { getCategories, getCategoryOne, deleteCategoryOne, postCategories, putCategories, postCategoriesList, getPicURL } from '../../../../api/api';
	import { formatDate, handleCommonAvatarSuccess, handleCommonAudioSuccess } from '../../../Utility/Utility'
	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if (/^\s*$/.test(value)) {
					callback(new Error('请输入正确的名称,不可以是空格'));
				} else {
					callback();
				}
			};
			return {
				isSelect: false,
				isSelect2: false,
				select_cate: '', //查询id
				list: [], //数据
				del_list: [], //查询时缓存的全部数据
				cur_page: 1, //当前页
				total: 0,
				size: 10,
				contentShow: false,

				//新增界面是否显示
				addFormVisible: false,
				//进度条弹窗是否显示
				progressVisible: false,

				//新增界面数据
				addForm: {
					name: '',
					status: 0,
					type: 0,
					//2.0
					ishot: 0,
					lecturer: '',
					position: '',
					lecturer_brief: '',
					cover_img: '',
					head_img: '',
					zhuojian_title: '',
					learn_people: 0
				},

				isEditForm: false, //是否是编辑页面

				statusOptions: [{
					value: 0,
					label: '不可用'
				}, {
					value: 1,
					label: '可用'
				}],

				typeOptions: [{
					value: 0,
					label: '普通'
				}, {
					value: 1,
					label: '独角兽'
				}, {
					value: 2,
					label: '大讲堂'
				}, {
					value: 3,
					label: 'FM'
				}],

				ishotOptions: [{
					value: 0,
					label: '普通'
				}, {
					value: 1,
					label: '热门'
				}],
			}
		},
		created() {
			this.getData();
			var _this = this;
			document.onkeydown = function (event) {
				var e = window.event || arguments.callee.caller.arguments[0];
				console.log(e.keyCode)
				if (e.keyCode == 75) {
					_this.addKey();
				}
				if (e.keyCode == 27) {
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
			formatStatus: function (row, column, cellValue) {
				if (cellValue === 0) {
					return '不可用';
				} else {
					return '可用';
				}
			},
			selectMedia() {
				this.isSelect = true;
			},
			selectMedia2() {
				this.isSelect2 = true;
			},
			closeMedia() {
				this.isSelect = false
			},
			closeMedia2() {
				this.isSelect2 = false
			},
			overSelectMedia(str) {
				this.addForm.cover_img = str
			},
			overSelectFile(str) {
				this.addForm.cover_img = str
			},
			overSelectMedia2(str) {
				this.addForm.head_img = str
			},
			overSelectFile2(str) {
				this.addForm.head_img = str
			},

			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await getCategories(this.cur_page, this.size).then(res => {

					if (!res.data.data || res.data.data == [] || res.data.data.length == 0) {
						if (this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData()
						} else {
							this.list = [];
						}
					} else {
						this.list = res.data.data;
						if (res.data.count) {
							this.total = res.data.count
						}
					}

				});
				this.del_list = JSON.parse(JSON.stringify(this.list))
			},

			//分页导航
			handleCurrentChange(val) {
				console.log(val);
				this.cur_page = val;
				this.getData();
			},
			handleSizeChange(val) {
				this.size = val
				this.getData();
				document.getElementById("table").setAttribute("style", "height: 1100px !important");
			},

			//搜索
			search() {
				if (this.select_cate !== '') {
					// getCategoryOne(parseInt(this.select_cate)).then(res => {
					// 	if (res.data == null) {
					// 		this.list = null
					// 	} else {
					// 		this.list = JSON.parse(JSON.stringify(this.del_list));
					// 		this.list.splice(0, this.list.length, res.data)
					// 	}
					// });
					getCategories(1, 1000).then(res => {
						var searchData = this.select_cate;
						var tableData = res.data.data;
						let resultData = tableData.filter(data => {
							//日期假设date,人名 name
							if (data.name == searchData || data.name.indexOf(searchData) != -1) { //此处根据具体需求判断
								return true;
							}
						});
						this.list = resultData;
					})
				} else {
					this.list = JSON.parse(JSON.stringify(this.del_list))
				}

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

					deleteCategoryOne(row.id).then((res) => {
						if (res.success === true) {
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
			//批量删除
			batchDelete() {
				let str = '';
				this.multipleSelection.forEach((selection, index) => {
					str += `${selection.id},`
				});
				if (str.endsWith(',')) {
					str = str.slice(0, -1);
				}

				postCategoriesList(str).then((res) => {
					if (res.success === true) {
						this.getData();
					}
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
					name: '',
					status: 0,
					type: 0,
					//2.0
					ishot: 0,
					lecturer: '',
					position: '',
					lecturer_brief: '',
					cover_img: '',
					head_img: '',
					zhuojian_title: '',
					learn_people: 0
				};

				this.addFormVisible = true;
			},

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					console.log(valid);
					if (valid) {
						if (this.isEditForm) {
							this.myPutCategoryChange();
						} else {
							this.myPostCategoryAdd();
						}
					}
				})

			},

			//新增
			myPostCategoryAdd() {
				postCategories(this.addForm).then((res) => {
					if (res.success === true) {

						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: "error"
						})
					}
				}).catch((res) => {
					this.$message({
						message: res.data,
						type: "error"
					})

				})
			},
			//类别简介
			lbjj(index, row) {
				this.contentShow = true;
				// console.log('index=',index);
				// console.log('row=',row);
				console.log(row.position);
				this.addForm.content = row.position;
			},
			//老师简介
			laoshijianjie(index, row) {
				this.contentShow = true;
				// console.log('han',row);
				console.log(row.lecturer_brief);
				this.addForm.content = row.lecturer_brief;
			},

			//编辑按钮点击
			handleEdit(index, row) {
				console.log(row.status);
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					name: row.name,
					status: row.status,
					type: row.type,
					//2.0
					ishot: row.ishot,
					lecturer: row.lecturer,
					position: row.position,
					lecturer_brief: row.lecturer_brief,
					cover_img: row.cover_img,
					head_img: row.head_img,
					zhuojian_title: row.zhuojian_title,
					learn_people: row.learn_people
				};
				this.addFormVisible = true;
			},

			//修改
			myPutCategoryChange() {
				putCategories(this.addForm, this.addForm.id).then((res) => {
					if (res.success == true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: 'error'
						});
					}
				});
			}
		},

	}
</script>
<style scoped>
	.handle-box {
		height: 32px;
	}

	.handle-box .addbtn {
		float: right;
	}
</style>