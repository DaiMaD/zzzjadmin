<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">

                <!--<el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>-->

              <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID"  class="handle-select mr10" clearable>

                </el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

                <!--<el-button type="primary" icon="add" @click="handleAdd">新增</el-button>-->
            </div>
            <el-table :data="list" border max-height="660" style="width: 100%" ref="multipleTable" stripe :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">

                <el-table-column type="selection" min-width="55"></el-table-column>

                <el-table-column prop="user_id" label="用户名" min-width="100"></el-table-column>

                <el-table-column prop="pay" label="支付价格" min-width="100"></el-table-column>

                <el-table-column prop="status" label="状态" min-width="100" :formatter="formatStatus"></el-table-column>

                <el-table-column prop="pay_time" label="支付时间" min-width="150" ></el-table-column>

                <el-table-column prop="create_time" label="创建时间" min-width="150" :formatter="formatTime"></el-table-column>

                <el-table-column prop="update_time" label="修改时间" min-width="150" :formatter="formatTime"></el-table-column>

                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small"
                                   @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger"
                                   @click="myDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!---------分页--------------->
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

              <!--修改弹框-->
            <div class="categories-news" v-if="this.isEditForm">
                <div class="categories-news-main">
                    <div class="categories-news-title">
                        <span>修改</span>
                        <i class="iconfont icon-msnui-close-fat" @click="isEditForm = false"></i>
                    </div>
                    <div class="categories-news-content">
                        <el-form  :model="addForm" ref="addForm" label-position="left" label-width="100px">

                            <el-form-item  label="用户id:" prop="user_id">
                                <el-input  v-model="addForm.user_id"></el-input>
                            </el-form-item>

                            <el-form-item label="订单号:" prop="order_num">
                                <el-input  v-model="addForm.order_num"></el-input>
                            </el-form-item>

                            <el-form-item label="支付价格:" prop="pay">
                                <el-input  v-model="addForm.pay"></el-input>
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

                            <el-form-item  label="使用的积分:" prop="bonus_points">
                                <el-input  v-model="addForm.bonus_points"></el-input>
                            </el-form-item>

                        </el-form>
                    </div>
                    <div class="categories-news-button">
                        <button @click="confirmAdd">确定</button>
                        <button @click="isEditForm = false">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getActiveOrder,getActiveOrderOne,deleteActiveOrderOne,putActiveOrder} from '../../../../api/api';
    import {formatDate} from '../../../Utility/Utility';
    export default {
        data() {
            /*var validateName = (rule, value, callback) => {
                if (/^\s*$/.test(value)) {
                    callback(new Error('请输入正确的姓名,不可以是空格'));
                }else {
                    callback();
                }
            };*/
            return {
                select_cate: '',
                cur_page:1,
                list:[],
                total:0,
                size:10,
                //名称不能为空
                /*addFormRules: {
                    name: [
                        { required: true, message: '名称字段不能为空' },
                        { validator: validateName, trigger: 'blur' }
                    ]
                },*/

                //新增界面是否显示
               /* addFormVisible: false,*/

                //分类状态
                statusOptions: [{
                    value: 0,
                    label: '尚未支付'
                }, {
                    value: 1,
                    label: '支付'
                }],

                // //新增界面数据
                // addForm: {
                //     user_id:'',
                //     order_num:'',
                //     pay:'',
                //     status:0,
                //     bonus_points:'',
                // },

                //是否是编辑页面
                isEditForm: false,

            }
        },
        created(){
            this.getData();
        },
        computed: {
        },
        methods: {


            //索引值+1
            indexMethod(index){
                return index+1
            },



            //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
            async getData(){
                await getActiveOrder(this.cur_page,this.size).then(res=>{
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
//		  		document.getElementById("table").setAttribute("style","height: 1100px !important");
		  	},
          //搜索
          search(){
            if(this.select_cate!==''){
              getActiveOrderOne(parseInt(this.select_cate)).then(res => {
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
            // 新增删除提示
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      cancelButtonClass: "btn-custom-cancel",
                      type: 'warning'
                    }).then(() => {

 deleteActiveOrderOne(row.id).then((res) =>{
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


            //新增弹框按钮点击显示

            /*handleAdd(){
                            this.isEditForm = false;
                            this.addForm = {
                                name: '',
                                lecturer:'',
                                position:'',
                                avatar:'',
                                banner:'',
                                // content:'',
                                category_id:'',
                                status:0,
                                recommend:0,
                                home:0,
                                buy_times:0,
                                ori_price:'',
                                sale_price:'',

                            };

                            this.addFormVisible=true;
                        },*/


          //新增
          /*myPostActiveOrderAdd(){
              postCourses(this.addForm).then((res) => {
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
          },*/


          //新增弹框 确认按钮 点击
          confirmAdd(){
            /*this.$refs['addForm'].validate((valid) => {
                if (valid){
                    if (this.isEditForm){
                        this.myPutCoursesChange();
                    }else {
                        this.myPostActiveOrderAdd();
                    }
                }
            })*/
            this.myPutActiveOrderChange();
            this.isEditForm = false;
          },


         //编辑按钮点击
         handleEdit(index,row){
                this.isEditForm = true;
                this.addForm = {
                    id: row.id,
                    user_id:row.user_id,
                    order_num:row.order_num,
                    pay:row.pay,
                    status:0,
                    bonus_points:row.bonus_points,
                };
                // this.addFormVisible=true;
            },



          //修改
          myPutActiveOrderChange(){
                putActiveOrder(this.addForm,this.addForm.id).then((res)=>{
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



            //分类状态判断
            formatStatus:function (row, column, cellValue) {
                switch (cellValue){
                    case 0:  return '尚未支付'; break;
                    case 1:  return '支付'; break;
                    default : return '取消'
                }
            },

            //时间
            formatTime:function(row, column, cellValue){
                return formatDate(cellValue)
            },
        }
    }
</script>

<style scoped>

</style>
