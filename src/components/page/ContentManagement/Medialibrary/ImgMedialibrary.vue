<template>
	<div class="table">
		<div class="container">
			<div class="handle-box">
				<div class="addbtn">
					<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
						<i class="el-icon-info addbtn2"></i>
					</el-tooltip>
					<el-button type="primary" icon="add" @click="addImg" class="">新增</el-button>
				</div>
			</div>
			<div class="mediaBox">

				<el-row :gutter="0">
					<el-col :span="4.8" v-for="item in imgsArr" :key="item.id" class="allImgbox">
						<img :src="item.img_url" alt="" class="mediaImgs" />
						<div class="edits" @click="editImg(item)">
							<i class="el-icon-edit"></i>
						</div>
						<div class="delimg" @click="delImg(item)">
							<i class="el-icon-delete"></i>
						</div>
						<div class="imgInfo">
							<span>{{ item.img_name }}</span>
						</div>
						<div class="imgInfo2"></div>
					</el-col>
				</el-row>
			</div>
		</div>
		<!--新增编辑弹框-->
		<div class="categories-news" v-if="this.addFormVisible">
			<div class="categories-news-main">
				<div class="categories-news-title">
					<span>{{this.isEditForm?'修改':'新增'}}</span>
					<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
				</div>
				<div class="categories-news-content">
					<el-form :model="addForm" ref="addForm" label-position="left" label-width="80px">
						<el-form-item label="标题:" prop="to_id">
							<el-input v-model="addForm.img_name"></el-input>
						</el-form-item>
						<el-form-item label="上传图片:" prop="pic_url">
							<el-input v-model="addForm.img_url"></el-input>
							<el-upload class="upload-demo" :show-file-list="false" action="" :on-change="handlePicSuccess"
								:auto-upload="false">
								<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
							</el-upload>
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
	</div>
</template>

<script>
	import { getMediaData, postMediaData, putMediaData, DelMediaData, getPicURL } from '../../../../api/api';
	import { formatDate, handleCommonAvatarSuccess } from '../../../Utility/Utility';
	export default {
		data() {
			return {
				imgsArr: [],
				group: 0, // request param
				select_cate: '',
				cur_page: 1,
				list: [],
				total: 0,
				size: 10,
				addFormVisible: false,
				selectType: 'meitiku',
				selectImgSrc: '',
				//新增界面数据
				addForm: {
					id: '',
					img_name: '',
					img_url: '',
					status: 0
				},
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
				this.addImg();
				this.addFormVisible = true;
			},
			closeKey() {
				this.addFormVisible = false;
			},
			//上传首页轮播图片
			handlePicSuccess(file, fileList) {
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
								_this.addForm.img_url = res.data
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
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await getMediaData().then(res => {
					console.log(res);
					if (!res.data || res.data === [] || res.data.length === 0) {
						if (this.cur_page - 1 > 0) {
							this.cur_page -= 1
							this.getData()
						} else {
							this.list = []
						}
					} else {
						//          this.imgsArr = this.imgsArr.concat(res.data);
						this.imgsArr = res.data.data
						this.group++
						if (res.data.count) {
							this.total = res.data.count
						} else {
							this.total = res.data.length
						}
					}
				});
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
			//删除
			delImg(row) {
				// 新增删除提示
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: "btn-custom-cancel",
					type: 'warning'
				}).then(() => {
					DelMediaData(row.id).then(res => {
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
						type: 'img_name',
						message: '已取消删除'
					});
				});
			},
			//点击选中被删除项
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//新增弹框按钮点击显示
			addImg() {
				this.select_cate = "";
				this.text = '';
				this.isEditForm = false;
				this.addForm = {
					img_url: '',
					img_name: '',
					status: 0
				};
				this.addFormVisible = true;
			},
			//新增
			myPostCoursesAdd() {
				console.log(this.addForm)
				postMediaData(this.addForm).then((res) => {
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
			editImg(item) {
				this.isEditForm = true;
				this.addForm = {
					id: item.id,
					img_url: item.img_url,
					img_name: item.img_name,
					status: item.status
				};
				this.addFormVisible = true;
			},
			//修改
			myPutCoursesChange() {
				putMediaData(this.addForm.id, this.addForm).then((res) => {
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
			selectImg(e, item) {
				if (document.querySelector('.isSelect_media')) {
					document.querySelector('.isSelect_media').classList.remove("isSelect_media");
				}
				e.currentTarget.parentNode.classList.add("isSelect_media") //.classList.add("类名") js添加单个class
				this.selectImgSrc = item.img_url;
			}
		},
		components: {
		},
		mounted() {
			setTimeout(function () {
				var domArr = document.querySelectorAll('.mediaBox>.el-row .allImgbox');
				// console.log(domArr);
				for (let i = 0; i < domArr.length; i++) {
					// console.log(domArr[i].children[0].width);
					// console.log(domArr[i].children);
					domArr[i].children[4].innerHTML = '图片尺寸：' + domArr[i].children[0].width + 'X' + domArr[i].children[0].height;
				}
			}, 500)
		},
	}
</script>

<style scoped>
	.mediaBox {
		/* height: 530px; */
		/* overflow: scroll;
		overflow-x: hidden; */
		text-align: center;
		position: relative;
	}

	.mediaImgs {
		max-height: 85%;
		max-width: 100%;
		position: absolute;
		/* bottom: 0; */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.allImgbox {
		border: 2px solid #eee;
	}

	.el-col {
		height: 150px;
		width: 150px;
		margin: 10px;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
	}

	.imgInfo {
		position: absolute;
		bottom: -30px;
		left: 0;
		height: 30px;
		width: 100%;
		background: rgba(0, 0, 0, .6);
		color: #fff;
		text-align: center;
		line-height: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}

	.el-col:hover .imgInfo {
		bottom: 0px;
	}

	.imgInfo2 {
		position: absolute;
		top: -30px;
		height: 30px;
		background: rgba(0, 0, 0, .6);
		color: #fff;
		line-height: 30px;
		width: 100%;
		font-size: 10px;
	}

	.el-col:hover .imgInfo2 {
		top: 0px;
	}

	.edits {
		width: 30px;
		height: 30px;
		position: absolute;
		bottom: 35px;
		right: -30px;
		font-size: 16px;
		color: #fff;
		text-align: center;
		line-height: 30px;
		background: rgba(0, 0, 0, .6);
		border-radius: 50%;
	}

	.el-col:hover .edits {
		right: 5px;
	}

	.delimg {
		width: 30px;
		height: 30px;
		position: absolute;
		bottom: 70px;
		right: -30px;
		font-size: 16px;
		color: #fff;
		text-align: center;
		line-height: 30px;
		background: rgba(0, 0, 0, .6);
		border-radius: 50%;
	}

	.el-col:hover .delimg {
		right: 5px;
	}

	.el-tabs {
		width: 50%;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 15%;
		margin-bottom: 8%;
	}

	.el-tabs>div {
		width: auto !important;
		left: 0 !important;
		top: 0% !important;
		background: #fff !important;
	}

	.addoreditBox {
		width: 100% !important;
		top: 0;
		position: relative;
		margin: 0 !important;
		overflow: hidden;
	}

	.selectlocal {
		height: 400px;
	}

	.isSelect_media {
		box-shadow: 0px 0px 1px 3px blue;
	}

	.selectImgSrc {
		width: 300px;
	}
</style>