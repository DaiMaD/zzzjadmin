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

			<el-table :data="list" border max-height="680" style="width: 100%" ref="multipleTable"
				@selection-change="handleSelectionChange"
				:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
				<el-table-column type="selection" width="55" fixed></el-table-column>
				<el-table-column prop="category_id" label="分类ID" min-width="80" fixed></el-table-column>
				<el-table-column prop="name" label="书籍名称" min-width="100" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="author" label="作者" min-width="100" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="lecturer" label="解读人" min-width="100" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="reading_amount" label="观看人数" min-width="100"></el-table-column>
				<el-table-column prop="cover_img" label="书籍缩略图" min-width="100">
					<template slot-scope="scope">
						<a :href="scope.row.cover_img" target="true"><img :src="scope.row.cover_img" height="90%" /></a>
					</template>
				</el-table-column>
				<el-table-column prop="content" label="内容" min-width="100">
					<template slot-scope="scope">
						<span @click="isContentShow(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" min-width="70" :formatter="formatStatus"></el-table-column>
				<el-table-column prop="type" label="属性" min-width="70" :formatter="formatType"></el-table-column>
				<el-table-column prop="ori_price" label="原始价格" min-width="70"></el-table-column>
				<el-table-column prop="sale_price" label="销售价格" min-width="70"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" min-width="200" :formatter="formatTime"></el-table-column>
				<el-table-column prop="update_time" label="修改时间" min-width="200" :formatter="formatTime"></el-table-column>
				<el-table-column label="操作" min-width="180" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- -------分页------------- -->
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
						<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="120px">

							<el-form-item label="分类id:" prop="category_id">
								<el-input v-model="addForm.category_id"></el-input>
							</el-form-item>

							<el-form-item label="图书uuid:">
								<el-input v-model="addForm.uuid"></el-input>
							</el-form-item>

							<el-form-item label="书籍名称:" prop="name">
								<el-input v-model="addForm.name"></el-input>
							</el-form-item>

							<el-form-item label="副标题:" prop="content_brief">
								<el-input v-model="addForm.content_brief"></el-input>
							</el-form-item>

							<el-form-item label="作者:" prop="author">
								<el-input v-model="addForm.author"></el-input>
							</el-form-item>

							<el-form-item label="解读人:" prop="lecturer">
								<el-input v-model="addForm.lecturer" width="90"></el-input>
							</el-form-item>
							<el-form-item label="书籍缩略图:" prop="cover_img">
								<el-input v-model="addForm.cover_img"></el-input>
								<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
							<el-form-item label="列表缩略图:" prop="avatar">
								<el-input v-model="addForm.avatar"></el-input>
								<el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
							</el-form-item>
							<el-form-item label="音频地址" prop="sound_url">
								<el-input v-model="addForm.sound_url"></el-input>
								<el-upload class="upload-demo" :show-file-list="false" action="" :on-change="handleAudioSuccess"
									:auto-upload="false">
									<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
								</el-upload>
							</el-form-item>
							<el-form-item label="观看人数:" prop="reading_amount">
								<el-input v-model="addForm.reading_amount"></el-input>
							</el-form-item>
							<el-form-item label="内容:" prop="content">
								<template slot-scope="scope">
									<span @click="isEditShow(scope.$index, scope.row)" style="cursor: pointer">点击编辑内容</span>
								</template>
							</el-form-item>

							<el-form-item label="状态:" prop="status">
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

							<el-form-item label="是否推荐上首页:" prop="home">
								<el-select v-model="addForm.home">
									<el-option v-for="item in homeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="属性:" prop="type">
								<el-select v-model="addForm.type">
									<el-option v-for="item in typesOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="原始价格:" prop="ori_price">
								<el-input type="number" v-model="addForm.ori_price"></el-input>
							</el-form-item>

							<el-form-item label="销售价格:" prop="sale_price">
								<el-input type="number" v-model="addForm.sale_price"></el-input>
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
						<el-upload class="avatar-uploader uploader-none" :show-file-list="false" action=""
							:on-change="handleTextImageSuccess" :auto-upload="false">
							<!-- :on-success="uploadSuccess" -->
							<!-- :on-error="uploadError" -->
							<!-- :before-upload="beforeUpload" -->

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
			<media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia"
				@overSelectFile="overSelectFile"></media-select>
			<media-select v-if="isSelect2" @close="closeMedia" @overSelectMedia="overSelectMedia2"
				@overSelectFile="overSelectFile2"></media-select>
			<!--进度条弹框-->
			<div class="categories-news" v-if="this.progressVisible">
				<!--<el-progress :text-inside="true" :stroke-width="18" :percentage="this.progressPercent"></el-progress>-->

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
	import { getReadingClassList, createReadingClass, updateReadingClass, getPicURL, getAudioURL, deleteReadingClass } from '../../../../api/api';
	import { formatDate, handleCommonAvatarSuccess, handleCommonAudioSuccess } from '../../../Utility/Utility';
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
				if (/^\s*$/.test(value)) {
					callback(new Error('请输入正确的内容,不可以是空格'));
				} else {
					callback();
				}
			};
			return {
				isSelect: false,
				isSelect2: false,
				select_cate: '',
				cur_page: 1,
				list: [],
				total: 0,
				size: 10,
				contentShow: false,
				editShow: false,
				text: '',
				//名称不能为空
				addFormRules: {
					name: [
						{ required: true, message: '名称字段不能为空' },
						{ validator: validateName, trigger: 'blur' }
					],
					lecturer: [
						{ required: true, message: '讲师名称不能为空' },
						{ validator: validateName, trigger: 'blur' }
					],
					ori_price: [
						{ required: true, message: '原始价格不能为空' },
						{ validator: validateName, trigger: 'blur' }
					],
					sale_price: [
						{ required: true, message: '销售价格不能为空' },
						{ validator: validateName, trigger: 'blur' }
					],
					//
				},
				//新增界面是否显示
				addFormVisible: false,
				//进度条是否显示
				progressVisible: false,
				progressPercent: 0,
				//新增界面数据
				addForm: {
					uuid: '',
					category_id: 1,
					name: '',
					author: '',
					position: '',
					content: '',
					lecturer: '',
					avatar: '',
					cover_img: '',
					content_brief: '',
					sound_url: '',
					status: 0,
					ori_price: 0,
					sale_price: 0,
					recommend: 0,
					home: 0,
					type: 0,
					reading_amount: '',
				},
				editorOption: {
					placeholder: '',
					theme: 'snow', // or 'bubble'
					modules: {
						toolbar: {
							container: toolbarOptions, // 工具栏
							handlers: {
								'image': function (value) {
									if (value) {
										document.querySelector('.avatar-uploader input').click()
									} else {
										this.quillEditor.format('image', false);
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
					label: '不可用'
				},
				{
					value: 1,
					label: '可用'
				}
				], //付费属性
				typesOptions: [{
					value: 0,
					label: '免费'
				},
				{
					value: 1,
					label: '付费'
				}
				],
				//是否推荐
				recommendOptions: [{
					value: 0,
					label: '否'
				}, {
					value: 1,
					label: '是'
				}],
				//是否推荐上首页/  home
				homeOptions: [{
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
			selectMedia() {
				this.isSelect = true;
			},
			selectMedia2() {
				this.isSelect2 = true;
			},
			closeMedia() {
				this.isSelect = false
				this.isSelect2 = false
			},
			overSelectMedia(str) {
				this.addForm.cover_img = str
			},
			overSelectFile(str) {
				this.addForm.cover_img = str
			},
			overSelectMedia2(str) {
				this.addForm.avatar = str
			},
			overSelectFile2(str) {
				this.addForm.avatar = str
			},
			//读书上传音频
			handleAudioSuccess(file, fileList) {
				// console.log(file.name + file.size);
				this.progressVisible = true;
				if (file.name && file.name.match(/\.(mp3|MP3)$/)) {
					var _this = this;
					var complete = function (res) {
						if (res.key && res.key.match(/\.(mp3|MP3)$/)) {
							// console.log(res.key);
							getAudioURL(res.key).then((res) => {
								// console.log(res.data);
								_this.progressVisible = false;
								_this.addForm.sound_url = res.data
							})
						}
					};
					var error = function (err) {
						// console.log(err);
						_this.progressVisible = false;
						alert("上传出错")
					};

					var next = function (response) {
						var total = response.total;
						_this.progressPercent = parseFloat(total.percent.toFixed(2));
						// console.log(_this.progressPercent);

					};
					handleCommonAudioSuccess(file, fileList, complete, error, next)
				} else {
					this.progressVisible = false;
					this.$message({
						message: "请输入mp3格式音频",
						type: "error"
					})
				}

			},

			//富文本上传图片
			handleTextImageSuccess(file, fileList) {
				console.log(file.name + file.size);
				if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {

					file.name = Number(new Date()) + `${/\.(jpg|jpeg|png)$/.exec(file.name)[0]}`;

					var _this = this;
					this.progressVisible = true;
					let quill = this.$refs.myQuillEditor.quill;
					var complete = function (res) {
						if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
							console.log('0000000000');
							getPicURL(res.key).then((res) => {
								console.log(res.data);
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

					var error = function (err) {
						console.log(err);
						_this.progressVisible = false;
						alert("上传出错")
					};

					var next = function (response) {
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
			// 书籍缩略图
			handleAvatarSuccess(file, fileList) {
				console.log(file.name + file.size);
				if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
					var _this = this;
					this.progressVisible = true;
					var complete = function (res) {
						if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
							console.log('77777');
							getPicURL(res.key).then((res) => {
								console.log(res.data);

								_this.$message({
									message: "上传成功",
									type: "success"
								});
								_this.progressVisible = false;
								_this.addForm.cover_img = res.data
							})
						}
					};

					var error = function (err) {
						console.log(err);
						_this.progressVisible = false;
						alert("上传出错")
					};

					var next = function (response) {
						var total = response.total;
						_this.progressPercent = parseFloat(total.percent.toFixed(2));
						console.log(_this.progressPercent);

					};

					handleCommonAvatarSuccess(file, fileList, complete, error, next)
				} else {
					this.$message({
						message: "请输入jpg,jpeg,png格式图片",
						type: "error"
					})
				}

			},
			//列表缩略图
			handleBannerSuccess(file, fileList) {
				console.log(file.name + file.size);
				if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
					var _this = this;
					this.progressVisible = true;
					var complete = function (res) {
						if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
							console.log('77777');
							getPicURL(res.key).then((res) => {
								console.log(res.data);
								_this.progressVisible = false;
								_this.addForm.avatar = res.data
							})
						}
					};

					var error = function (err) {
						console.log(err);
						_this.progressVisible = false;
						alert("上传出错")
					};

					var next = function (response) {
						var total = response.total;

						_this.progressPercent = parseFloat(total.percent.toFixed(2));

						console.log(_this.progressPercent);

					};

					handleCommonAvatarSuccess(file, fileList, complete, error, next)
				} else {
					this.$message({
						message: "请输入jpg,jpeg,png格式图片",
						type: "error"
					})
				}

			},

			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await getReadingClassList(this.cur_page, this.size).then(res => {
					console.log(res.data)
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
			//搜索
			search() {
				if (this.select_cate !== '') {
					getCoursesOne(parseInt(this.select_cate)).then(res => {
						if (res.data == null) {
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
					deleteReadingClass(row.id).then((res) => {
						if (res.success === true) {
							this.select_cate = "";
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

			//再次获取数据，以消除分页后单页数据数量减少
			//批量删除
			batchDelete() {
				let str = '';
				this.multipleSelection.forEach((selection, index) => {
					str += `${selection.id},`
				});
				if (str.endsWith(',')) {
					str = str.slice(0, -1);
				}

				postCoursesList(str).then((res) => {
					if (res.success === true) {
						this.getData();
					}
				});
			},

			//点击选中被删除项
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			//新增弹框按钮点击显示
			handleAdd() {
				this.select_cate = "";
				this.text = '';
				this.isEditForm = false;
				this.addForm = {
					// id:0,
					category_id: 1,
					name: '',
					author: '',
					position: '',
					content: '',
					lecturer: '',
					avatar: '',
					cover_img: '',
					content_brief: '',
					sound_url: '',
					status: 0,
					ori_price: 0,
					sale_price: 0,
					recommend: 0,
					home: 0,
					type: 0,
					reading_amount: '',
				};
				this.addFormVisible = true;
			},
			//新增
			myPostCoursesAdd() {
				createReadingClass(this.addForm).then((res) => {
					if (res.success === true) {
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
			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					if (valid) {
						if (this.isEditForm) {
							this.myPutCoursesChange();
						} else {
							this.myPostCoursesAdd();
						}
					}
				})
			},
			//编辑按钮点击
			handleEdit(index, row) {
				this.text = row.content;
				this.isEditForm = true;
				this.addForm = {
					uuid: row.uuid,
					id: row.id,
					category_id: row.category_id,
					name: row.name,
					author: row.author,
					position: row.position,
					content: row.content,
					lecturer: row.lecturer,
					avatar: row.avatar,
					cover_img: row.cover_img,
					content_brief: row.content_brief,
					sound_url: row.sound_url,
					status: row.status,
					ori_price: row.ori_price,
					sale_price: row.sale_price,
					recommend: row.recommend,
					home: row.home,
					type: row.type,
					reading_amount: row.reading_amount,
				};
				this.addFormVisible = true;
			},
			//修改
			myPutCoursesChange() {
				updateReadingClass(this.addForm, this.addForm.id).then((res) => {
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
			//下拉框/时间值处理
			//分类状态判断
			formatStatus: function (row, column, cellValue) {
				if (cellValue === 0) {
					return '不可用';
				} else {
					return '可用';
				}
			},
			//属性状态判断
			formatType: function (row, column, cellValue) {
				if (cellValue === 0) {
					return '免费';
				} else {
					return '付费';
				}
			},
			//推荐判断
			formatRecommend: function (row, column, cellValue) {
				if (cellValue === 0) {
					return '否'
				} else {
					return '是'
				}
			},
			//home判断
			formatHome: function (row, column, cellValue) {
				if (cellValue === 0) {
					return '否';
				} else {
					return '是';
				}

			},
			//时间
			formatTime: function (row, column, cellValue) {
				return formatDate(cellValue)
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
	.handle-box {
		height: 32px;
	}

	.handle-box .addbtn {
		float: right;
	}
</style>