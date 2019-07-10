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
				<el-table-column prop="id" label="活动门票" min-width="50" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="name" label="门票名" min-width="100" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="content" label="备注说明" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="price" label="价格" min-width="100"></el-table-column>
				<el-table-column prop="number" label="预留人数或库存" min-width="100"></el-table-column>
				<el-table-column prop="activity_id" label="所属活动ID" min-width="100"></el-table-column>
				<el-table-column prop="status" label="门票状态" :formatter="formatStatus"></el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
				</el-pagination>
			</div>

			<!--新增弹框-->
			<div class="categories-news" v-if="this.addFormVisible">
				<div class="categories-news-main">
					<div class="categories-news-title">
						<span>{{this.isEditForm?'修改':'新增'}}</span>
						<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
					</div>
					<div class="categories-news-content">
						<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">

							<el-form-item label="门票名:" prop="name">
								<el-input v-model.string="addForm.name"></el-input>
							</el-form-item>

							<el-form-item label="门票类型:" prop="type">
								<el-select v-model="addForm.type">
									<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="备注说明:" prop="content">
								<el-input v-model="addForm.content"></el-input>
							</el-form-item>

							<el-form-item label="价格:" prop="price">
								<el-input v-model="addForm.price"></el-input>
							</el-form-item>

							<el-form-item label="预留人数或库存:" prop="number">
								<el-input v-model="addForm.number"></el-input>
							</el-form-item>

							<el-form-item label="所属活动ID:" prop="activity_id">
								<el-input v-model="addForm.activity_id"></el-input>
							</el-form-item>

							<el-form-item label="门票状态:" prop="status">
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
	import { getActivityTicket, getActivityTicketOne, deleteActivityTicketOne, postActivityTicket, putActivityTicket, postActivityTicketList } from '../../../../api/api';
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

				//是否是编辑页面
				isEditForm: false,

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
					],
					price: [{
							required: true,
							message: '价格不能为空'
						},
						{
							validator: validateName,
							trigger: 'blur'
						}
					],
				},

				//新增界面数据
				addForm: {
					name: '',
					status: 1,
					content: '',
					price: '',
					number: 0,
					activity_id: '',
					type: 1
				},

				statusOptions: [{
					value: 0,
					label: '不可用'
				}, {
					value: 1,
					label: '可用'
				}],

				typeOptions: [{
					value: 1,
					label: '普通票'
				}, {
					value: 2,
					label: 'vip'
				}, {
					value: 3,
					label: 'vvip'
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
					return '不可用';
				} else {
					return '可用';
				}
			},

			formatType: function(row, column, cellValue) {
				switch(cellValue) {
					case 1:
						return '普通票';
						break;
					case 2:
						return 'vip';
						break;
					case 3:
						return 'vvip';
						break;
				}
			},

			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {

				await getActivityTicket(this.cur_page, this.size).then(res => {

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
					getActivityTicketOne(parseInt(this.select_cate)).then(res => {
						if(res.data == null) {
							this.list = null;
						} else {
							this.list = JSON.parse(JSON.stringify(this.del_list));
							this.list.splice(0, this.list.length, res.data)
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

					deleteActivityTicketOne(row.id).then((res) => {
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

				postActivityTicketList(str).then((res) => {
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
					status: 1,
					content: '',
					price: '',
					number: '',
					activity_id: '',
					type: 1
				};

				this.addFormVisible = true;
			},

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					console.log(valid);
					if(valid) {
						if(this.isEditForm) {
							this.myPutActivityTicketChange();
						} else {
							this.myPostActivityTicketAdd();
						}
					}
				})

			},

			//新增
			myPostActivityTicketAdd() {
				postActivityTicket(this.addForm).then((res) => {
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
					content: row.content,
					price: row.price,
					number: row.number,
					activity_id: row.activity_id,
					type: row.type
				};
				this.addFormVisible = true;
			},

			//修改
			myPutActivityTicketChange() {
				putActivityTicket(this.addForm, this.addForm.id).then((res) => {
					if(res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: 'error'
						});
					}
				}).catch((res) => {
					this.$message({
						message: res.data,
						type: "error"
					})
				});
			}
		}
	}
</script>

<style scoped>

</style>