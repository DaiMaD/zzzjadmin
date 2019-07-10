<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
            </div>
            <el-table :data="list" border max-height="400" style="width: 100%" ref="multipleTable" stripe :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="mobile" label="mobile" min-width="200"></el-table-column>
                <el-table-column prop="nickname" label="nickname" min-width="200"></el-table-column>
                <el-table-column prop="headimgurl" label="headimgurl" min-width="400"></el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small">编辑</el-button>
                        <el-button size="small" type="danger">删除</el-button> 
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
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
        </div>
    </div>
</template>

<script>
    import {getWxUsers} from '../../../../api/api';

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
                if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
                    callback();
                }else {
                    callback(new Error('请输入正确的手机号'));
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
                    mobile: [
                        { validator: validateMobile, trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    openid:'',
                    nickname:'',
                    headimgurl:'',
                    uid:'',
                },

                isEditForm: false,//是否是编辑页面
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
                await getWxUsers(this.cur_page,this.size).then(res=>{
                    console.log(res);
                    if (!res.data.data || res.data.data == [] || res.data.data.length == 0){
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


            //搜索==
            search(){
                if(this.select_cate!==''){
                    getUsersOne(parseInt(this.select_cate)).then(res=>this.list.splice(0,this.list.length,res.data));
                }else{
                    this.list=JSON.parse(JSON.stringify(this.del_list))
                }
            },

            //删除
            myDelete(index,row){
              deleteUsersOne(row.id).then((res) =>{
                    if (res.success === true){

                      this.getData();
                    }
                });
                //再次获取数据，以消除分页后单页数据数量减少
            },


            //分页导航
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            handleSizeChange(val){
		  		this.size = val
		  		this.getData();
		  	},
            //新增弹框显示
            handleAdd(){
                this.isEditForm = false;
                this.addForm = {
                    openid:'',
                    nickname:'',
                    headimgurl:'',
                    uid:'',
                };

                this.addFormVisible=true;
            },

          //新增
          myPostCategoryAdd(){
            postUsers(this.addForm).then((res) => {
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
                    console.log(valid);
                    if (valid){
                        if (this.isEditForm){
                            this.myPutCategoryChange();
                        }else {
                            this.myPostCategoryAdd();
                        }
                    }
                })

            },


            //编辑按钮点击
            handleEdit(index,row){
                console.log(row.status);
                this.isEditForm = true;
                this.addForm = {
                    id:row.id,
                    openid:row.openid,
                    nickname:row.nickname,
                    headimgurl:row.headimgurl,
                    uid:row.uid,
                };
                this.addFormVisible=true;
            },

            //修改
            myPutCategoryChange(){
                putUsers(this.addForm,this.addForm.id).then((res)=>{
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
