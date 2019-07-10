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
			<el-table :data="list" border max-height="680" style="width: 100%" ref="multipleTable"
				:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
				<el-table-column type="selection" width="55" fixed></el-table-column>
				<el-table-column prop="title" label="海报标题" min-width="100" fixed></el-table-column>
				<el-table-column prop="img_url" label="海报图片" width="150">
					<template slot-scope="scope">
						<a :href="scope.row.img_url" target="true"><img :src="scope.row.img_url" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="上线/下线" min-width="100" :formatter="formatStatus"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" width="200" :formatter="formatTime"></el-table-column>
				<el-table-column prop="update_time" label="更新时间" width="200" :formatter="formatTime"></el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页器-->
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
					:total="this.total">
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
						<el-form :model="addForm" ref="addForm" label-position="left" label-width="80px">
							<el-form-item label="海报标题:">
								<el-input v-model="addForm.title"></el-input>
							</el-form-item>
							<el-form-item label="状态:">
								<el-select v-model="addForm.status">
									<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="海报图片:" prop="avatar">
								<el-input v-model="addForm.img_url"></el-input>
								<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div class="categories-news-button">
						<button @click="confirmAdd">确定</button>
						<button @click="addFormVisible = false">取消</button>
					</div>
				</div>
			</div>
			<media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia"
				@overSelectFile="overSelectFile"></media-select>
			<!--进度条弹框-->
			<div class="categories-news" v-if="this.progressVisible">
				<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
			</div>
		</div>
	</div>
</template>
<script>
	// import 'quill/dist/quill.core.css';
	// import 'quill/dist/quill.snow.css';
	// import 'quill/dist/quill.bubble.css';
	import { quillEditor } from 'vue-quill-editor';
	import { getPosterInvite, putPosterInvite, postPosterInvite, DelPosterInvite, getPicURL } from '../../../../api/api';
	import { formatDate, handleCommonAvatarSuccess } from '../../../Utility/Utility'
	export default {
		data() {
			//  			var validateName = (rule, value, callback) => {
			//              if (/^\s*$/.test(value)) {
			//                  callback(new Error('请输入正确的内容,不可以是空格'));
			//              }else {
			//                  callback();
			//              }
			//          };
			return {
				isSelect: false,
				cur_page: 1, //分页-当前页
				size: 10, //每页展示数据条数
				total: 0, //数据总页数
				list: [], //table数据
				progressVisible: false, //控制上传进度条展示
				addFormVisible: false, //新增编辑弹框是否展示
				progressPercent: 0, //进度条进度
				//  				addFormRules: {name: [{ required: true, message: '名称字段不能为空' },{ validator: validateName, trigger: 'blur' }]},//名称不能为空
				statusOptions: [{
					value: 0,
					label: '下线'
				}, {
					value: 1,
					label: '上线'
				}],
				isEditForm: false, //是否是编辑页面
				addForm: {
					create_time: '',
					id: '',
					img_url: '',
					status: '',
					title: "",
					update_time: ''
				}
			}
		},
		created() {
			this.getData();
			var _this = this;
			document.onkeydown = function (event) {
				var e = window.event || arguments.callee.caller.arguments[0];
				if (e.keyCode == 75) {
					_this.addKey();
				}
				if (e.keyCode == 27) {
					_this.closeKey();
				}
			};
		},
		methods: {
			addKey() {
				this.isEditForm = false;
				this.handleAdd();
				this.addFormVisible = true;
			},
			closeKey() {
				this.addFormVisible = false;
			},
			selectMedia() {
				this.isSelect = true;
			},
			closeMedia() {
				this.isSelect = false
			},
			overSelectMedia(str) {
				this.addForm.img_url = str
			},
			overSelectFile(str) {
				this.addForm.img_url = str
			},
			//获取数据
			async getData() {
				await getPosterInvite(this.cur_page, this.size).then(res => {
					console.log(res.data);
					if (!res.data.data || res.data.data === [] || res.data.data.length === 0) {
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
				this.cur_page = val;
				this.getData();
			},
			handleSizeChange(val) {
				this.size = val
				this.getData();
				document.getElementById("table").setAttribute("style", "height: 1100px !important");
			},
			//时间戳转时间
			formatTime: function (row, column, cellValue) {
				return formatDate(cellValue)
			},
			//上下线状态
			formatStatus: function (row, column, cellValue) {
				if (cellValue == 1) {
					return '上线'
				} else if (cellValue == 0) {
					return '下线'
				}
			},

			//编辑按钮点击
			handleEdit(index, row) {
				this.text = row.content,
					this.isEditForm = true;
				this.addForm = {
					id: row.id,
					title: row.title,
					img_url: row.img_url,
					status: row.status
				};
				this.addFormVisible = true;
			},

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					console.log(valid);
					if (valid) {
						if (this.isEditForm) {
							this.myPutActivityChange();
						} else {
							this.myPostActivityAdd();
						}
					}
				})

			},
			//修改
			myPutActivityChange() {
				var addForm3 = {
					'title': this.addForm.title,
					'img_url': this.addForm.img_url,
					'status': this.addForm.status
				}
				console.log(this.addForm)
				putPosterInvite(this.addForm.id, addForm3).then((res) => {
					if (res.success === true) {
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
			//新增
			myPostActivityAdd() {
				var addForm1 = {
					'title': this.addForm.title,
					'img_url': this.addForm.img_url,
					'status': this.addForm.status
				}
				postPosterInvite(addForm1).then((res) => {
					this.getData();
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
			//删除
			myDelete(index, row) {
				var self = this;
				console.log(row.id)
				// 新增删除提示
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: "btn-custom-cancel",
					type: 'warning'
				}).then(() => {
					DelPosterInvite(row.id).then((res) => {
						console.log(res)
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
			handleAdd() {
				this.text = '';
				this.select_cate = '';
				this.isEditForm = false;
				this.addForm = {
					create_time: '',
					id: '',
					img_url: '',
					status: '',
					title: "",
					update_time: ''
				};
				this.addFormVisible = true;
			},
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