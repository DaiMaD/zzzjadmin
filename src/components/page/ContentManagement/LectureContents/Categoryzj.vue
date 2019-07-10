<template>
	<div class="table">
		<!---------------->
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
				<el-input size="medium" v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10" clearable>
				</el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<div class="addbtn">
					<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
						<i class="el-icon-info addbtn2"></i>
					</el-tooltip>
					<el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
				</div>
			</div>
			<el-table :data="list" border max-height="680" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
				<el-table-column type="selection" width="55" fixed="left"></el-table-column>
				<el-table-column prop="category_id" label="所属频道ID" min-width="50" fixed></el-table-column>
				<el-table-column prop="course_id" label="所属套课ID" min-width="50" fixed></el-table-column>
				<el-table-column prop="recommend" label="是否推荐" min-width="70" :formatter="formatRecommend"></el-table-column>
				<el-table-column prop="zhuojian" label="“灼见”" min-width="70">
					<template slot-scope="scope">
						<span @click="lbjj(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="上线状态" min-width="60" :formatter="formatStatus"></el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
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
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
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
							<el-form-item label="所属频道ID:" prop="category_id">
								<el-input v-model.number="addForm.category_id"></el-input>
							</el-form-item>
							<el-form-item label="所属套课ID:" prop="course_id">
								<el-input v-model.number="addForm.course_id"></el-input>
							</el-form-item>
							<el-form-item label="灼见内容:" prop="zhuojian">
								<el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.zhuojian"></el-input>
							</el-form-item>
							<el-form-item label="上线状态:" prop="status">
								<el-select v-model="addForm.status">
									<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="是否推荐:" prop="recommend">
								<el-select v-model="addForm.recommend">
									<el-option v-for="item in recommendOptions" :key="item.value" :label="item.label" :value="item.value">
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
			<!--进度条弹窗-->
			<div class="categories-news" v-if="this.progressVisible">
				<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
			</div>
		</div>
	</div>
</template>
<script>
	import { getCategories, getCategoryOne, deleteCategoryOne, postCategories, putCategories, postCategoriesList, getPicURL, ZhuoJian, ZhuoJianAdd, Zhuojianchange, ZhuojianDelete, ZhuojianDeletes } from '../../../../api/api';
	import { formatDate, handleCommonAvatarSuccess, handleCommonAudioSuccess } from '../../../Utility/Utility'
	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if(/^\s*$/.test(value)) {
					callback(new Error('请输入正确的名称,不可以是空格'));
				} else {
					callback();
				}
			};
			return {
				id: '',
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
					category_id: '',
					status: 0,
					course_id: '',
					zhuojian: '',
					recommend: 0,
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
				//是否推荐
				recommendOptions: [{
					value: 0,
					label: '否'
				}, {
					value: 1,
					label: '是'
				}],
			}
		},
		created() {
			this.getData();
			var _this = this;
			document.onkeydown = function(event) {
				var e = window.event || arguments.callee.caller.arguments[0];
				console.log(e.keyCode)
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

			formatStatus: function(row, column, cellValue) {
				if(cellValue === 0) {
					return '不可用';
				} else {
					return '可用';
				}
			},

			formatType: function(row, column, cellValue) {
				switch(cellValue) {
					case 0:
						return '普通';
						break;
					case 1:
						return '独角兽';
						break;
					case 2:
						return '大讲堂';
						break;
					case 3:
						return 'FM';
						break;
					default:
						return '暂无此类型'
				}
			},

			//推荐判断
			formatRecommend: function(row, column, cellValue) {
				if(cellValue === 0) {
					return '否'
				} else {
					return '是'
				}
			},

			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await ZhuoJian(this.cur_page, this.size).then(res => {
					console.log(res.data)
					if(!res.data.data || res.data.data == [] || res.data.data.length == 0) {
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
				if(this.select_cate !== '') {
					getCategoryOne(parseInt(this.select_cate)).then(res => {
						if(res.data == null) {
							this.list = null
						} else {
							this.list = JSON.parse(JSON.stringify(this.del_list));
							this.list.splice(0, this.list.length, res.data)
						}
					});
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

					ZhuojianDelete(row.id).then((res) => {
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
			//批量删除
			batchDelete() {
				let str = '';
				this.multipleSelection.forEach((selection, index) => {
					str += `${selection.id},`
				});
				if(str.endsWith(',')) {
					str = str.slice(0, -1);
				}

				ZhuojianDeletes(str).then((res) => {
					if(res.success === true) {
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
					category_id: '',
					status: 0,
					course_id: '',
					zhuojian: '',
					recommend: 0,
				};

				this.addFormVisible = true;
			},

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					// console.log(valid);
					if(valid) {
						if(this.isEditForm) {
							this.myPutCategoryChange();
						} else {
							this.myPostCategoryAdd();
						}
					}
				})

			},

			//新增
			myPostCategoryAdd() {
				ZhuoJianAdd(this.addForm).then((res) => {
					if(res.success === true) {

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
				console.log(row.zhuojian);
				this.addForm.content = row.zhuojian;
			},

			//编辑按钮点击
			handleEdit(index, row) {
				console.log(row.status);
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					category_id: row.category_id,
					status: row.status,
					course_id: row.course_id,
					zhuojian: row.zhuojian,
					recommend: row.recommend,
				};
				this.addFormVisible = true;
			},

			//修改
			myPutCategoryChange() {
				Zhuojianchange(this.addForm, this.addForm.id).then((res) => {
					console.log('灼见id：' + this.addForm.id)
					if(res.success == true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: 'error'
						});
					}
				});
			},

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