<template>
	<div class="table">
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
				<el-input size="medium" v-model="keywords" placeholder="请输入查询关键词" class="handle-select mr10" clearable>
				</el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<div class="addbtn">
					<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
						<i class="el-icon-info addbtn2"></i>
					</el-tooltip>
					<el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
				</div>
			</div>
			<el-table :data="list" max-height="680" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
				<el-table-column type="selection" width="55" fixed></el-table-column>
				<el-table-column prop="course_id" label="所属课程" min-width="70" fixed></el-table-column>
				<el-table-column prop="name" label="小节名称" min-width="120" fixed :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="type" label="付费/免费/预告" min-width="110" :formatter="formattype"></el-table-column>
				<el-table-column prop="lecturer" label="讲师名称" min-width="100"></el-table-column>
				<el-table-column prop="video_time" label="视频时长" min-width="100"></el-table-column>
				<el-table-column prop="status" label="状态" min-width="100" :formatter="formatStatus"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" min-width="200" :formatter="formatTime"></el-table-column>
				<el-table-column prop="update_time" label="更新时间" min-width="200" :formatter="formatTime"></el-table-column>
				<el-table-column label="操作" min-width="180" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑
						</el-button>
						<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--分页栏-->
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
						<el-form :model="addForm" ref="addForm" label-position="left" label-width="80px">

							<el-form-item label="所属课程" prop="course_id">
								<el-input v-model.number="addForm.course_id"></el-input>
							</el-form-item>
							<el-form-item label="小节名称" prop="name">
								<el-input v-model="addForm.name"></el-input>
							</el-form-item>
							<el-form-item label="讲师名称:" prop="lecturer">
								<el-input v-model="addForm.lecturer"></el-input>
							</el-form-item>
							<el-form-item label="内容:" prop="content">
								<template slot-scope="scope">
									<span @click="isEditShow(scope.$index, scope.row)" style="cursor: pointer">
                    点击编辑内容
                  </span>
								</template>
							</el-form-item>
							<el-form-item label="视频链接:" prop="video_url">
								<el-input v-model="addForm.video_url"></el-input>
								<el-upload class="upload-demo" :show-file-list="false" action="" :on-change="handleVideoSuccess" :auto-upload="false">
									<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
								</el-upload>
							</el-form-item>
							<el-form-item label="视频时长" prop="video_time">
								<el-input v-model="addForm.video_time"></el-input>
							</el-form-item>
							<el-form-item label="状态:" prop="status">
								<el-select v-model="addForm.status">
									<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="小节属性:" prop="type">
								<el-select v-model="addForm.type">
									<el-option v-for="item in propertyOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="PPT上传" prop="ppts">
								<el-input v-model="addForm.ppts"></el-input>
								<el-upload
                  class="upload-demo"
                  :show-file-list="false"
                  action=""
                  :on-change="handlePPTSuccess"
                  :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
							</el-form-item>
						</el-form>
					</div>
					<div class="categories-news-button">
						<button class="" @click="confirmAdd">确定</button>
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
							<!--:on-success="uploadSuccess"-->
							<!--:on-error="uploadError"-->
							<!--:before-upload="beforeUpload">-->
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
	import {
		getSections,
		getSectionsOne,
		deleteSectionsOne,
		postSections,
		putSections,
		postSectionsList,
		getPicURL,
		getPPTURL,
		searchClassAll
	} from '../../../../api/api';
	import {
		formatDate,
		handleCommonVideoSuccess,
		handleCommonAvatarSuccess,
		handleCommonPPTSuccess
	} from '../../../Utility/Utility'

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
				contentShow: false,
				editShow: false,
				text: '',
				//新增界面是否显示
				addFormVisible: false,
				fileList2: [],
				//进度条是否显示
				progressVisible: false,
				progressPercent: 0,
				//搜索
				parentid: 1,
				keywords: '',
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
				//新增界面数据
				addForm: {
					course_id: 0,
					name: '',
					lecturer: '',
					content: '' + '<link rel="stylesheet" type="text/css" href="http://share.wezhenzhi.com/rich_text_style.css">',
					video_url: '',
					video_time: '',
					status: 0,
					type: 0,
					position: '',
					avatar: '',
					ppts: '',
				},

				isEditForm: false, //是否是编辑页面
				//分类状态
				statusOptions: [{
					value: 0,
					label: '下线'
				}, {
					value: 1,
					label: '上线'
				}],
				//小节属性
				propertyOptions: [{
					value: 0,
					label: '免费'
				}, {
					value: 1,
					label: '付费'
				}, {
					value: -1,
					label: '预告'
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
			//富文本上传图片
			handleTextImageSuccess(file, fileList) {
				console.log(file.name + file.size);
				if(file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
					var _this = this;
					this.progressVisible = true;
					let quill = this.$refs.myQuillEditor.quill;
					var complete = function(res) {
						if(res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
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
					var error = function(err) {
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
			//上传ppt
      handlePPTSuccess(file, fileList) {
        // console.log(file.name + file.size);
        if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
          var _this = this;
          this.progressVisible = true;
          var pptList = []
          var complete = function (res) {
            if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
              getPPTURL(res.key).then((res) => {
                console.log(res.data);
                pptList.push(res.data);
                _this.$message({
                  message: "上传成功",
                  type: "success"
                });
                _this.progressVisible = false;
                if(!_this.addForm.ppts){
                  _this.addForm.ppts = res.data
                } else {
                  _this.addForm.ppts +=  '#@'+res.data
                }
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
          handleCommonPPTSuccess(file, fileList, complete, error, next)
        } else {
          this.$message({
            message: "请输入jpg,jpeg,png格式的幻灯片",
            type: "error"
          })
        }
      },

			//上传视频
			handleVideoSuccess(file, fileList) {
				if(file.name && file.name.match(/\.(mp4|MP4)$/)) {
					var _this = this;
					this.progressVisible = true;
					var complete = function(res) {
						if(file.name && file.name.match(/\.(mp4|MP4)$/)) {
							_this.progressVisible = false;
							_this.addForm.video_url = res.key
						}
					};

					var error = function(err) {
						_this.progressVisible = false;
						alert("上传出错")
					};

					var next = function(response) {
						var total = response.total;
						_this.progressPercent = parseFloat(total.percent.toFixed(2));
					};
					handleCommonVideoSuccess(file, fileList, complete, error, next)
				} else {
					this.$message({
						message: "请输入Mp4格式视频地址",
						type: "error"
					})
				}
			},
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await getSections(this.cur_page, this.size).then(res => {
					console.log("自定义当前页数" + this.cur_page + "自定义当前条目数" + this.size);
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
				console.log(val);
			},
			handleSizeChange(val) {
				this.size = val
				this.getData();
				document.getElementById("table").setAttribute("style", "height: 1100px !important");
			},
			//搜索
			search() {
				if(this.keywords !== '') {
					searchClassAll(this.parentid, this.keywords, this.cur_page, this.size).then(res => {
						console.log(res.data.data)
						if(res.data == null) {
							this.list = null
						} else {
							this.list = res.data.data
							console.log(this.list);
							// this.list.splice(0,this.list.length,res.data.data)
						}
					});
				} else {
					this.list = JSON.parse(JSON.stringify(this.del_list)) //parse 用于从一个字符串中解析出json 对象,stringify用于从一个对象解析出字符串
					console.log(this.list)
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

					deleteSectionsOne(row.id).then((res) => {
						if(res.success === true) {
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
			//批量删除
			batchDelete() {
				let str = '';
				this.multipleSelection.forEach((selection, index) => {
					str += `${selection.id},`
				});
				if(str.endsWith(',')) {
					str = str.slice(0, -1);
				}

				postSectionsList(str).then((res) => {
					if(res.success === true) {
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
				this.isEditForm = false;
				this.text = '';
				this.addForm = {
					course_id: 0,
					name: '',
					lecturer: '',
					content: '444444' + '<link rel="stylesheet" type="text/css" href="http://share.wezhenzhi.com/rich_text_style.css">',
					video_url: '',
					video_time: '',
					status: 0,
					type: 0,
					position: '',
					avatar: '',
					ppts: '',
				};
				this.addFormVisible = true;
			},

			//新增
			myPostSectionAdd() {
				postSections(this.addForm).then((res) => {
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

			//新增弹框 确认按钮 点击
			confirmAdd() {
				this.$refs['addForm'].validate((valid) => {
					if(valid) {
						if(this.isEditForm) {
							this.myPutSectionsChange();
						} else {
							this.myPostSectionAdd();
						}
					}
				})
			},

			//编辑按钮点击显示
			handleEdit(index, row) {
				this.text = row.content;
				this.isEditForm = true;
				this.addForm = {
					course_id: row.course_id,
					id: row.id,
					name: row.name,
					content: row.content,
					lecturer: row.lecturer,
					video_url: row.video_url,
					video_time: row.video_time,
					status: row.status,
					position: row.position,
					type: row.type,
					avatar: row.avatar,
					ppts: row.ppts
				};
				this.addFormVisible = true;
			},

			//修改
			myPutSectionsChange() {
				putSections(this.addForm, this.addForm.id).then((res) => {
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

			//下拉框/时间值处理
			//分类状态判断
			formatStatus: function(row, column, cellValue) {
				if(cellValue === 0) {
					return '下线';
				} else {
					return '上线';
				}
			},
			//时间
			formatTime: function(row, column, cellValue) {
				return formatDate(cellValue)
			},
			formattype: function(row, column, cellValue) {
				if(cellValue == -1) {
					return '预购'
				} else if(cellValue == 0) {
					return '免费'
				} else if(cellValue == 1) {
					return '付费'
				}
			},
			//详情
			isContentShow(index, row) {
				this.contentShow = true;
				this.addForm.content = row.content;
			},
			//编辑富文本
			isEditShow(index, row) {
				this.editShow = true;
			},
			//取消编辑
			cancelEditing() {
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