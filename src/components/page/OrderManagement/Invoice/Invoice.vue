<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>发票信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
              <!--<el-button type="primary"  icon="delete" class="handle-del mr10"  @click="batchDelete">批量删除</el-button>-->

              <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID"  class="handle-select mr10" clearable>
                </el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>

                <!--<el-button type="primary" icon="add" @click="handleAdd">新增</el-button>-->
            </div>

          <el-table :data="list" border max-height="400" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column
                    type="index"
                    :index="indexMethod" width="80">
                </el-table-column>

                <el-table-column prop="id" label="发票订单" width="100"></el-table-column>

                <el-table-column prop="usci" label="统一信用代码" width="100"></el-table-column>

                <el-table-column prop="name" label="姓名" width="150"></el-table-column>

                <el-table-column prop="mobile" label="手机号" width="100"></el-table-column>

                <el-table-column prop="type" label="类型" width="100" :formatter="formatType"></el-table-column>

                <el-table-column prop="email" label="电子邮件" width="150"></el-table-column>

                <el-table-column prop="province" label="纸质发票邮寄省份" width="70"></el-table-column>

                <el-table-column prop="city" label="纸质发票邮寄城市" width="70"></el-table-column>

                <el-table-column prop="county" label="纸质发票邮寄地区" width="70"></el-table-column>

                <el-table-column prop="address" label="纸质发票邮寄详细地址" width="120"></el-table-column>

                <el-table-column prop="order_id" label="纸质发票支付订单" width="70"></el-table-column>

                <el-table-column prop="if_pay" label="纸质发票是否支付" width="70"></el-table-column>

                <el-table-column prop="create_time" label="创建时间" width="150" :formatter="formatTime"></el-table-column>

                <el-table-column prop="update_time" label="更新时间" width="150" :formatter="formatTime"></el-table-column>

                <el-table-column label="操作" width="180" fixed="right">
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
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
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
                        <el-form  :model="addForm" ref="addForm" label-position="left" label-width="150px">

                            <el-form-item  label="发票抬头:" prop="title">
                                <el-input  v-model="addForm.title"></el-input>
                            </el-form-item>

                            <el-form-item label="统一信用代码:" prop="usci">
                                <el-input  v-model="addForm.usci"></el-input>
                            </el-form-item>

                            <el-form-item label="姓名:" prop="name">
                                <el-input  v-model="addForm.name"></el-input>
                            </el-form-item>

                            <el-form-item label="手机号:" prop="mobile">
                                <el-input  v-model="addForm.mobile"></el-input>
                            </el-form-item>

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
    import {getInvoice,getInvoiceOne,deleteInvoiceOne,putInvoice,postInvoiceList} from '../../../../api/api';
    import {formatDate} from '../../../Utility/Utility';
    export default {
        data() {

            return {
                select_cate: '',
                cur_page:1,
                list:[],
                total:0,
                size:10,

                //分类状态
                typeOptions: [{
                    value: 1,
                    label: '电子发票'
                }, {
                    value: 2,
                    label: '纸质发票'
                }],

                //新增界面数据
                addForm: {
                    title:'',
                    usci:'',
                    name:'',
                    type:1,
                    mobile:'',
                },

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
                await getInvoice(this.cur_page,this.size).then(res=>{
                    if (!res.data.data || res.data.data === [] || res.data.data.length === 0){
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
                getInvoiceOne(parseInt(this.select_cate)).then(res => {
                  if (res.data==null){
                    this.list=null
                  }else {
                    this.list=JSON.parse(JSON.stringify(this.del_list));
                    this.list.splice(0,this.list.length,res.data)
                  }
                });
              }else {
                this.list=JSON.parse(JSON.stringify(this.del_list));
              }
            },


            //删除
            myDelete(index,row){
                deleteInvoiceOne(row.id).then((res) =>{
                    if (res.success === true){
                      this.select_cate='';
                        this.getData();
                    }
                });
                //再次获取数据，以消除分页后单页数据数量减少

            },


          //批量删除
          // batchDelete(){
          //   let str = '';
          //   this.multipleSelection.forEach((selection,index) => {
          //     str += `${selection.id},`
          //   });
          //   if (str.endsWith(',')){
          //     str = str.slice(0, -1);
          //   }
          //
          //   postInvoiceList(str).then((res)=>{
          //     if(res.success===true){
          //       this.getData();
          //     }
          //   });
          // },


          //点击选中被删除项
          // handleSelectionChange(val){
          //   this.multipleSelection=val;
          // },


            //编辑按钮点击
            handleEdit(index,row){
                this.isEditForm = true;
                this.addForm = {
                    id: row.id,
                    title:row.title,
                    usci:row.usci,
                    name:row.name,
                    type:1,
                    mobile:row.mobile,
                };
            },

            //修改
            myPutInvoiceChange(){
                putInvoice(this.addForm,this.addForm.id).then((res)=>{
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


            // 编辑 弹框 确认按钮 点击
            confirmAdd(){
                this.myPutInvoiceChange();
                this.isEditForm = false;
            },


            //分类状态判断
            formatType:function (row, column, cellValue) {
                switch (cellValue){
                    case 1:  return '电子发票'; break;
                    default : return '纸质发票'
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
