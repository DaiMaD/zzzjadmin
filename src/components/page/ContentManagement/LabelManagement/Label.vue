<template>
	<div class="table">
		<div class="container">
			<div class="tagsWrap">
				<div class="tagsBox">
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
						@keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
				</div>

				<div class="tagsBox" v-for="tag in list">
					<el-tag :key="tag.lable_name" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag.lable_name}}
					</el-tag>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { GetLables, GetLablesadd, GetLablesdelete, GetLablesput } from '../../../../api/api';
	export default {
		data() {
			return {
				inputVisible: false,
				inputValue: '',
				list: [],
				//新增界面数据
				addForm: {
					lable_name: '',
				},
			}
		},
		created() {
			this.getData()
		},
		computed: {},

		methods: {
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				let inputValue = this.inputValue;
				console.log(inputValue);

				if (inputValue) {
					this.addForm = {
						lable_name: inputValue
					}
					GetLablesadd(this.addForm).then((res) => {
						console.log(this.addForm.lable_name)
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
				} else {
					this.$message({
						message: '请填写标签名称',
						type: "error"
					})
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			handleClose(tag) {
				// 新增删除提示
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: "btn-custom-cancel",
					type: 'warning'
				}).then(() => {

					GetLablesdelete(tag.id).then(res => {
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
			//获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
			async getData() {
				await GetLables().then(res => {
					console.log(res);
					if (!res.data || res.data === [] || res.data.length === 0) {
						if (this.cur_page - 1 > 0) {
							this.cur_page -= 1
							this.getData()
						} else {
							this.list = []
						}
					} else {
						this.list = res.data;
						if (res.data.count) {
							this.total = res.data.count
						} else {
							this.total = res.data.length
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.tagsWrap {
		display: flex;
		justify-content: left;
		flex-flow: wrap;
	}

	.tagsBox {
		width: 100px;
		height: 40px;
	}

	.button-new-tag {
		height: 32px;
		line-height: 30px;
		padding: 0 3px;
		width: 70px;
	}

	.input-new-tag {
		width: 70px;
		vertical-align: bottom;
	}
</style>