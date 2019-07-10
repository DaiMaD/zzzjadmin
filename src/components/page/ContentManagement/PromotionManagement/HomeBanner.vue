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
				<el-table-column prop="pic_url" label="轮播图片" min-width="140">
					<template slot-scope="scope">
						<a :href="scope.row.pic_url" target="true"><img :src="scope.row.pic_url" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="type" label="大类型" min-width="90" :formatter="formatType"></el-table-column>
				<el-table-column prop="parent_id" label="课程分类" min-width="70" :formatter="classType"></el-table-column>
				<el-table-column prop="course_id" label="套课ID" min-width="60"></el-table-column>
				<el-table-column prop="activity_id" label="活动ID" min-width="60"></el-table-column>
				<el-table-column prop="link_url" label="链接URL" min-width="120" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="to_id" label="标题" min-width="120" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="ori_price" label="原价" min-width="70"></el-table-column>
				<el-table-column prop="sale_price" label="现价" min-width="70"></el-table-column>
				<el-table-column prop="order_img" label="订单页面图片" min-width="120" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="status" label="状态" min-width="100" :formatter="formatStatus"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" min-width="160" :formatter="formatTime"></el-table-column>
				<el-table-column prop="update_time" label="更新时间" min-width="160" :formatter="formatTime"></el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
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
						<span>新增</span>
						<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
					</div>
					<div class="categories-news-content">
						<div id="typeBox">
							选择类型:&nbsp;&nbsp;&nbsp;
							<el-radio v-model="bigtype" label="1" border>课程</el-radio>
							<el-radio v-model="bigtype" label="2" border>活动</el-radio>
							<el-radio v-model="bigtype" label="3" border>长海报</el-radio>
							<el-radio v-model="bigtype" label="4" border>商学院</el-radio>
							<el-radio v-model="bigtype" label="5" border>长海报支付</el-radio>
						</div>
						<div class="addoreditwrap" v-if="bigtype == 1">
							<!--课程-->
							<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
								<el-form-item label="课程分类:" prop="parent_id">
									<el-select placeholder="选择课程时请选择" v-model="addForm.parent_id">
										<el-option v-for="item in parentOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="套课ID:" prop="course_id ">
									<el-input placeholder="选择课程时请在这里输入套课ID" v-model="addForm.course_id"></el-input>
								</el-form-item>
								<el-form-item label="轮播图片:" prop="pic_url">
									<el-input v-model="addForm.pic_url"></el-input>
									<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="标题:" prop="to_id">
									<el-input v-model="addForm.to_id"></el-input>
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
						<div class="addoreditwrap" v-if="bigtype == 2">
							<!--活动-->
							<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
								<el-form-item label="活动ID:" prop="activity_id ">
									<el-input placeholder="选择活动时请在这里输入活动ID" v-model="addForm.activity_id"></el-input>
								</el-form-item>
								<el-form-item label="轮播图片:" prop="pic_url">
									<el-input v-model="addForm.pic_url"></el-input>
									<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="标题:" prop="to_id">
									<el-input v-model="addForm.to_id"></el-input>
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
						<div class="addoreditwrap" v-if="bigtype == 3">
							<!--长海报-->
							<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
								<el-form-item label="URL链接:" prop="link_url ">
									<el-input placeholder="当选择链接时填入" v-model="addForm.link_url"></el-input>
								</el-form-item>
								<el-form-item label="轮播图片:" prop="pic_url">
									<el-input v-model="addForm.pic_url"></el-input>
									<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="标题:" prop="to_id">
									<el-input v-model="addForm.to_id"></el-input>
								</el-form-item>
								<el-form-item label="分享标题:">
									<el-input v-model="addForm.share_main_title"></el-input>
								</el-form-item>
								<el-form-item label="分享副标题:">
									<el-input v-model="addForm.share_sub_title"></el-input>
								</el-form-item>
								<el-form-item label="分享图片:" prop="share_img">
									<el-input v-model="addForm.share_img"></el-input>
									<el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
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
						<div class="addoreditwrap" v-if="bigtype == 4">
							<!--商学院-->
							<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
								<el-form-item label="URL链接:" prop="link_url ">
									<el-input placeholder="当选择链接时填入" v-model="addForm.link_url"></el-input>
								</el-form-item>
								<el-form-item label="轮播图片:" prop="pic_url">
									<el-input v-model="addForm.pic_url"></el-input>
									<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="标题:" prop="to_id">
									<el-input v-model="addForm.to_id"></el-input>
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
						<div class="addoreditwrap" v-if="bigtype == 5">
							<!--长海报有支付-->
							<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
								<el-form-item label="URL链接:" prop="link_url ">
									<el-input placeholder="当选择链接时填入" v-model="addForm.link_url"></el-input>
								</el-form-item>
								<el-form-item label="轮播图片:" prop="pic_url">
									<el-input v-model="addForm.pic_url"></el-input>
									<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="标题:" prop="to_id">
									<el-input v-model="addForm.to_id"></el-input>
								</el-form-item>
								<el-form-item label="分享标题:">
									<el-input v-model="addForm.share_main_title"></el-input>
								</el-form-item>
								<el-form-item label="分享副标题:">
									<el-input v-model="addForm.share_sub_title"></el-input>
								</el-form-item>
								<el-form-item label="分享图片:" prop="share_img">
									<el-input v-model="addForm.share_img"></el-input>
									<el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
								</el-form-item>
								<el-form-item label="状态:" prop="status">
									<el-select v-model="addForm.status">
										<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="原价格:">
									<el-input v-model="addForm.ori_price"></el-input>
								</el-form-item>
								<el-form-item label="销售价格:">
									<el-input v-model="addForm.sale_price"></el-input>
								</el-form-item>
								<el-form-item label="订单图片:" prop="order_img">
									<el-input v-model="addForm.order_img"></el-input>
									<el-button @click="selectMedia3" type="primary" class="selectFileBtn">选取文件</el-button>
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
			<media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia" @overSelectFile="overSelectFile"></media-select>
      <media-select v-if="isSelect2" @close="closeMedia" @overSelectMedia="overSelectMedia2" @overSelectFile="overSelectFile2"></media-select>
      <media-select v-if="isSelect3" @close="closeMedia" @overSelectMedia="overSelectMedia3" @overSelectFile="overSelectFile3"></media-select>
			<!--进度条弹框-->
			<div class="categories-news" v-if="this.progressVisible">

				<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
				<!--<el-button type="primary" class="cancel-upload" @click="open2">取消上传</el-button>-->
			</div>
		</div>
	</div>
