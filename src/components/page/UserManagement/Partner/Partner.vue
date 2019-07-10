<template>
    <div class="table">
        <!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>合伙人管理</el-breadcrumb-item>
                <el-breadcrumb-item>合伙人列表</el-breadcrumb-item>
            </el-breadcrumb>                                                                                
        </div>-->
        <div class="container">
            <div class="handle-box">

              <el-button type="primary"  icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
       
              <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID"  class="handle-select mr10" clearable>
                </el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>

                <el-button type="primary" icon="add" @click="handleAdd">新增</el-button>
            </div>

            <el-table :data="list" border max-height="400" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">

             <el-table-column type="selection" width="55"></el-table-column>


              <el-table-column
                type="index"
                :index="indexMethod" width="80" fixed>
              </el-table-column>


                <el-table-column prop="id" label="ID" width="50" fixed></el-table-column>

                <!-- <el-table-column prop="user_type" label="用户类别" width="100" :formatter="formatPartner"></el-table-column> -->

                <el-table-column prop="name" label="用户名" width="100"></el-table-column>
                
                <el-table-column prop="mobile" label="用户手机号" width="300"></el-table-column>
 
                <el-table-column prop="email" label="用户email" width="200"></el-table-column>

                <!-- <el-table-column prop="avatar" label="头像链接" width="200"></el-table-column> -->

                <el-table-column prop="nick_name" label="昵称" width="100"></el-table-column>

                <!-- <el-table-column prop="bonus_points" label="用户积分" width="100"></el-table-column> -->
                <el-table-column prop="zz_coin" label="真知币" width="100"></el-table-column>
                
                <el-table-column prop="gold_coin" label="金币" width="100"></el-table-column>
                
                <el-table-column prop="formatPartner" label="下线人数" width="100"></el-table-column>

                <el-table-column prop="vip_level" label="用户等级" width="100" :formatter="formatVipLevel"></el-table-column>

                <el-table-column prop="status" label="用户状态" width="100" :formatter="formatStatus"></el-table-column>

                <el-table-column prop="from_company" label="用户来源公司" width="100"></el-table-column>

                <el-table-column prop="my_invite_code" label="邀请码" width="100"></el-table-column>

                <el-table-column prop="parent_invite_code" label="上级邀请码" width="100"></el-table-column>
                
                <el-table-column prop="bind_time" label="绑定上级时间" width="200" :formatter="formatTime"></el-table-column>
                
                <el-table-column prop="my_learning_card" label="我的学习卡编号" width="100"></el-table-column>

                <el-table-column prop="create_time" label="创建时间" width="200" :formatter="formatTime"></el-table-column>

                <el-table-column prop="update_time" label="更新时间" width="200" :formatter="formatTime"></el-table-column>


                <el-table-column label="操作" width="180" fixed="right">
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
                            <el-form-item label="合伙人名:" prop="name">
                                <el-input  v-model="addForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="合伙人手机号:" prop="mobile">
                                <el-input  v-model.string="addForm.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="合伙人Email:" prop="email">
                                <el-input  v-model="addForm.email"></el-input>
                            </el-form-item>
                             <el-form-item label="合伙人备注:" prop="city">
                                <el-input  v-model="addForm.city"></el-input>
                            </el-form-item>
                            <el-form-item label="合伙人地址:" prop="address">
                                <el-input  v-model="addForm.address"></el-input>
                            </el-form-item>
                            <el-form-item label="合伙人性别:" prop="sex">
                                <el-select v-model="addForm.sex">
                                    <el-option
                                        v-for="item in sexOptions"
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

          <!--进度条弹框-->
          <div class="categories-news" v-if="this.progressVisible">

            <el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>

            <!--<el-button type="primary" class="cancel-upload" @click="open2">取消上传</el-button>-->
          </div>

        </div>
    </div>
</template>

