<template>
	<div class="table">
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
				<el-table-column type="selection" min-width="55"></el-table-column>
				<el-table-column prop="id" label="活动城市列表" min-width="50"></el-table-column>
				<el-table-column prop="name" label="城市名" min-width="100"></el-table-column>
				<el-table-column prop="latitude" label="纬度" min-width="150"></el-table-column>
				<el-table-column prop="longitude" label="经度" min-width="150"></el-table-column>
				<el-table-column prop="status" label="城市状态" :formatter="formatStatus"></el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--分页器-->
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="this.total">
				</el-pagination>
			</div>

			<!--新增弹框-->
			<div class="categories-news" v-if="this.addFormVisible">
				<div class="categories-news-main">
					<div class="categories-news-title">
						<span>新增</span>
						<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
					</div>
					<div class="categories-news-content">
						<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
							<el-form-item label="名称:" prop="name">
								<el-input v-model.string="addForm.name"></el-input>
							</el-form-item>
							<el-form-item label="纬度:" prop="latitude">
								<el-input v-model="addForm.latitude"></el-input>
							</el-form-item>
							<el-form-item label="经度:" prop="longitude">
								<el-input v-model="addForm.longitude"></el-input>
							</el-form-item>
							<el-form-item label="城市状态:" prop="status">
								<el-select v-model="addForm.status">
									<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
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
		</div>
	</div>
</template>

<script>
	import { getActivityCity, getActivityCityOne, deleteActivityCityOne, postActivityCity, putActivityCity, postActivityCityList } from '../../../../api/api';
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
				select_cate: '', //查询id
				list: [], //数据
				del_list: [], //查询时缓存的全部数据
				cur_page: 1, //当前页
				total: 0,
				size: 10,

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
				//新增界面数据
				addForm: {
					name: '',
					latitude: '',
					longitude: '',
					status: 0
				},

				isEditForm: false, //是否是编辑页面

				statusOptions: [{
					value: 0,
					label: '下线'
				}, {
					value: 1,
					label: '上线'
				}],
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

			formatStatus: function(row, column, cellValue) {
				if(cellValue === 0) {
					return '下线';
				} else {
					return '上线';
				}
			},

			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {

				await getActivityCity(this.cur_page, this.size).then(res => {

					if(!res.data.data || res.data.data == [] || res.data.data.length == 0) {
						if(this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData()
						} else {
							this.list = [];
						}
					} else {
						this.list = res.data.data;
						if(res.data.totalPages) {
							this.total = res.data.totalPages * 10
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

			//搜索
			search() {
				if(this.select_cate !== '') {
					getActivityCityOne(parseInt(this.select_cate)).then(res => {

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

			//删除
			myDelete(index, row) {
				// 新增删除提示
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: "btn-custom-cancel",
					type: 'warning'
				}).then(() => {

					deleteActivityCityOne(row.id).then((res) => {
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

				postActivityCityList(str).then((res) => {
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
					name: '',
					latitude: '',
					longitude: '',
					status: 0
				};

				this.addFormVisible = true;
			},

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					console.log(valid);
					if(valid) {
						if(this.isEditForm) {
							this.myPutActivityCityChange();
						} else {
							this.myPostActivityCityAdd();
						}
					}
				})

			},

			//新增
			myPostActivityCityAdd() {
				postActivityCity(this.addForm).then((res) => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: "error"
						})
					}
				});
			},

			//编辑按钮点击
			handleEdit(index, row) {
				console.log(row.status);
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					name: row.name,
					status: row.status,
					latitude: row.latitude,
					longitude: row.longitude,
				};
				this.addFormVisible = true;
			},
			//编辑修改
			myPutActivityCityChange() {
				putActivityCity(this.addForm, this.addForm.id).then((res) => {
					if(res.success === true) {
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
</style>