</template>

<script>
	import { getHomeBanner, getHomeBannerOne, deleteHomeBannerOne, postHomeBanner, putHomeBanner, postHomeBannerList, getPicURL } from '../../../../api/api';
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
				del_list: [], //查询时缓存的全部数据
				cur_page: 1, //当前页
				total: 0,
				size: 10,
				bigtype: '1',

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
					status: 1,
					type: 1,
					pic_url: '',
					to_id: '',
					parent_id: '1',
					course_id: '',
					activity_id: '',
					link_url: '',
				},
				isPay: '0',

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
				}],

				typeOptions: [{
					value: 1,
					label: '课程'
				}, {
					value: 2,
					label: '活动'
				}, {
					value: 3,
					label: 'URL链接'
				}, {
					value: 4,
					label: '商学院'
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
				this.addForm.pic_url = str
			},
			overSelectFile(str){
				this.addForm.pic_url = str
			},
			overSelectMedia2(str){
				this.addForm.share_img = str
			},
			overSelectFile2(str){
				this.addForm.share_img = str
			},
			overSelectMedia3(str){
				this.addForm.order_img = str
			},
			overSelectFile3(str){
				this.addForm.order_img = str
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
				return formatDate(cellValue)
			},
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await getHomeBanner(this.cur_page, this.size).then(res => {
					console.log(res)
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

			//搜索==
			search() {
				if(this.select_cate !== '') {
					getHomeBannerOne(parseInt(this.select_cate)).then(res => {
						if(res.data == null) {
							this.list = null
						} else {
							this.list = JSON.parse(JSON.stringify(this.del_list));
							this.list.splice(0, this.list.length, res.data);
						}
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
					deleteHomeBannerOne(row.id).then((res) => {
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

				postHomeBannerList(str).then((res) => {
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
				this.bigtype = '1';
				this.addForm = {
					status: 0,
					type: 1,
					pic_url: '',
					to_id: '',
					parent_id: 1,
					course_id: '',
					activity_id: '',
					link_url: '',
					ori_price: '',
					sale_price: '',
					order_img: '',
					share_sub_title: '',
					share_main_title: '',
					share_img: ''
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
				if(this.bigtype == 1) {
					var addForm1 = {
						course_id: this.addForm.course_id,
						parent_id: this.addForm.parent_id,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						status: this.addForm.status,
						type: 1
					}
					postHomeBanner(addForm1).then((res) => {
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
					});
				} else if(this.bigtype == 2) {
					var addForm2 = {
						activity_id: this.addForm.activity_id,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						status: this.addForm.status,
						type: 2
					}
					postHomeBanner(addForm2).then((res) => {
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
					});
				} else if(this.bigtype == 3) {
					var addForm3 = {
						link_url: this.addForm.link_url,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						share_main_title: this.addForm.share_main_title,
						share_sub_title: this.addForm.share_sub_title,
						share_img: this.addForm.share_img,
						status: this.addForm.status,
						type: 3
					}
					postHomeBanner(addForm3).then((res) => {
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
					});
				} else if(this.bigtype == 4) {
					var addForm4 = {
						link_url: this.addForm.link_url,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						status: this.addForm.status,
						type: 4
					}
					postHomeBanner(addForm4).then((res) => {
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
					});
				} else if(this.bigtype == 5) {
					var addForm5 = {
						link_url: this.addForm.link_url,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						share_main_title: this.addForm.share_main_title,
						share_sub_title: this.addForm.share_sub_title,
						share_img: this.addForm.share_img,
						status: this.addForm.status,
						type: 5,
						ori_price: this.addForm.ori_price,
						sale_price: this.addForm.sale_price,
						order_img: this.addForm.order_img
					}
					postHomeBanner(addForm5).then((res) => {
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
					});
				}
			},

			//编辑按钮点击
			handleEdit(index, row) {
				console.log(row.status);
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					status: row.status,
					type: row.type,
					pic_url: row.pic_url,
					to_id: row.to_id,
					parent_id: row.parent_id,
					course_id: row.course_id,
					activity_id: row.activity_id,
					link_url: row.link_url,
					order_img: row.order_img,
					ori_price: row.ori_price,
					sale_price: row.sale_price,
					share_img: row.share_img,
					share_main_title: row.share_main_title,
					share_sub_title: row.share_sub_title
				};
				this.addFormVisible = true;
				this.bigtype = row.type.toString();

			},

			//修改
			myPutHomeBannerChange() {
				if(this.bigtype == 1) {
					var addForm6 = {
						course_id: this.addForm.course_id,
						parent_id: this.addForm.parent_id,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						status: this.addForm.status,
						type: this.addForm.type
					}
					putHomeBanner(addForm6, this.addForm.id).then((res) => {
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
					});
				} else if(this.bigtype == 2) {
					var addForm7 = {
						activity_id: this.addForm.activity_id,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						status: this.addForm.status,
						type: this.addForm.type
					}
					putHomeBanner(addForm7, this.addForm.id).then((res) => {
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
					});
				} else if(this.bigtype == 3) {
					var addForm8 = {
						link_url: this.addForm.link_url,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						share_main_title: this.addForm.share_main_title,
						share_sub_title: this.addForm.share_sub_title,
						share_img: this.addForm.share_img,
						status: this.addForm.status,
						type: this.addForm.type
					}
					putHomeBanner(addForm8, this.addForm.id).then((res) => {
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
					});
				} else if(this.bigtype == 4) {
					var addForm9 = {
						link_url: this.addForm.link_url,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						status: this.addForm.status,
						type: this.addForm.type
					}
					putHomeBanner(addForm9, this.addForm.id).then((res) => {
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
					});
				} else if(this.bigtype == 5) {
					var addForm10 = {
						link_url: this.addForm.link_url,
						pic_url: this.addForm.pic_url,
						to_id: this.addForm.to_id,
						share_main_title: this.addForm.share_main_title,
						share_sub_title: this.addForm.share_sub_title,
						share_img: this.addForm.share_img,
						status: this.addForm.status,
						type: this.addForm.type,
						ori_price: this.addForm.ori_price,
						sale_price: this.addForm.sale_price,
						order_img: this.addForm.order_img
					}
					putHomeBanner(addForm10, this.addForm.id).then((res) => {
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
					});
				}

			}
		}
	}
</script>

<style scoped>
	#typeBox {
		height: 42px;
	}
	
	.handle-box {
		height: 32px;
	}
	
	.handle-box .addbtn {
		float: right;
	}
	
	.payBox {
		margin-top: 16px;
	}
</style>