<script>
    import {GetpartnerFindAll,GetPartnerFind,deletepartner,PostPartner,getPartner,partnerdelete,getPicURL} from '../../../../api/api';
    import {formatDate,handleCommonAvatarSuccess} from '../../../Utility/Utility'
    export default {
        data() {
            var validateName = (rule, value, callback) => {
                if (/^\s*$/.test(value)) {
                    callback(new Error('请输入正确的姓名,不可以是空格'));
                }else {
                    callback();
                }
            };
            var validateMobile = (rule, value, callback) => {
                if (/^1\d{10}$/.test(value)) {
                    callback();
                }else {
                    callback(new Error('请输入正确的手机号'));
                }
            };

          var validateEmail=(rule,value,callback) => {
            if( /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(value)){
              callback();
            }else {
              callback(new Error('请输入正确的邮箱'));
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



              //进度条是否显示
              progressVisible: false,
              progressPercent: 0,

    
              //名称不能为空,手机号验证
                addFormRules: {
                    name: [
                        { required: true, message: '名称字段不能为空' },
                        { validator: validateName, trigger: 'blur' }
                    ],
                    mobile: [
                        {required: true, message: '手机号不能为空'},
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                //    email:[
                //         {required:true, message:'邮箱不能为空'},
                //         {validator: validateEmail, trigger: 'blur'}
                //   ],
                },
                //新增界面数据
                addForm: {
                  mobile:'',
                  name:'',
                  email:'',
                  city:'',
                  address:'',
                  sex:''
                },

                isEditForm: false,//是否是编辑页面

                sexOptions: [{
                    value: 0,
                    label: '男'
                }, {
                    value: 1,
                    label: '女'
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

            formatsex:function (row, column, cellValue) {
                if (cellValue === 0){
                    return '男';
                }else {
                    return '女';
                }
            },
            formatStatus:function (row, column, cellValue) {
                if (cellValue === 0){
                    return '黑名单';
                }else {
                    return '正常';
                }
            },
            formatPartner:function (row, column, cellValue) {
                if (cellValue === 0){
                    return '合伙人';
                }else {
                    return '普通用户';
                }
            },
            //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
            async getData(){

                await GetpartnerFindAll(this.cur_page,this.size).then(res=>{
                    console.log(res.data.data);
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
                if(this.select_cate!==''){
                    GetPartnerFind(parseInt(this.select_cate)).then(res => {
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
              deletepartner(row.id).then((res) =>{
                    if (res.success === true){
                      this.select_cate = "";
                      this.getData();
                    }
                });
                //再次获取数据，以消除分页后单页数据数量减少
            },

          //批量删除
          batchDelete(){
            let str = '';
            this.multipleSelection.forEach((selection,index) => {
              str += `${selection.id},`
              console.log(str)
            });
            if (str.endsWith(',')){
              str = str.slice(0, -1);
            }

            partnerdelete(str).then((res)=>{
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
                this.select_cate = "";
                this.isEditForm = false;
                this.addForm = {
                    mobile:'',
                    name:'',
                    email:'',
                    city:'',
                    address:'',
                    sex:0
                };

                this.addFormVisible=true;
            },

            //新增
            myPostUsersAdd(){
            PostPartner(this.addForm).then((res) => {
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
                            this.myPutUsersChange();
                        }else {
                            this.myPostUsersAdd();
                        }
                    }
                })

            },


            //编辑按钮点击
            handleEdit(index,row){
                this.isEditForm = true;
                this.addForm = {
                    id:row.id,
                    sex:row.sex,
                    mobile:row.mobile,
                    name:row.name,
                    email:row.email,
                    city:row.city,
                    address:row.address,
                };
                this.addFormVisible=true;
            },

            //修改
            myPutUsersChange(){
                getPartner(this.addForm,this.addForm.id).then((res)=>{
                    if (res.success===true){
                        this.addFormVisible=false;
                        this.getData();
                    }else {
                        this.$message(
                          {message: res.data,
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
