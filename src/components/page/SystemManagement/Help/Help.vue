<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
              <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
                <el-input v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10">
                </el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="add" @click="handleAdd" class="addbtn">新增</el-button>
            </div>
            <el-table :data="list" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange"  stripe :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                    type="index"
                    :index="indexMethod" width="80">
                </el-table-column>
                <el-table-column prop="id" label="帮助中心" min-width="50"></el-table-column>
                <el-table-column prop="content" label="内容" min-width="100">
                    <template slot-scope="scope">
                        <span @click="isContentShow(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="70" :formatter="formatStatus"></el-table-column>
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

            <!---------分页--------------->
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

                            <el-form-item label="内容:" prop="content">
                                <template slot-scope="scope">
                                    <span @click="isEditShow(scope.$index, scope.row)" style="cursor: pointer">点击编辑内容</span>
                                </template>
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

            <!--详情-->
            <div class="categories-news" v-if="this.contentShow">
                <div class="categories-news-main categories-content-main">
                    <div class="categories-news-title">
                        <span>详情</span>
                        <i class="iconfont icon-msnui-close-fat" @click="contentShow = false"></i>
                    </div>
                    <div class="categories-news-content" v-html="this.addForm.content">

                    </div>
                </div>
            </div>

          <!--富文本弹框-->
          <div class="categories-news" v-if="this.editShow"  >
            <div class="categories-news-main categories-content-main">
              <div class="categories-news-title">
                <span>详情</span>
                <i class="iconfont icon-msnui-close-fat" @click="cancelEditing"></i>
                <el-upload
                  class="avatar-uploader uploader-none"
                  :show-file-list="false"
                  action=""
                  :on-change="handleTextImageSuccess"
                  :auto-upload="false">
                  <!--:on-success="uploadSuccess"-->
                  <!--:on-error="uploadError"-->
                  <!--:before-upload="beforeUpload">-->
                </el-upload>
              </div>
              <div class="categories-news-content">
                <quill-editor ref="myQuillEditor" v-model="text" :options="editorOption" >
                </quill-editor>
                <el-button class="editor-btn" type="primary" @click="submit">
                  提交
                </el-button>
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
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import {getHelp,getHelpOne,deleteHelpOne,postHelp,putHelp,postHelpList,getPicURL} from '../../../../api/api';
    import {formatDate,handleCommonAvatarSuccess} from '../../../Utility/Utility';
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
    ]
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
                contentShow:false,
                editShow:false,
                text:'',
                multipleSelection:[],


              editorOption: {
                placeholder: '',
                theme: 'snow',  // or 'bubble'
                modules: {
                  toolbar: {
                    container: toolbarOptions,  // 工具栏
                    handlers: {
                      'image': function (value) {
                        console.log("234");

                        if (value) {
                          document.querySelector('.avatar-uploader input').click()
                        } else {
                          this.quillEditor.format('image', false);
                        }
                      }
                    }


                  }
                }
              },

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
                    content:'',
                    status:0,
                    text:''
                },


              //是否是编辑页面
                isEditForm: false,


              //进度条是否显示
              progressVisible: false,
              progressPercent: 0,

                //状态
                statusOptions: [{
                    value: 0,
                    label: '下线'
                }, {
                    value: 1,
                    label: '上线'
                }],
            }
        },
        created(){
            this.getData();
        },
        methods: {


            indexMethod(index){
                return index+1
            },


          //富文本上传图片

          handleTextImageSuccess(file, fileList) {
            console.log(file.name + file.size);
            if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {

              file.name=Number(new Date())+`${/\.(jpg|jpeg|png)$/.exec(file.name)[0]}`;

              var _this = this;
              this.progressVisible = true;
              let quill = this.$refs.myQuillEditor.quill;
              var complete = function (res) {
                if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
                  console.log('0000000000');
                  getPicURL(res.key).then((res) => {
                    console.log(res.data);

                    _this.$message({
                      message: "上传成功",
                      type: "success"
                    });
                    _this.progressVisible = false;
                    let length = quill.getSelection().index;
                    // 插入图片  res.info为服务器返回的图片地址
                    quill.insertEmbed(length, 'image', " " + res.data);

                    length = quill.getSelection().index;
                    // 调整光标到最后
                    quill.setSelection(length+ 2)
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
            async getData(){
                await getHelp(this.cur_page,this.size).then(res=>{
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
            //搜索
            search(){
                if(this.select_cate!==''){
                    getHelpOne(parseInt(this.select_cate)).then(res=>this.list.splice(0,this.list.length,res.data));
                }else{
                    this.list=JSON.parse(JSON.stringify(this.del_list))
                }
            },
            //删除
            myDelete(index,row){
                deleteHelpOne(row.id).then((res) =>{
                    if (res.success === true){

                        this.getData();
                    }
                });
                //再次获取数据，以消除分页后单页数据数量减少
            },

          //批量删除
          batchDelete() {
            let str = '';
            this.multipleSelection.forEach((selection, index) => {
              str += `${selection.id},`
            });
            if (str.endsWith(',')) {
              str = str.slice(0, -1);
            }

            postHelpList(str).then((res) => {
              if (res.success === true) {
                console.log("sfdsf");
                this.getData();
              }
            });
          },

          //点击选中被删除项
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },


            //分页导航
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            //新增弹框按钮点击显示
            handleAdd(){
                this.text='';
                this.isEditForm = false;
                this.addForm = {
                    content:'',
                    status:0,
                };
                this.addFormVisible=true;
            },
            //编辑按钮点击
            handleEdit(index,row){
                this.text=row.content;
                this.isEditForm = true;
                this.addForm = {
                    id: row.id,
                    content:row.content,
                    status:0,
                };
                this.addFormVisible=true;
            },
            //新增
            myPostCoursesAdd(){
                postHelp(this.addForm).then((res) => {
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
            //修改
            myPutCoursesChange(){
                putHelp(this.addForm,this.addForm.id).then((res)=>{
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
            //新增弹框 确认按钮 点击
            confirmAdd(){
                this.$refs['addForm'].validate((valid) => {
                    if (valid){
                        if (this.isEditForm){
                            console.log(1);
                            this.myPutCoursesChange();
                        }else {
                            this.myPostCoursesAdd();
                        }
                    }
                })

            },
            //下拉框/时间值处理
            //状态
            formatStatus:function (row, column, cellValue) {
                if (cellValue === 0){
                    return '下线';
                }else {
                    return '上线';
                }
            },
            //时间
            formatTime:function(row, column, cellValue){
                return formatDate(cellValue)
            },

            //详情
            isContentShow(index,row){
                this.contentShow=true;
                console.log('hang',row);

                console.log(row.content);
                this.addForm.content=row.content;
            },
            //编辑富文本
            isEditShow(index,row){
                this.editShow=true;
            },
            //取消编辑
            cancelEditing(){
                console.log(this.addForm.content);
                this.editShow = false;
                this.text=this.addForm.content;
            },
            submit(){
                this.addForm.content=this.text;
                this.editShow = false;
                this.$message.success('内容修改成功！');
                this.text='';
            },


        },
        components: {
            quillEditor
        },
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
