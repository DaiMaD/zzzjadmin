<template>
	<!--媒体选择器-->
	<div class="categories-news">
		<i class="iconfont icon-msnui-close-fat" @click="closeMediaSelect"></i>
		<el-tabs type="border-card" v-model="selectType">
			<!-- <div class="categories-news-main addoreditBox"> -->
			<el-tab-pane label="媒体库" name="meitiku">
				<div class="categories-news-title selectmediaTitle">
					<span class="titleInfo">图片标题：</span>
					<el-input v-model="selectImgTitle" class="selectImgSrc"></el-input>
				</div>
				<div class="selectmedia">
					<el-row :gutter="0">
						<el-col :span="4.8" v-for="item in imgsArr" :key="item.id" class="allImgbox">
							<img :src="item.img_url" alt="" class="mediaImgs" @click="selectImg($event,item)" />
							<div class="imgInfo">
								<span>{{ item.img_name }}</span>
							</div>
							<div class="imgInfo2"></div>
						</el-col>
					</el-row>
				</div>
				<div class="selectFoot">
					<button @click="closeMediaSelect" type="primary"
						class="el-button el-button--primary el-button--small">取消</button>
					<button @click="overSelectMedia" type="primary"
						class="el-button el-button--primary el-button--small">确定</button>
				</div>
			</el-tab-pane>
			<el-tab-pane label="选择文件" name="system">
				<div class="selectlocal">
					<div class="selectTitle">
						<div class="selectHead">
							<span class="titleInfo">图片标题：</span>
							<el-input v-model="selectFileTitle" class="selectImgSrc"></el-input>
						</div>
						<div class="selectHead">
							<span class="titleInfo">图片链接：</span>
							<el-input v-model="selectFile" class="selectImgSrc"></el-input>
							<el-upload class="upload-demo" :show-file-list="false" action="" :on-change="handlePicSuccess"
								:auto-upload="false">
								<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
							</el-upload>
						</div>
					</div>
					<div class="selectbody">
						<img src="" alt="" id="showImg" />
					</div>
					<div class="selectFoot">
						<button @click="closeMediaSelect" type="primary"
							class="el-button el-button--primary el-button--small">取消</button>
						<button @click="overSelectFile" type="primary"
							class="el-button el-button--primary el-button--small">确定</button>
					</div>
				</div>
			</el-tab-pane>
			<!-- </div> -->
		</el-tabs>
		<!--进度条弹框-->
		<div class="categories-news" v-if="this.progressVisible">
			<!--<el-progress :text-inside="true" :stroke-width="18" :percentage="this.progressPercent"></el-progress>-->
			<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
		</div>
	</div>
</template>

<script>
	import bus from './bus'
	import { getMediaData, getPicURL, postMediaData } from '../../api/api';
	import { handleCommonAvatarSuccess } from '../Utility/Utility';
	export default {
		data() {
			return {
				imgsArr: [],//存放媒体库图片集
				selectType: 'meitiku',//初始展示为媒体库，另一选项为system本地选择
				selectImgSrc: '',//媒体库选中图片的url
				selectImgTitle: '',
				selectFile: '',//选择本地图片返回的链接
				selectFileTitle: '',//选择本地图片设置标题
				progressVisible: false,
				progressPercent: 0,//上传进度条进度
				addForm: {
					img_name: '',
					img_url: '',
					status: 0
				}
			}
		},
		created() {
			this.getData()
		},
		methods: {
			async getData() {
				await getMediaData().then(res => {
					this.imgsArr = res.data.data
				})
			},
			//上传本地图片
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
								_this.selectFile = res.data;
								document.getElementById('showImg').setAttribute('src', res.data)
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
			//关闭媒体选择器
			closeMediaSelect() {
				this.$emit('close', 'false')
			},
			//媒体库选择图片方法
			selectImg(e, item) {
				if (document.querySelector('.isSelect_media')) {
					document.querySelector('.isSelect_media').classList.remove("isSelect_media");
				}
				e.currentTarget.parentNode.classList.add("isSelect_media"); //.classList.add("类名") js添加单个class
				this.selectImgSrc = item.img_url;
				this.selectImgTitle = item.img_name;
			},
			//媒体库选择图片完成，点击确定按钮
			overSelectMedia() {
				this.$emit('overSelectMedia', this.selectImgSrc);
				this.$emit('close', 'false');
			},
			//选择本地文件完成点击确定，在完成后给媒体库图片集添加新增的图片
			overSelectFile() {
				this.$emit('overSelectFile', this.selectFile);
				this.$emit('close', 'false');
				this.addForm = {
					img_name: this.selectFileTitle,
					img_url: this.selectFile,
					status: 0
				}
				postMediaData(this.addForm).then((res) => {
					if (res.success === true) {
					} else {
						this.$message({
							message: '选择成功',
							type: "error"
						})
					}
				});
			}
		},
		mounted() {
			setTimeout(function () {
				var domArr = document.querySelectorAll('.selectmedia>.el-row .allImgbox');
				console.log(domArr);
				for (let i = 0; i < domArr.length; i++) {
					// // console.log(domArr[i].children[0].width);
					console.log(domArr[i].children);
					domArr[i].children[2].innerHTML = '图片尺寸：' + domArr[i].children[0].width + 'X' + domArr[i].children[0].height;
				}
			}, 500)
		}
	}
</script>

<style scoped>
	.iconfont {
		top: 17%;
		right: 26%;
		position: absolute;
		z-index: 2;
		cursor: pointer;
	}

	.mediaImgs {
		max-height: 85%;
		max-width: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%)
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

	.allImgbox {
		text-align: center;
	}

	.imgInfo2 {
		position: absolute;
		/* top: -30px; */
		top: 0;
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

	.el-col {
		height: 150px;
		width: 150px;
		margin: 10px;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
		cursor: pointer;
		border: #eee solid 2px;
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

	.el-tabs__content {
		margin-top: -5px;
		overflow: hidden !important;
	}

	#pane-meitiku {
		/* width: calc(100% - 20px) !important; */
		top: 0;
		position: relative;
		margin: 0 !important;
		overflow: hidden;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		z-index: 150;
	}

	.selectmedia {
		height: 400px;
		overflow: scroll;
		overflow-x: hidden;
		padding: 20px;
		width: 100%;
	}

	.selectmedia::-webkit-scrollbar {
		display: none
	}

	.selectmediaTitle {
		padding: 20px;
	}

	.selectlocal {
		height: auto;
	}

	.isSelect_media {
		box-shadow: 0px 0px 1px 3px blue;
	}

	.selectImgSrc {
		width: 300px;
	}

	.selectTitle {
		margin: 20px;
	}

	.titleInfo {
		font-size: 14px;
		font-weight: 500 !important;
		color: #606266 !important;
	}

	.selectHead {
		height: 50px;
	}

	.selectImgSrc,
	.upload-demo {
		display: inline-block;
		vertical-align: middle;
	}

	.selectbody {
		margin: 20px;
		height: 300px;
		overflow: scroll;
		overflow-x: hidden;
	}

	.selectbody #showImg {
		width: 100%;
	}

	.selectFoot {
		margin: 20px;
		text-align: right;
	}

	.el-tabs__content {
		width: auto !important;
		height: auto !important;
		left: 0 !important;
		top: 0% !important;
		background: #fff !important;
		overflow: hidden;
		padding: 0 !important;
	}

	.el-tabs__nav-scroll {
		height: 40px !important;
	}
</style>