<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
              <el-button type="primary"  icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
              <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID"  class="handle-select mr10" clearable>
               </el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="add" @click="handleAdd">新增</el-button>
            </div>
          <el-table :data="list" border max-height="400" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" stripe :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                type="index"
                :index="indexMethod" width="80">
                </el-table-column>
                <el-table-column prop="id" label="后台管理员" min-width="50"></el-table-column>
                <el-table-column prop="name" label="用户名" min-width="100"></el-table-column>
                <el-table-column prop="password" label="密码" min-width="100"></el-table-column>
                <el-table-column prop="status" label="状态" min-width="100" :formatter="formatStatus"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" min-width="200" :formatter="formatTime"></el-table-column>
                <el-table-column prop="update_time" label="修改时间" min-width="200" :formatter="formatTime"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small"
                                   @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger"
                                   @click="myDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                		background
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
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

                            <el-form-item label="用户名:" prop="name">
                                <el-input  v-model="addForm.name"></el-input>
                            </el-form-item>

                            <el-form-item label="密码:" prop="password">
                                <el-input  v-model.string="addForm.password"></el-input>
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
    import {getAdministrator,getAdministratorOne,deleteAdministratorOne,postAdministrator,putAdministrator,postAdministratorList} from '../../../../api/api'
    import {formatDate} from '../../../Utility/Utility'

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
                select_cate:'',  //查询id
                list:[],         //数据
                del_list:[],     //查询时缓存的全部数据
                cur_page:1,      //当前页
                total:0,
                size:10,

                //新增界面是否显示
                addFormVisible: false,
                //名称不能为空
                addFormRules: {
                    name: [
                        { required: true, message: '名称字段不能为空' },
                        { validator: validateName, trigger: 'blur' }
                    ],
                  password:[
                    { required: true, message: '密码不能为空' },
                    { validator: validateName, trigger: 'blur' }
                  ],
                },
                //新增界面数据
                addForm: {
                    name:'',
                    password:'',
                    status:0,
                },


              //  时间选择器

              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                }
              },

               isEditForm: false,//是否是编辑页面

                statusOptions: [{
                    value: 0,
                    label: '不可用'
                }, {
                    value: 1,
                    label: '可用'
                }],

                RoleIdOptions: [{
                    value: 0,
                    label: '管理员'
                }, {
                    value: 1,
                    label: '操作员1'
                }, {
                    value: 2,
                    label: '操作员2'
                },{
                    value: 3,
                    label: '操作员3'
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


           formatStatus:function (row, column, cellValue) {
                if (cellValue === 0){
                    return '不可用';
                }else {
                    return '可用';
                }
            },


            //时间
            formatTime:function(row, column, cellValue){
                return formatDate(cellValue)
            },


          //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
          async getData(){

            await getAdministrator(this.cur_page,this.size).then(res=>{


              if (!res.data.data || res.data.data == [] || res.data.data.length == 0){
                if (this.cur_page - 1 > 0) {
                  this.cur_page -= 1;
                  this.getData()
                }else {
                  this.list = [];
                }
              }  else {
                this.list = res.data.data;
                if (res.data.totalPages) {
                  this.total=res.data.totalPages*10
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


          //搜索

          search(){
            if (this.select_cate!==''){
              getAdministratorOne(parseInt(this.select_cate)).then(res =>{
                if (res.data==null){
                  this.list=null
                }else {
                  this.list=JSON.parse(JSON.stringify(this.del_list));
                  this.list.splice(0,this.list.length,res.data)
                }
              });
            }else {
              this.list=JSON.parse(JSON.stringify(this.del_list))
            }
          },


//删除
          myDelete(index,row){
            // 新增删除提示
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      cancelButtonClass: "btn-custom-cancel",
                      type: 'warning'
                    }).then(() => {

 deleteAdministratorOne(row.id).then((res) =>{
              if (res.success === true){
                this.select_cate='';
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
          batchDelete(){
            let str = '';
            this.multipleSelection.forEach((selection,index) => {
              str += `${selection.id},`
            });
            if (str.endsWith(',')){
              str = str.slice(0, -1);
            }

            postAdministratorList(str).then((res)=>{
              if(res.success===true){
                this.getData();
              }
            });
          },

          //点击选中被删除项
          handleSelectionChange(val){
            this.multipleSelection=val;
          },




            //新增弹框显示
            handleAdd(){
                this.select_cate='';
                this.isEditForm = false;
                this.addForm = {
                    name:'',
                    password:'',
                    status:0,

                };

                this.addFormVisible=true;
            },


            //新增弹框 确认按钮 点击
            confirmAdd(){
                this.$refs['addForm'].validate((valid) => {
                    console.log(valid);
                    if (valid){
                        if (this.isEditForm){
                            this.myPutAdministratorChange();
                        }else {
                            this.myPostAdministratorAdd();
                        }
                    }
                })

            },

            //新增
            myPostAdministratorAdd(){

            postAdministrator(this.addForm).then((res) => {
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


            //编辑按钮点击
            handleEdit(index,row){
                console.log(row.status);
                this.isEditForm = true;
                this.addForm = {
                    id:row.id,
                    name:row.name,
                    password:row.password,
                    status:row.status,
                };
                this.addFormVisible=true;
            },


            //修改
            myPutAdministratorChange(){
                putAdministrator(this.addForm,this.addForm.id).then((res)=>{
                    if (res.success===true){
                        this.addFormVisible=false;
                        this.getData();
                    }else {
                        this.$message({message: res.data,
                            type: 'error'
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
