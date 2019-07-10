<template>
	<div class="table">
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
				<el-input size="medium" v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10" clearable></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<div class="addbtn">
					<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
						<i class="el-icon-info addbtn2"></i>
					</el-tooltip>
					<el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
				</div>
			</div>
			<el-table :data="list" border max-height="680" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
				<el-table-column type="selection" width="55" fixed></el-table-column>
				<el-table-column prop="id" label="ID" width="50" fixed></el-table-column>
				<el-table-column prop="name" label="活动名" min-width="150" fixed :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="time" label="举办时间" min-width="150" :formatter="formatTime"></el-table-column>
				<el-table-column prop="expire_time" label="截止时间" min-width="150" :formatter="formatTime"></el-table-column>
				<el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
				<el-table-column prop="city_id" label="所在城市" min-width="100"></el-table-column>
				<el-table-column prop="avatar" label="缩略图" min-width="100">
					<template slot-scope="scope">
						<a :href="scope.row.avatar" target="true"><img :src="scope.row.avatar" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="举办地址" min-width="300"></el-table-column>
				<el-table-column prop="content" label="详情" min-width="150">
					<template slot-scope="scope">
						<span @click="isContentShow(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
					</template>
				</el-table-column>
				<el-table-column prop="ori_price" label="原始价格" width="100"></el-table-column>
				<el-table-column prop="sale_price" label="出售价格" width="100"></el-table-column>
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
							<el-form-item label="活动名:" prop="name">
								<el-input v-model="addForm.name"></el-input>
							</el-form-item>
							<el-form-item label="举办单位:" prop="organizer">
								<el-input v-model="addForm.organizer"></el-input>
							</el-form-item>
							<el-form-item inline label="举办时间:" prop="time" class="inline-block">
								<div class="inline-block">
									<span class="demonstration"></span>
									<el-date-picker v-model="addForm.time" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp">
									</el-date-picker>
								</div>
							</el-form-item>
							<el-form-item inline label="截止时间:" prop="expire_time" class="inline-block">
								<div class="inline-block">
									<span class="demonstration"></span>
									<el-date-picker v-model="addForm.expire_time" type="date" placeholder="选择日期" :picker-options="pickerOptions" format="yyyy 年 MM 月 dd 日" value-format="timestamp">
									</el-date-picker>
								</div>
							</el-form-item>
							<el-form-item label="状态:" prop="status">
								<el-select v-model="addForm.status">
									<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="是否推荐上首页（热门 v2）:" prop="home">
								<el-select v-model="addForm.home">
									<el-option v-for="item in HomeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="所在城市:" prop="city_id">
								<el-input v-model="addForm.city_id"></el-input>
							</el-form-item>
							<el-form-item label="缩略图:" prop="avatar">
								<el-input v-model="addForm.avatar"></el-input>
								<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
							<el-form-item label="头图:" prop="banner">
								<el-input v-model="addForm.banner"></el-input>
								<el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
							<el-form-item label="首页活动图:" prop="advertisement_img">
								<el-input v-model="addForm.advertisement_img"></el-input>
								<el-button @click="selectMedia3" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
							<el-form-item label="地址:" prop="address">
								<el-input v-model="addForm.address"></el-input>
							</el-form-item>
							<el-form-item label="纬度:" prop="latitude">
								<el-input v-model="addForm.latitude"></el-input>
							</el-form-item>
							<el-form-item label="经度:" prop="longitude">
								<el-input v-model="addForm.longitude"></el-input>
							</el-form-item>
							<el-form-item label="内容:" prop="content">
								<template slot-scope="scope">
									<span @click="isEditShow(scope.$index, scope.row)" style="cursor: pointer">点击编辑内容</span>
								</template>
							</el-form-item>
							<el-form-item label="原始价格:" prop="ori_price">
								<el-input v-model="addForm.ori_price"></el-input>
							</el-form-item>
							<el-form-item label="出售价格:" prop="sale_price">
								<el-input v-model="addForm.sale_price"></el-input>
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
					<div class="categories-news-content" v-html="this.addForm.content">

					</div>
				</div>
			</div>
			<!--富文本弹框-->
			<div class="categories-news" v-if="this.editShow">
				<div class="categories-news-main categories-content-main">
					<div class="categories-news-title">
						<span>详情</span>
						<i class="iconfont icon-msnui-close-fat" @click="cancelEditing"></i>
						<el-upload class="avatar-uploader uploader-none" :show-file-list="false" action="" :on-change="handleTextImageSuccess" :auto-upload="false">
						</el-upload>
					</div>
					<div class="categories-news-content">
						<quill-editor ref="myQuillEditor" v-model="text" :options="editorOption">
						</quill-editor>
						<el-button class="editor-btn" type="primary" @click="submit">
							提交
						</el-button>
					</div>
				</div>

			</div>
			<!--富文本弹框-->
			<div class="categories-news" v-if="this.editShow">
				<div class="categories-news-main categories-content-main">
					<div class="categories-news-title">
						<span>详情</span>
						<i class="iconfont icon-msnui-close-fat" @click="cancelEditing"></i>
						<el-upload class="avatar-uploader uploader-none" :show-file-list="false" action="" :on-change="handleTextImageSuccess" :auto-upload="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload">
						</el-upload>
					</div>
					<div class="categories-news-content">
						<quill-editor ref="myQuillEditor" v-model="text" :options="editorOption">
						</quill-editor>
						<el-button class="editor-btn" type="primary" @click="submit">
							提交
						</el-button>
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
	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';
	import { quillEditor } from 'vue-quill-editor';
	import { getActivity, getActivityOne, deleteActivityOne, postActivity, putActivity, postActivityList, getPicURL } from '../../../../api/api';
	import { formatDate, handleCommonAvatarSuccess } from '../../../Utility/Utility'
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],

		[{
			'header': 1
		}, {
			'header': 2
		}], // custom button values
		[{
			'list': 'ordered'
		}, {
			'list': 'bullet'
		}],
		[{
			'script': 'sub'
		}, {
			'script': 'super'
		}], // superscript/subscript
		[{
			'indent': '-1'
		}, {
			'indent': '+1'
		}], // outdent/indent
		[{
			'direction': 'rtl'
		}], // text direction

		[{
			'size': ['small', false, 'large', 'huge']
		}], // custom dropdown
		[{
			'header': [1, 2, 3, 4, 5, 6, false]
		}],

		[{
			'color': []
		}, {
			'background': []
		}], // dropdown with defaults from theme
		[{
			'font': []
		}],
		[{
			'align': []
		}],
		['link', 'image', 'video'],
		['clean'] // remove formatting button
	];
	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if(/^\s*$/.test(value)) {
					callback(new Error('请输入正确的内容,不可以是空格'));
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
				contentShow: false,
				editShow: false,
				text: '',
				visible2: false,
				//新增界面是否显示
				addFormVisible: false,
				//进度条是否显示
				progressVisible: false,
				progressPercent: 0,
				editorOption: {
					placeholder: '',
					theme: 'snow', // or 'bubble'
					modules: {
						toolbar: {
							container: toolbarOptions, // 工具栏
							handlers: {
								'image': function(value) {
									if(value) {
										document.querySelector('.avatar-uploader input').click()
									} else {
										this.quillEditor.format('image', false);
									}
								}
							}
						}
					}
				},
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

				},
				//新增界面数据
				addForm: {
					name: '',
					organizer: '',
					time: 0,
					expire_time: 0,
					status: 1,
					home: 0,
					city_id: '',
					avatar: '',
					banner: '',
					advertisement_img: '',
					address: '',
					latitude: '',
					longitude: '',
					content: '',
					ori_price: '',
					sale_price: '',
				},
				// 时间选择器-禁止使用的时间
				pickerOptions: {
					// disabledDate(time) {
					//   return time.getTime() > Date.now();
					//   console.log('time是'+time);
					//   console.log('date是'+Date);
					// }
				},
				isEditForm: false, //是否是编辑页面
				statusOptions: [{
					value: 0,
					label: '下线'
				}, {
					value: 1,
					label: '上线'
				}],
				//是否推荐判断
				HomeOptions: [{
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
				this.addForm.avatar = str
			},
			overSelectFile(str){
				this.addForm.avatar = str
			},
			overSelectMedia2(str){
				this.addForm.banner = str
			},
			overSelectFile2(str){
				this.addForm.banner = str
			},
			overSelectMedia3(str){
				this.addForm.advertisement_img = str
			},
			overSelectFile3(str){
				this.addForm.advertisement_img = str
			},
			// 上传图片前
			beforeUpload(res, file) {
				console.log("1111");
			},
			// 上传图片成功
			uploadSuccess(res, file) {
				console.log("222222");
			},
			// 上传图片失败
			uploadError(res, file) {
				console.log("333333");
			},
			//是否上线
			formatStatus: function(row, column, cellValue) {
				console.log(cellValue)
				if(cellValue === 0) {
					return '下线';
				} else {
					return '上线';
				}
			},
			//时间
			formatTime: function(row, column, cellValue) {
				if(cellValue == '' || cellValue == null || cellValue == []) {
					return ''
				} else {
					return formatDate(cellValue)
				}
			},
			indexMethod(index) {
				return index + 1;
			},
			//富文本上传图片
			handleTextImageSuccess(file, fileList) {
				console.log(file.name + file.size);
				if(file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
					var _this = this;
					this.progressVisible = true;
					let quill = this.$refs.myQuillEditor.quill;
					var complete = function(res) {
						if(res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
							// console.log('0000000000');
							getPicURL(res.key).then((res) => {
								// console.log(res.data);
								var urlData = res.data
								let insertStr = (soure, start, newStr) => {
									return soure.slice(0, start) + newStr + soure.slice(start)
								}
								console.log(insertStr(urlData, 4, 's'))
								_this.$message({
									message: "上传成功",
									type: "success"
								});
								_this.progressVisible = false;
								let length = quill.getSelection().index;
								// 插入图片  res.info为服务器返回的图片地址
								quill.insertEmbed(length, 'image', " " + insertStr(urlData, 4, 's'));

								length = quill.getSelection().index;
								// 调整光标到最后
								quill.setSelection(length + 2)
							})
						}
					};

					var error = function(err) {
						console.log(err);
						_this.progressVisible = false;
						alert("上传出错")
					};

					var next = function(response) {
						var total = response.total;
						_this.progressPercent = parseFloat(total.percent.toFixed(2));

					};

					handleCommonAvatarSuccess(file, fileList, complete, error, next)
				} else {
					this.$message({
						message: "请输入jpg,jpeg,png格式图片",
						type: "error"
					})
				}

			},
			//获取数据
			async getData() {
				await getActivity(this.cur_page, this.size).then(res => {
					console.log(res.data);
					if(!res.data.data || res.data.data === [] || res.data.data.length === 0) {
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
			//搜索
			search() {
				if(this.select_cate !== '') {
					getActivityOne(parseInt(this.select_cate)).then(res => {
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
					deleteActivityOne(row.id).then((res) => {
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
				postActivityList(str).then((res) => {
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
				this.text = '';
				this.select_cate = '';
				this.isEditForm = false;
				this.addForm = {
					name: '',
					organizer: '',
					time: new Date(),
					expire_time: new Date(),
					status: 1,
					home: 0,
					city_id: '',
					avatar: '',
					banner: '',
					advertisement_img: '',
					address: '',
					latitude: '',
					longitude: '',
					content: '',
					ori_price: '',
					sale_price: '',
				};
				this.addFormVisible = true;
			},

			//新增
			myPostActivityAdd() {
				this.addForm.time = this.addForm.time;
				this.addForm.expire_time = this.addForm.expire_time;
				postActivity(this.addForm).then((res) => {
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

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					console.log(valid);
					if(valid) {
						if(this.isEditForm) {
							this.myPutActivityChange();
						} else {
							this.myPostActivityAdd();
						}
					}
				})

			},

			//编辑按钮点击
			handleEdit(index, row) {
				this.text = row.content,
					this.isEditForm = true;
				this.addForm = {
					id: row.id,
					name: row.name,
					organizer: row.organizer,
					time: row.time,
					expire_time: row.expire_time,
					status: row.status,
					home: row.home,
					city_id: row.city_id,
					avatar: row.avatar,
					banner: row.banner,
					advertisement_img: row.advertisement_img,
					address: row.address,
					latitude: row.latitude,
					longitude: row.longitude,

					content: row.content,
					ori_price: row.ori_price,
					sale_price: row.sale_price,
					//                    create_time:'',
					//                    update_time:'',
				};
				this.addFormVisible = true;
			},
			//修改
			myPutActivityChange() {
				putActivity(this.addForm, this.addForm.id).then((res) => {
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
			},

			//详情
			isContentShow(index, row) {
				this.contentShow = true;
				console.log('hang', row);
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
				this.$message.success('内容修改成功！');
				this.text = '';
			}
		},
		components: {
			quillEditor
		},
	}
</script>

<style scoped>
	.inline-block {
		display: inline-block;
	}
	
	.handle-box {
		height: 32px;
	}
	
	.handle-box .addbtn {
		float: right;
	}
</style>