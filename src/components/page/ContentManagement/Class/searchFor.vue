<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
        <el-input size="medium"  v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10" clearable>
        </el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <div class="addbtn">
        		<el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left" >
			      <i class="el-icon-info addbtn2"></i>
			    </el-tooltip>
	        <el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
        </div>
      </div>
      <el-table :data="list" max-height="800" border style="width: 100%" ref="multipleTable" @slecetion-change="handleSelectionChange" :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
        <el-table-column type="selection" min-width="55" fixed></el-table-column>
        <!--<el-table-column type="index" :index="indexMethod" min-width="80" fixed> </el-table-column>-->
        <!--<el-table-column prop="id" label="序列ID" min-width="100" fixed></el-table-column>-->
        <el-table-column prop="hot_word" label="搜索词" min-width="100" ></el-table-column>
        <el-table-column prop="is_hot" label="是否热门" min-width="70" :formatter="formatHot"></el-table-column>        
        <el-table-column prop="create_time" label="创建时间" min-width="100" :formatter="formatTime"></el-table-column>
        <el-table-column prop="update_time" label="修改时间" min-width="100" :formatter="formatTime"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="small"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger"
                       @click="myDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- -------分页------------- -->
      <div class="pagination">
        <el-pagination
          @current-change ="handleCurrentChange"
          layout="total, prev, pager, next"
          background
          :page-size="this.size"
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
            <el-form  :model="addForm" ref="addForm" label-position="left" label-width="120px">
              <el-form-item   label="搜索词:" prop="hot_word">
                <el-input  v-model="addForm.hot_word"></el-input>
              </el-form-item>
              <el-form-item label="是否推荐精品（FM精 v2）:" prop="is_hot">
                <el-select v-model="addForm.is_hot">
                  <el-option
                    v-for="item in HtOptions"
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
      <div class="categories-news" v-if="this.editShow">
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
            </el-upload>
          </div>
          <div class="categories-news-content">
            <quill-editor ref="myQuillEditor" v-model="text" :options="editorOption" @change="onEditorChange($event)">
            </quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">
              提交
            </el-button>
          </div>
        </div>

      </div>
      <!--进度条弹框-->
      <div class="categories-news" v-if="this.progressVisible"  >
        <!--<el-progress :text-inside="true" :stroke-width="18" :percentage="this.progressPercent"></el-progress>-->
        <el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7" ></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import { quillEditor } from 'vue-quill-editor';
  import {gethotword,posthotword,puthotword,Deletehotword,DeletehotwordAll} from '../../../../api/api';
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
  ];


  export default {
    data() {
      var validateName = (rule, value, callback) => {
        if (/^\s*$/.test(value)) {
          callback(new Error('请输入正确的内容,不可以是空格'));
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
        //名称不能为空
        // addFormRules: {
        //   name: [
        //     { required: true, message: '名称字段不能为空' },
        //     { validator: validateName, trigger: 'blur' }
        //   ],
        //   speechmaker: [
        //     { required: true, message: '讲师名称不能为空' },
        //     { validator: validateName, trigger: 'blur' }
        //   ],
        //   ori_price: [
        //     { required: true, message: '原始价格不能为空' },
        //     { validator: validateName, trigger: 'blur' }
        //   ],
        //   sale_price: [
        //     { required: true, message: '销售价格不能为空' },
        //     { validator: validateName, trigger: 'blur' }
        //   ],

        // },
        //新增界面是否显示
        addFormVisible: false,
        //进度条是否显示
        progressVisible: false,
        progressPercent :0,
        //新增界面数据
        addForm: {
         hot_word:'',
         is_hot:0,
        },
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
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
        isEditForm: false,//是否是编辑页面
        //分类状态
        statusOptions: [
          {
            value: 0,
            label: '不可用'
          },
          {
            value: 1,
            label: '可用'
          }
        ],
        //属性状态
        IsOptions: [
          {
            value: 0,
            label: '免费'
          },
          {
            value: 1,
            label: '付费'
          }
        ],
        //是否推荐精品（FM精
        HtOptions: [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ],
        //是否推荐FM里
        RecommendOptions: [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ],
        //是否推荐上首页
        HomeOptions: [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ],
      }
    },
    created(){
      this.getData();
      var _this = this;
    		document.onkeydown = function(event) {
    			var e = window.event || arguments.callee.caller.arguments[0];
        console.log(e.keyCode)
        if (e.keyCode == 75) {
            _this.addKey();
        }
        if(e.keyCode == 27) {
            _this.closeKey();
        }
    		};
    },
    computed: {
    },

    methods: {
    		addKey() {
				this.isEditForm = false;
				this.handleAdd();
				this.addFormVisible = true;
			},
	  		closeKey(){
	  			this.addFormVisible = false;
	  		},
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData(){
        await gethotword(this.cur_page,this.size).then(res=>{
          console.log(res.data.data);
          
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
      //搜索
      search(){
        if(this.select_cate!==''){
          getCoursesOne(parseInt(this.select_cate)).then(res => {
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

 Deletehotword(row.id).then((res) =>{
          if (res.success === true){
            this.select_cate="";
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
        DeletehotwordAll(str).then((res)=>{
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
        this.select_cate="";
        this.text='';
        this.isEditForm = false;
        this.addForm = {
          hot_word:'',
          is_hot:0,
        };
        this.addFormVisible=true;
      },
      //新增
      myPostCoursesAdd(){
        posthotword(this.addForm).then((res) => {
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
              this.myPutCoursesChange();
            }else {
              this.myPostCoursesAdd();
            }
          }
        })
      },
      //编辑按钮点击
      handleEdit(index,row){
        this.text=row.content;
        this.isEditForm = true;
        this.addForm = {
          id:row.id,
          hot_word:row.hot_word,
          is_hot:row.is_hot,
        };
        this.addFormVisible=true;
      },
      //修改
      myPutCoursesChange(){
        puthotword(this.addForm,this.addForm.id).then((res)=>{
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
      //分类状态判断
      formatStatus:function (row, column, cellValue) {
        if (cellValue === 0){
          return '不可用';
        }else {
          return '可用';
        }
      },
      //属性判断
      formatIs:function (row, column, cellValue) {
        if (cellValue === 0){
          return '免费';
        }else {
          return '付费';
        }
      },
      //是否推荐精品
      formatHot:function (row, column, cellValue) {
        if (cellValue === 0){
          return '否';
        }else {
          return '是';
        }
      },
      //是否推荐（FM里
      formatRecommend:function (row, column, cellValue) {
        if (cellValue === 0){
          return '否';
        }else {
          return '是';
        }
      },
      //是否推荐上首页（热门
      formatHome:function (row, column, cellValue) {
        if (cellValue === 0){
          return '否';
        }else {
          return '是';
        }
      },
      //时间
      formatTime:function(row, column, cellValue){
      		if(cellValue == '' || cellValue == null){
      			return ''
      		}else {
      			return formatDate(cellValue)
      		}
      		
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
      onEditorChange(event) {

      },
      submit(){
        this.addForm.content=this.text;
        this.editShow = false;
        this.$message.success('内容修改成功！');
        this.text='';
      }
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
