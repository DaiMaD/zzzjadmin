<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
              <el-button type="primary"  icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
              <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID"  class="handle-select mr10" clearable>
               </el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="add" @click="handleAdd" class="addbtn">新增</el-button>
            </div>
          <el-table :data="list" border max-height="660" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" stripe :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="username" label="用户名" min-width="100"></el-table-column>
                <el-table-column prop="mobile" label="手机号" min-width="100"></el-table-column>
                <el-table-column prop="coursename" label="收藏课名" min-width="100"></el-table-column>
                <el-table-column prop="create_time_v2" label="创建时间" min-width="200" :formatter="formatTime"></el-table-column>
                <el-table-column prop="update_time_v2" label="修改时间" min-width="200" :formatter="formatTime"></el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- -------分页------------- -->
            <div class="pagination">
                <el-pagination
                    	background
	        			@size-change="handleSizeChange"
		      		@current-change="handleCurrentChange"
		      		:page-sizes="[10, 20, 30, 40]"
		      		:page-size="10"
		      		layout="total, sizes, prev, pager, next, jumper"
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
                        <el-form  :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="100px">

                            <el-form-item label="类型:" prop="type">
                                <el-select v-model="addForm.type">
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="收藏内容的id:" prop="course_id">
                                <el-input  v-model="addForm.course_id"></el-input>
                            </el-form-item>

                            <el-form-item label="收藏用户的id:" prop="user_id">
                                <el-input  v-model="addForm.user_id"></el-input>
                            </el-form-item>

                            <el-form-item label="状态:" prop="status">
                                <el-select v-model="addForm.status">
                                    <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
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
    import {getCollection,getCollectionOne,deleteCollectionOne,postCollection,putCollection,postCollectionList} from '../../../../api/api';
    import {formatDate} from '../../../Utility/Utility';
    export default {
        data() {
            var validateName = (rule, value, callback) => {
                if (/^\s*$/.test(value)) {
                    callback(new Error('请输入正确的姓名,不可以是空格'));
                }else {
                    callback();
                }
            };
            return {
                select_cate: '',
                cur_page:1,
                list:[],
                total:0,
                size:10,
                //名称不能为空
                addFormRules: {
                    name: [
                        { required: true, message: '名称字段不能为空' },
                        { validator: validateName, trigger: 'blur' }
                    ]
                },

                //新增界面是否显示
                addFormVisible: false,
                //新增界面数据
                addForm: {
                    type:1,
                    course_id:'',
                    user_id:'',
                    status:1,
                },
                isEditForm: false,//是否是编辑页面

                //类型
                typeOptions: [{
                    value: 1,
                    label: '课程'
                }, {
                    value: 2,
                    label: '活动'
                }],

                //状态
                statusOptions: [{
                    value: 0,
                    label: '取消收藏'
                }, {
                    value: 1,
                    label: '收藏'
                }],
            }
        },
        created(){
            this.getData();
        },
        computed: {
        },
        methods: {
            indexMethod(index){
                return index+1
            },


            //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
            async getData(){
                await getCollection(this.cur_page,this.size).then(res=>{
                		console.log(res.data)
                    if (!res.data.data || res.data.data === [] || res.data.data.length === 0){
                        if (this.cur_page - 1 > 0) {
                            this.cur_page -= 1;
                            this.getData()
                        }else {
                            this.list = [];
                        }
                    }  else {
                        this.list = res.data.data;
                        if (res.data.count) {
                            this.total=res.data.count
                        }
                    }

                });
                this.del_list=JSON.parse(JSON.stringify(this.list))
            },

            //分页导航
            handleCurrentChange(val){
            this.cur_page = val;
            this.getData();
          },
			handleSizeChange(val){
		  		this.size = val
		  		this.getData();
		  		document.getElementById("table").setAttribute("style","height: 1100px !important");
		  },

          //搜索
          search(){
            if(this.select_cate!==''){
              getCollectionOne(parseInt(this.select_cate)).then(res => {
                if (res.data == null){
                  this.list = null
                } else {
                  this.list=JSON.parse(JSON.stringify(this.del_list));
                  this.list.splice(0,this.list.length,res.data)
                }
              });
            }else{
              this.list=JSON.parse(JSON.stringify(this.del_list))
            }

          },

            //删除
            myDelete(index,row){
                deleteCollectionOne(row.id).then((res) =>{
                    if (res.success === true){
                      this.select_cate='';
                        this.getData();
                    }
                });

            },



            //批量删除
            batchDelete(){
            let str = '';
            this.multipleSelection.forEach((selection,index) => {
              str += `${selection.id},`
            });
            if (str.endsWith(',')){
              str = str.slice(0, -1);
            }

            postCollectionList(str).then((res)=>{
              if(res.success===true){
                this.getData();
              }
            });
          },


           //点击选中被删除项
           handleSelectionChange(val){
            this.multipleSelection=val;
          },



            //新增弹框按钮点击显示
            handleAdd(){
                this.select_cate='';
                this.isEditForm = false;
                this.addForm = {
                    type:1,
                    course_id:'',
                    user_id:'',
                    status:1,
                };

                this.addFormVisible=true;
            },


          //新增
          myPostCollectionAdd(){
            postCollection(this.addForm).then((res) => {
              if (res.success === true){
                this.addFormVisible=false;
                this.getData();
              }else {
                this.$message({
                  message:res.data,
                  type : "error"
                })
              }
            });
          },


          //新增弹框 确认按钮 点击
          confirmAdd(){
            this.$refs['addForm'].validate((valid) => {
              if (valid){
                if (this.isEditForm){
                  console.log(1);
                  this.myPutCollectionChange();
                }else {
                  this.myPostCollectionAdd();
                }
              }
            })

          },


          //编辑按钮点击
          handleEdit(index,row){
                this.isEditForm = true;
                this.addForm = {
                    id: row.id,
                    type:1,
                    course_id:row.course_id,
                    user_id:row.user_id,
                    status:1,
                };
                this.addFormVisible=true;
            },




            //修改
            myPutCollectionChange(){
                putCollection(this.addForm,this.addForm.id).then((res)=>{
                    if (res.success===true){
                        this.addFormVisible=false;
                        this.getData();
                    }else {
                        this.$message({message: res.data,
                            type: 'error'
                        });
                    }
                });
            },




            //下拉框/时间值处理
            //类型
            formatType:function (row, column, cellValue) {
                if (cellValue === 1){
                    return '课程';
                }else {
                    return '活动';
                }
            },
            //状态
            formatStatus:function (row, column, cellValue) {
                if (cellValue === 0){
                    return '取消收藏';
                }else {
                    return '收藏';
                }
            },
            //时间
            formatTime:function(row, column, cellValue){
            		if(cellValue == "" || cellValue == null){
            			return ''
            		}else{
            			return formatDate(cellValue)
            		}
            },
        }
    }
</script>

<style scoped>
	.handle-box{
		height: 32px;
	}
	.handle-box .addbtn {
		float: right;
	}
</style>
