<template>
	<div class="table">
		<div class="crumbs">
			<div class="container">
				<div class="handle-box">
					<div class="addbtn">
						<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
							<i class="el-icon-info addbtn2"></i>
						</el-tooltip>
						<el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
					</div>
				</div>
				<el-table :data="list" border max-height="400" style="width: 100%" ref="multipleTable"
					:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
					<el-table-column type="selection" fixed></el-table-column>
					<el-table-column prop="subject" label="产品模块" :show-overflow-tooltip="true" min-width="140"></el-table-column>
					<el-table-column prop="certification_type" label="证书编号" :show-overflow-tooltip="true" min-width="80">
					</el-table-column>
					<el-table-column prop="order_img" label="订单支付图" min-width="100">
						<template slot-scope="scope">
							<img :src="scope.row.order_img" width="90%" />
						</template>
					</el-table-column>
					<el-table-column prop="must_learn_time" label="学习时长最低值" min-width="110"></el-table-column>
					<el-table-column prop="fee" label="课程学习费用(元)" min-width="q00"></el-table-column>
					<el-table-column prop="baoming_fee" label="考试报名费用(元)" min-width="110"></el-table-column>
					<el-table-column prop="baomingNum" label="已报名人数" min-width="80"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" :formatter="formatTime" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="update_time" label="修改时间" :formatter="formatTime" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" width="220" fixed="right">
						<template slot-scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
							<el-button size="small" type="danger" @click="myshezhi(scope.$index, scope.row)">设置</el-button>
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
				<!--新增弹框 基层-->
				<div class="categories-news" v-if="this.addFormVisible">
					<i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
					<el-tabs type="border-card" v-model="tabsData">
						<!-- <div class="categories-news-main addoreditBox"> -->
						<el-tab-pane label="分享" name="share">
							<div class="categories-news-title">

							</div>
							<div class="categories-news-content">
								<el-form :model="addForm" label-position="left" label-width="120px">
									<!--start-->
									<el-form-item label="分享链接标题:" prop="share_main_title">
										<el-input v-model="addForm.share_main_title"></el-input>
									</el-form-item>
									<el-form-item label="分享链接副标题:" prop="share_sub_title">
										<el-input v-model="addForm.share_sub_title"></el-input>
									</el-form-item>
									<el-form-item label="分享链接图:" prop="share_img">
										<el-input v-model="addForm.share_img"></el-input>
										<el-button @click="selectMedia6" type="primary" class="selectFileBtn">选取文件</el-button>
									</el-form-item>
									<!--end-->
								</el-form>
							</div>
							<div class="categories-news-button">
								<el-button type="primary" @click="confirmAdd()">提交</el-button>
								<el-button @click="addFormVisible = false">关闭</el-button>
							</div>
						</el-tab-pane>
						<el-tab-pane label="内容" name="content">
							<div class="categories-news-title">
							</div>
							<div class="categories-news-content">
								<el-form :model="addForm" label-position="left" label-width="120px">
									<el-form-item label="产品模块:" prop="subject">
										<el-input v-model="addForm.subject"></el-input>
									</el-form-item>
									<el-form-item label="证书编号:" prop="certification_type">
										<el-input v-model.number="addForm.certification_type"></el-input>
									</el-form-item>
									<el-form-item label="封面图:" prop="home_img">
										<el-input v-model="addForm.home_img"></el-input>
										<el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
									</el-form-item>
									<el-form-item label="宣传长海报:" prop="poster_url">
										<el-input v-model="addForm.poster_url"></el-input>
										<el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
									</el-form-item>
									<el-form-item label="订单支付图:" prop="order_img">
										<el-input v-model="addForm.order_img"></el-input>
										<el-button @click="selectMedia3" type="primary" class="selectFileBtn">选取文件</el-button>
									</el-form-item>
									<el-form-item label="申请考试图:" prop="exam_center_img">
										<el-input v-model="addForm.exam_center_img"></el-input>
										<el-button @click="selectMedia4" type="primary" class="selectFileBtn">选取文件</el-button>
									</el-form-item>

									<el-form-item label="分享证书图:" prop="poster_url_h5">
										<el-input v-model="addForm.poster_url_h5"></el-input>
										<el-button @click="selectMedia5" type="primary" class="selectFileBtn">选取文件</el-button>
									</el-form-item>

									<el-form-item label="学习时长最低值:" prop="learn_time">
										<el-input v-model="addForm.must_learn_time"></el-input>
									</el-form-item>
									<el-form-item label="课程学习费用(元):" prop="fee">
										<el-input v-model="addForm.fee"></el-input>
									</el-form-item>
									<el-form-item label="考试报名费用(元):" prop="baoming_fee">
										<el-input v-model="addForm.baoming_fee"></el-input>
									</el-form-item>
								</el-form>
							</div>
							<div class="categories-news-button">
								<el-button type="primary" @click="confirmAdd()">提交</el-button>
								<el-button @click="addFormVisible = false">关闭</el-button>
							</div>
						</el-tab-pane>
						<!-- </div> -->
					</el-tabs>
				</div>
			</div>
			<media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia"
				@overSelectFile="overSelectFile"></media-select>
			<media-select v-if="isSelect2" @close="closeMedia" @overSelectMedia="overSelectMedia2"
				@overSelectFile="overSelectFile2"></media-select>
			<media-select v-if="isSelect3" @close="closeMedia" @overSelectMedia="overSelectMedia3"
				@overSelectFile="overSelectFile3"></media-select>
			<media-select v-if="isSelect4" @close="closeMedia" @overSelectMedia="overSelectMedia4"
				@overSelectFile="overSelectFile4"></media-select>
			<media-select v-if="isSelect5" @close="closeMedia" @overSelectMedia="overSelectMedia5"
				@overSelectFile="overSelectFile5"></media-select>
			<media-select v-if="isSelect6" @close="closeMedia" @overSelectMedia="overSelectMedia6"
				@overSelectFile="overSelectFile6"></media-select>
			<!--进度条弹框-->
			<div class="categories-news" v-if="this.progressVisible">
				<el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
			</div>
			<!--设置按钮点击 二级弹窗 -->
			<el-dialog title="新增" :visible.sync="dialogFormVisible">
				<el-button class="right_but" type="primary" icon="add" @click="handleAddshezhi">新增</el-button>
				<el-table :data="djtData" border style="width: 100%"
					:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
					<el-table-column prop="name" label="课程名称(大讲堂)"></el-table-column>
					<el-table-column prop="lecturer" label="主讲人"></el-table-column>
					<!--<el-table-column prop="buy_times" label="总学时(分钟)"></el-table-column>-->
					<el-table-column prop="ori_price" label="原价"></el-table-column>
					<el-table-column prop="certification_price" label="证书课程价"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" :formatter="formatTime"></el-table-column>
					<el-table-column prop="update_time" label="修改时间" :formatter="formatTime"></el-table-column>
					<el-table-column label="操作" width="80" fixed="right">
						<template slot-scope="scope">
							<el-button size="small" type="danger" @click="myDeletedjt(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="sxyData" border style="width: 100%"
					:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
					<el-table-column prop="name" label="课程名称(商学院)"></el-table-column>
					<el-table-column prop="lecturer" label="主讲人"></el-table-column>
					<el-table-column prop="buy_times" label="总学时(分钟)"></el-table-column>
					<el-table-column prop="ori_price" label="原价"></el-table-column>
					<el-table-column prop="certification_price" label="证书课程价"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" :formatter="formatTime"></el-table-column>
					<el-table-column prop="update_time" label="修改时间" :formatter="formatTime"></el-table-column>
					<el-table-column label="操作" width="80" fixed="right">
						<template slot-scope="scope">
							<el-button size="small" type="danger" @click="myDeletesxy(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="fmData" border style="width: 100%"
					:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
					<el-table-column prop="name" label="课程名称(FM)"></el-table-column>
					<el-table-column prop="lecturer" label="主讲人"></el-table-column>
					<el-table-column prop="buy_times" label="总学时(分钟)"></el-table-column>
					<el-table-column prop="ori_price" label="原价"></el-table-column>
					<el-table-column prop="certification_price" label="证书课程价"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" :formatter="formatTime"></el-table-column>
					<el-table-column prop="update_time" label="修改时间" :formatter="formatTime"></el-table-column>
					<el-table-column label="操作" width="80" fixed="right">
						<template slot-scope="scope">
							<el-button size="small" type="danger" @click="myDeletefm(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
			<!-- 搜索内容弹框三级弹窗 -->
			<div class="categories-news" v-if="this.addFormVisibleshezhi">
				<div class="categories-news-main">
					<div class="categories-news-content">
						<el-form :model="addForm1" label-position="left" label-width="120px">
							<el-form-item label="课程名称:">
								<el-input v-model="keyword" placeholder="课程名称"></el-input>
								<el-button type="certificationtype" icon="el-icon-search" @click="searchAllv2">搜索</el-button>
							</el-form-item>
							<el-form-item label="证书课程价格:" prop="certificationprice">
								<el-input v-model="addForm1.certificationprice" placeholder="输入金额(元)"></el-input>
							</el-form-item>
						</el-form>
					</div>
					<div class="categories-news-content">
						<el-button size="small" type="add" @click="contentbutton">提交</el-button>
						<el-button size="small" type="add" @click="addFormVisibleshezhi = false">取消</el-button>
					</div>
				</div>
			</div>
			<!-- 搜索内容弹框四级弹窗 -->
			<div class="categories-news" v-if="this.addFormSearch">
				<div class="categories-news-main">
					<div class="categories-news-content">
						<el-table :data="searchlistdjt" border style="width: 100%"
							:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
							<el-table-column prop="lecturer" label="主讲人(大讲堂)" width="180"></el-table-column>
							<el-table-column prop="name" label="课程/书/活动名"></el-table-column>
							<el-table-column prop="ori_price" label="原价"></el-table-column>
							<el-table-column label="操作" width="180" fixed="right">
								<template slot-scope="scope">
									<el-button size="small" type="danger" @click="butoomxuandingdjt(scope.$index, scope.row)">选定
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-table :data="searchlistsxy" border style="width: 100%"
							:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
							<el-table-column prop="lecturer" label="主讲人(商学院)" width="180"></el-table-column>
							<el-table-column prop="name" label="课程/书/活动名"></el-table-column>
							<el-table-column prop="ori_price" label="原价"></el-table-column>
							<el-table-column label="操作" width="180" fixed="right">
								<template slot-scope="scope">
									<el-button size="small" type="danger" @click="butoomxuandingsxy(scope.$index, scope.row)">选定
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-table :data="searchlistFM" border style="width: 100%"
							:header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
							<el-table-column prop="lecturer" label="主讲人(FM)" width="180"></el-table-column>
							<el-table-column prop="name" label="课程/书/活动名"></el-table-column>
							<el-table-column prop="ori_price" label="原价"></el-table-column>
							<el-table-column label="操作" width="180" fixed="right">
								<template slot-scope="scope">
									<el-button size="small" type="danger" @click="butoomxuandingfm(scope.$index, scope.row)">选定
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="categories-news-content">
						<el-button size="small" type="danger" @click="addFormSearch = false">取消</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import "quill/dist/quill.core.css";
	import "quill/dist/quill.snow.css";
	import "quill/dist/quill.bubble.css";
	import { quillEditor } from "vue-quill-editor";
	import {
		getPicURL,
		certificationSubject,
		postcertificationSubject,
		putcertificationSubject,
		getCourseListByCerType,
		searchAllv2,
		deleteCourseListByCerType,
		setCertificationCourse,
		deleteCertificationCourse
	} from "../../../../api/api";
	import {
		formatDate,
		handleCommonAvatarSuccess,
		handleCommonAudioSuccess
	} from "../../../Utility/Utility";
	import { get } from "../../../../api";
	const toolbarOptions = [
		["bold", "italic", "underline", "strike"], // toggled buttons
		["blockquote", "code-block"],

		[{
			header: 1
		}, {
			header: 2
		}], // custom button values
		[{
			list: "ordered"
		}, {
			list: "bullet"
		}],
		[{
			script: "sub"
		}, {
			script: "super"
		}], // superscript/subscript
		[{
			indent: "-1"
		}, {
			indent: "+1"
		}], // outdent/indent
		[{
			direction: "rtl"
		}], // text direction

		[{
			size: ["small", false, "large", "huge"]
		}], // custom dropdown
		[{
			header: [1, 2, 3, 4, 5, 6, false]
		}],

		[{
			color: []
		}, {
			background: []
		}], // dropdown with defaults from theme
		[{
			font: []
		}],
		[{
			align: []
		}],
		["link", "image", "video"],
		["clean"] // remove formatting button
	];
	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if (/^\s*$/.test(value)) {
					callback(new Error("请输入正确的内容,不可以是空格"));
				} else {
					callback();
				}
			};
			return {
				isSelect: false,
				isSelect2: false,
				isSelect3: false,
				isSelect4: false,
				isSelect5: false,
				isSelect6: false,
				select_cate: "",
				tabsData: 'share',
				cur_page: 1,
				list: [],
				total: 0,
				size: 10,
				contentShow: false,
				editShow: false,
				text: "",
				pushtype: "1",
				fraction: [], //分数
				keyword: "",
				datas: [],
				duoxuandata: [],
				panduandata: [],
				jiandadata: [],
				zonghedata: [],
				djtData: [],
				sxyData: [],
				fmData: [],
				searchlistdjt: [],
				searchlistsxy: [],
				searchlistFM: [],
				addFormSearch: false,
				dialogFormVisible: false,
				addFormVisibleshezhi: false, //三级弹窗
				//选择题==新增界面是否显示
				addFormVisible: false,
				//判断题==新增界面是否显示
				addFormVisible_pd: false,
				//简答题==新增界面是否显示
				addFormVisible_jd: false,
				//综合题==新增界面是否显示
				addFormVisible_zh: false,
				//进度条是否显示
				progressVisible: false,
				progressPercent: 0,
				//新增界面数据
				addForm: {
					subject: "", //
					fee: "",
					home_img: "", //
					order_img: "", //
					exam_center_img: "",
					poster_url: "", //
					certification_type: 1, //
					status: 1, //
					baoming_fee: "" //
				},
				addForm1: {
					certificationtype: "", //证书类型 1 管理师初级 2 管理师中级 3 理财师初级 4 理财师中级
					parentid: "", //大分类 1 大讲堂 2 商学院 3 FM
					courseid: "", //套课id
					certificationprice: "" //证书课程价格
				},

				editorOption: {
					placeholder: "",
					theme: "snow", // or 'bubble'
					modules: {
						toolbar: {
							container: toolbarOptions, // 工具栏
							handlers: {
								image: function (value) {
									if (value) {
										document.querySelector(".avatar-uploader input").click();
									} else {
										this.quillEditor.format("image", false);
									}
								}
							}
						}
					}
				},
				isEditForm: false, //是否是编辑页面

			};
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
			closeMedia() {
				this.isSelect = false
				this.isSelect2 = false
				this.isSelect3 = false
				this.isSelect4 = false
				this.isSelect5 = false
				this.isSelect6 = false
			},
			selectMedia() {
				this.isSelect = true;
			},
			selectMedia2() {
				this.isSelect2 = true;
			},
			selectMedia3() {
				this.isSelect3 = true;
			},
			selectMedia4() {
				this.isSelect4 = true;
			},
			selectMedia5() {
				this.isSelect5 = true;
			},
			selectMedia6() {
				this.isSelect6 = true;
			},
			overSelectMedia(str) {
				this.addForm.home_img = str
			},
			overSelectFile(str) {
				this.addForm.home_img = str
			},
			overSelectMedia2(str) {
				this.addForm.poster_url = str
			},
			overSelectFile2(str) {
				this.addForm.poster_url = str
			},
			overSelectMedia3(str) {
				this.addForm.order_img = str
			},
			overSelectFile3(str) {
				this.addForm.order_img = str
			},
			overSelectMedia4(str) {
				this.addForm.exam_center_img = str
			},
			overSelectFile4(str) {
				this.addForm.exam_center_img = str
			},
			overSelectMedia5(str) {
				this.addForm.poster_url_h5 = str
			},
			overSelectFile5(str) {
				this.addForm.poster_url_h5 = str
			},
			overSelectMedia6(str) {
				this.addForm.share_img = str
			},
			overSelectFile6(str) {
				this.addForm.share_img = str
			},
			//删除
			myDelete(index, row) {
				//再次获取数据，以消除分页后单页数据数量减少
				// 新增删除提示
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					cancelButtonClass: "btn-custom-cancel",
					type: "warning"
				})
					.then(() => {
						console.log(row + "index:" + index);
						deleteCourseListByCerType(row.id).then(res => {
							if (res.success === true) {
								this.select_cate = "";
								this.getData();
							}
						});

						this.$message({
							type: "success",
							message: "删除成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			//点击设置按钮
			myshezhi(index, row) {
				this.addForm1.certificationtype = row.certification_type; //给addForm1的certificationtype提前赋值
				getCourseListByCerType(row.certification_type).then(res => {
					console.log(res);
					if (!res.data.djtlist ||
						res.data.djtlist === [] ||
						res.data.djtlist.length === 0
					) {
						if (this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData();
						} else {
							this.djtData = [];
						}
					} else {
						this.djtData = res.data.djtlist;
						this.sxyData = res.data.sxylist;
						this.fmData = res.data.fmlist;
					}
				});
				this.dialogFormVisible = true;
			},
			//设置页大讲堂删除
			myDeletedjt(index, row) {
				//再次获取数据，以消除分页后单页数据数量减少
				// 新增删除提示
				this.addForm1.certificationprice = row.certification_price;
				(this.addForm1.parentid = 1), (this.addForm1.courseid = row.id);
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					cancelButtonClass: "btn-custom-cancel",
					type: "warning"
				})
					.then(() => {
						deleteCertificationCourse(this.addForm1).then(res => {
							if (res.success == true) {
								getCourseListByCerType(this.addForm1.certificationtype).then(
									res => {
										console.log(res);
										if (!res.data.djtlist ||
											res.data.djtlist === [] ||
											res.data.djtlist.length === 0
										) {
											if (this.cur_page - 1 > 0) {
												this.cur_page -= 1;
												this.getData();
											} else {
												this.djtData = [];
											}
										} else {
											this.djtData = res.data.djtlist;
											this.sxyData = res.data.sxylist;
											this.fmData = res.data.fmlist;
										}
									}
								);
							}
						});

						this.$message({
							type: "success",
							message: "删除成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			//设置页商学院删除
			myDeletesxy(index, row) {
				//再次获取数据，以消除分页后单页数据数量减少
				// 新增删除提示
				this.addForm1.certificationprice = row.certification_price;
				(this.addForm1.parentid = 2), (this.addForm1.courseid = row.id);
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					cancelButtonClass: "btn-custom-cancel",
					type: "warning"
				})
					.then(() => {
						console.log(this.addForm1);
						deleteCertificationCourse(this.addForm1).then(res => {
							if (res.success == true) {
								getCourseListByCerType(this.addForm1.certificationtype).then(
									res => {
										console.log(res);
										if (!res.data.djtlist ||
											res.data.djtlist === [] ||
											res.data.djtlist.length === 0
										) {
											if (this.cur_page - 1 > 0) {
												this.cur_page -= 1;
												this.getData();
											} else {
												this.djtData = [];
											}
										} else {
											this.djtData = res.data.djtlist;
											this.sxyData = res.data.sxylist;
											this.fmData = res.data.fmlist;
										}
									}
								);
							}
						});

						this.$message({
							type: "success",
							message: "删除成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			//设置页FM院删除
			myDeletefm(index, row) {
				//再次获取数据，以消除分页后单页数据数量减少
				// 新增删除提示
				this.addForm1.certificationprice = row.certification_price;
				(this.addForm1.parentid = 3), (this.addForm1.courseid = row.id);
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					cancelButtonClass: "btn-custom-cancel",
					type: "warning"
				})
					.then(() => {
						console.log(this.addForm1);
						deleteCertificationCourse(this.addForm1).then(res => {
							if (res.success == true) {
								getCourseListByCerType(this.addForm1.certificationtype).then(
									res => {
										console.log(res);
										if (!res.data.djtlist ||
											res.data.djtlist === [] ||
											res.data.djtlist.length === 0
										) {
											if (this.cur_page - 1 > 0) {
												this.cur_page -= 1;
												this.getData();
											} else {
												this.djtData = [];
											}
										} else {
											this.djtData = res.data.djtlist;
											this.sxyData = res.data.sxylist;
											this.fmData = res.data.fmlist;
										}
									}
								);
							}
						});

						this.$message({
							type: "success",
							message: "删除成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await certificationSubject(this.cur_page, this.size).then(res => {
					if (!res.data.data ||
						res.data.data === [] ||
						res.data.data.length === 0
					) {
						if (this.cur_page - 1 > 0) {
							this.cur_page -= 1;
							this.getData();
						} else {
							this.list = [];
						}
					} else {
						this.list = res.data.data;
						//						console.log(this.list)
						this.total = this.list.length;
						if (res.data.count) {
							this.total = res.data.count
						}
					}
				});
				this.del_list = JSON.parse(JSON.stringify(this.list));
			},
			// 新增
			handleAdd() {
				this.select_cate = "";
				this.isEditForm = false;
				this.addForm = {
					subject: "", //
					fee: "",
					home_img: "", //
					order_img: "", //
					poster_url: "", //
					certification_type: 1, //
					status: 1, //
					baoming_fee: "", //
					share_img: '',
					share_main_title: '',
					share_sub_title: ''
				};
				this.addFormVisible = true;
			},
			// 设置新增
			handleAddshezhi() {
				this.select_cate = "";
				this.isEditForm = false;
				this.addForm = {
					subject: "", //
					fee: "",
					home_img: "", //
					order_img: "", //
					poster_url: "", //
					certification_type: 1, //
					status: 1, //
					baoming_fee: "" //
				};
				this.addFormVisibleshezhi = true; //打开三级弹窗
				this.dialogFormVisible = false; //关闭二级弹窗
			},
			//点击批改时
			handleEdit(index, row) {
				this.isEditForm = true;
				this.addForm = {
					id: row.id,
					subject: row.subject, //
					fee: row.fee,
					home_img: row.home_img, //
					order_img: row.order_img, //
					must_learn_time: row.must_learn_time,
					poster_url: row.poster_url, //
					certification_type: row.certification_type, //
					exam_center_img: row.exam_center_img,
					status: 1, //
					baoming_fee: row.baoming_fee, //
					poster_url_h5: row.poster_url_h5,
					share_main_title: row.share_main_title,
					share_sub_title: row.share_sub_title,
					share_img: row.share_img
				};
				this.addFormVisible = true;
			},
			//批改弹窗 确认按钮 点击
			confirmAdd() {
				if (this.isEditForm) {
					this.myPuhhrChange();
				} else {
					this.myhhrAdd();
				}
			},
			myhhrAdd() {
				postcertificationSubject(this.addForm).then(res => {
					if (res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: "error"
						});
					}
				});
			},
			//修改
			myPuhhrChange() {
				putcertificationSubject(this.addForm, this.addForm.id).then(res => {
					// console.log("id"+this.addForm.id)
					if (res.success === true) {
						this.addFormVisible = false;
						this.getData();
					} else {
						this.$message({
							message: res.data,
							type: "error"
						});
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
			//设置里新增的搜索
			searchAllv2() {
				searchAllv2(this.keyword).then(res => {
					console.log(res);
					if (res.data == null) {
						this.searchlist = null;
					} else {
						this.searchlistdjt = res.data.djtcourse;
						this.searchlistsxy = res.data.sxycourse;
						this.searchlistFM = res.data.fmcourse;
					}
				});
				this.addFormSearch = true; //点击搜索打开搜索内容弹窗===四级
				this.dialogFormVisible = false; //关闭设置弹窗===三级
			},
			//搜索结果 点击选定大讲堂时
			butoomxuandingdjt(index, row) {
				console.log(this.addForm1);
				this.addForm1.courseid = row.id;
				this.addForm1.parentid = 1; //大分类大讲堂序号1
				this.addFormSearch = false; //选定后关闭窗口
			},
			//搜索结果 点击选定商学院时
			butoomxuandingsxy(index, row) {
				console.log(this.addForm1);
				this.addForm1.courseid = row.id;
				this.addForm1.parentid = 2; //大分类商学院序号2
				this.addFormSearch = false; //选定后关闭窗口
			},
			//搜索结果 点击选定FM时
			butoomxuandingfm(index, row) {
				console.log(this.addForm1);
				this.addForm1.courseid = row.id;
				this.addForm1.parentid = 3; //大分类FM序号3
				this.addFormSearch = false; //选定后关闭窗口
			},
			//选定后点击确定提交数据进行添加
			contentbutton() {
				setCertificationCourse(this.addForm1).then(res => {
					if (res.success == true) {
						this.dialogFormVisible = true;
						this.addFormVisibleshezhi = false;
						// 重新加载页面
						getCourseListByCerType(this.addForm1.certificationtype).then(res => {
							console.log(res);
							if (!res.data.djtlist ||
								res.data.djtlist === [] ||
								res.data.djtlist.length === 0
							) {
								if (this.cur_page - 1 > 0) {
									this.cur_page -= 1;
									this.getData();
								} else {
									this.djtData = [];
								}
							} else {
								this.djtData = res.data.djtlist;
								this.sxyData = res.data.sxylist;
								this.fmData = res.data.fmlist;
							}
						});
					}
				});
			},
			//下拉框/时间值处理
			//批改状态
			formatStatus: function (row, column, cellValue) {
				if (cellValue === 0) {
					return "未批改";
				} else {
					return "已批改";
				}
			},
			//属性状态判断
			formatType: function (row, column, cellValue) {
				if (cellValue === 1) {
					return "单选";
				} else {
					return "多选";
				}
			},
			//推荐判断
			formatRecommend: function (row, column, cellValue) {
				if (cellValue === 1) {
					return "金融管理师";
				} else {
					return "金融理财师";
				}
			},
			//home判断
			formatHome: function (row, column, cellValue) {
				if (cellValue === 0) {
					return "否";
				} else {
					return "是";
				}
			},
			//时间
			formatTime: function (row, column, cellValue) {
				return formatDate(cellValue);
			},
			//详情
			isContentShow(index, row) {
				this.contentShow = true;
				console.log("hang", row);
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
				this.$message.success("内容修改成功！");
				this.text = "";
			}
		},
		components: {
			quillEditor
		}
	};
</script>

<style scoped>
	.handle-box {
		height: 32px;
	}

	.handle-box .addbtn {
		float: right;
	}

	input {
		margin: 2px;
	}

	.title_zs,
	.fubiaoti,
	.danxuanti {
		font-size: 18px;
	}

	.tigan {
		font-weight: bold;
		font-size: 16px;
	}

	.shnehename span {
		font-size: 18px;
	}

	#list_ol {
		margin-left: 20px;
	}

	.lirou p {
		font-size: 14px;
	}

	.title_jj {
		margin: 10px 0;
	}

	.right_but {
		margin: 0 0 3% 93%;
		/* right: 0; */
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

	.iconfont {
		top: 17%;
		right: 26%;
		position: absolute;
		z-index: 2;
		cursor: pointer;
	}
</style>