<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
        <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10" clearable>
        </el-input>
        <div class="addbtn">
          <el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
            <i class="el-icon-info addbtn2"></i>
          </el-tooltip>
          <el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
        </div>
      </div>
      <el-table :data="list" max-height="800" border style="width: 100%" ref="multipleTable"
        @slecetion-change="handleSelectionChange"
        :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
        <el-table-column type="selection" min-width="55" fixed></el-table-column>
        <el-table-column prop="hot_word" label="搜索词" min-width="100"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="100" :formatter="formatTime"></el-table-column>
        <el-table-column prop="update_time" label="修改时间" min-width="100" :formatter="formatTime"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- -------分页------------- -->
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next" background
          :page-size="this.size" :total="this.total">
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
            <el-form :model="addForm" ref="addForm" label-position="left" label-width="120px">
              <el-form-item label="搜索词:" prop="hot_word">
                <el-input v-model="addForm.hot_word"></el-input>
              </el-form-item>
              <el-form-item label="是否推荐精品（FM精 v2）:" prop="is_hot">
                <el-select v-model="addForm.is_hot">
                  <el-option v-for="item in HtOptions" :key="item.value" :label="item.label" :value="item.value">
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

    </div>
    <!--进度条弹框-->
    <div class="categories-news" v-if="this.progressVisible">
      <el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
    </div>
  </div>
  </div>
</template>

<script>
  import { gethotword, Deletehotword, DeletehotwordAll } from '../../../../api/api';
  import { formatDate, handleCommonAvatarSuccess } from '../../../Utility/Utility';

  export default {
    data() {
      var validateName = (rule, value, callback) => {
        if (/^\s*$/.test(value)) {
          callback(new Error('请输入正确的内容,不可以是空格'));
        } else {
          callback();
        }
      };
      return {
        select_cate: '',
        cur_page: 1,
        list: [],
        total: 0,
        size: 10,
        contentShow: false,
        editShow: false,
        text: '',
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
        progressPercent: 0,
        //新增界面数据
        addForm: {
          hot_word: '',
          is_hot: 0,
        },

        isEditForm: false,//是否是编辑页面
      }
    },
    created() {
      this.getData();
      var _this = this;
      document.onkeydown = function (event) {
        var e = window.event || arguments.callee.caller.arguments[0];
        console.log(e.keyCode)
        if (e.keyCode == 75) {
          _this.addKey();
        }
        if (e.keyCode == 27) {
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
      closeKey() {
        this.addFormVisible = false;
      },
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData() {
        await gethotword(this.cur_page, this.size).then(res => {
          console.log(res.data.data);

          if (!res.data.data || res.data.data === [] || res.data.data.length === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1;
              this.getData()
            } else {
              this.list = [];
            }
          } else {
            this.list = res.data.data;
            if (res.data.count) {
              this.total = res.data.count
            }
          }
        });
        this.del_list = JSON.parse(JSON.stringify(this.list))
      },
      //分页导航
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },

      //删除
      myDelete(index, row) {
        // 删除提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(() => {

          console.log("删除");


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
      batchDelete() {
        let str = '';
        this.multipleSelection.forEach((selection, index) => {
          str += `${selection.id},`
        });
        if (str.endsWith(',')) {
          str = str.slice(0, -1);
        }
        DeletehotwordAll(str).then((res) => {
          if (res.success === true) {
            this.getData();
          }
        });
      },
      //点击选中被删除项
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //新增弹框按钮点击显示
      handleAdd() {
        this.select_cate = "";
        this.text = '';
        this.isEditForm = false;
        this.addForm = {
          hot_word: '',
          is_hot: 0,
        };
        this.addFormVisible = true;
      },
      //新增
      myPostCoursesAdd() {

      },
      //新增弹框 确认按钮 点击
      confirmAdd() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            if (this.isEditForm) {
              this.myPutCoursesChange();
            } else {
              this.myPostCoursesAdd();
            }
          }
        })
      },
      //编辑按钮点击
      handleEdit(index, row) {
        this.text = row.content;
        this.isEditForm = true;
        this.addForm = {
          id: row.id,
          hot_word: row.hot_word,
          is_hot: row.is_hot,
        };
        this.addFormVisible = true;
      },
      //修改
      myPutCoursesChange() {

      },
      //时间
      formatTime: function (row, column, cellValue) {
        if (cellValue == '' || cellValue == null) {
          return ''
        } else {
          return formatDate(cellValue)
        }

      },
    },
    components: {
    },
  }
</script>

<style scoped>
  .handle-box {
    height: 32px;
  }

  .handle-box .addbtn {
    float: right;
  }
</style>