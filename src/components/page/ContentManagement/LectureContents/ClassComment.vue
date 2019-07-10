<template>
  <div class="table">
    <!---------------->
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">
          批量删除
        </el-button>
        <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10" clearable>
        </el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <div class="addbtn">
          <el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
            <i class="el-icon-info addbtn2"></i>
          </el-tooltip>
          <el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
        </div>
      </div>
      <el-table :data="list" border max-height="680" ref="multipleTable" @selection-change="handleSelectionChange"
        :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column prop="user_id" label="留言用户" min-width="80" fixed></el-table-column>
        <el-table-column prop="type" label="类型" min-width="50" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="class_id" label="课程id" min-width="80"></el-table-column>
        <el-table-column prop="content" label="内容" min-width="80"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="80" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="100" :formatter="formatTime"></el-table-column>
        <el-table-column prop="update_time" label="更新时间" min-width="100" :formatter="formatTime"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- -------分页------------- -->
      <div class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
        </el-pagination>
      </div>
    </div>

    <!-- ------------新增弹框------------- -->
    <div class="categories-news" v-if="this.addFormVisible">
      <div class="categories-news-main">
        <div class="categories-news-title">
          <span>新增</span>
          <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
        </div>
        <div class="categories-news-content">
          <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
            <el-form-item label="名 称:" prop="user_id">
              <el-input v-model.string="addForm.user_id"></el-input>
            </el-form-item>
            <el-form-item label="类型:" prop="type">
              <el-input v-model.string="addForm.type"></el-input>
            </el-form-item>
            <el-form-item label="课程id:" prop="class_id">
              <el-input v-model.string="addForm.class_id"></el-input>
            </el-form-item>
            <el-form-item label="内容:" prop="content">
              <el-input v-model.string="addForm.content"></el-input>
            </el-form-item>
            <el-form-item label="分类状态:" prop="status">
              <el-select v-model="addForm.status">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </div>
        <!-- 确定 /  取消 按钮 -->
        <div class="categories-news-button">
          <button @click="confirmAdd">确定</button>
          <button @click="addFormVisible = false">取消</button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import { getClassComment, getClassCommentOne, deleteClassCommentOne, postClassComment, putClassComment, postClassCommentList, } from '../../../../api/api';
  import { formatDate, } from '../../../Utility/Utility'

  export default {
    data() {
      var validateName = (rule, value, callback) => {
        if (/^\s*$/.test(value)) {
          callback(new Error('请输入正确的名称,不可以是空格'));
        } else {
          callback();
        }
      };
      return {
        select_cate: '',  //查询id
        list: [],         //数据
        del_list: [],     //查询时缓存的全部数据
        cur_page: 1,      //当前页
        total: 0,
        size: 10,

        //新增界面是否显示
        addFormVisible: false,
        //名称不能为空
        addFormRules: {
          user_id: [
            { required: true, message: '名称字段不能为空' },
            { validator: validateName, trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          user_id: '',
          type: 0,
          class_id: '',
          content: '',
          status: 0
        },

        isEditForm: false,//是否是编辑页面


        statusOptions: [{
          value: 0,
          label: '不可见'
        }, {
          value: 1,
          label: '可见'
        }],
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
    mounted() {
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

      //status状态判断
      formatStatus: function (row, column, cellValue) {
        if (cellValue === 0) {
          return '不可见';
        } else {
          return '可见';
        }
      },

      //时间
      formatTime: function (row, column, cellValue) {
        return formatDate(cellValue)
      },



      // formatType: function (row, column, cellValue) {
      //   switch (cellValue) {
      //     case 0:
      //       return '普通';
      //       break;
      //     case 1:
      //       return '独角兽';
      //       break;
      //     case 2:
      //       return '大讲堂';
      //       break;
      //     case 3:
      //       return 'FM';
      //       break;
      //     default :
      //       return '暂无此类型'
      //   }
      // },



      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData() {
        await getClassComment(this.cur_page, this.size).then(res => {


          if (!res.data.data || res.data.data == [] || res.data.data.length == 0) {
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
        console.log(val);
        this.cur_page = val;
        this.getData();
      },
      handleSizeChange(val) {
        this.size = val
        this.getData();
        document.getElementById("table").setAttribute("style", "height: 1100px !important");
      },

      //搜索
      search() {
        if (this.select_cate !== '') {
          getClassCommentOne(parseInt(this.select_cate)).then(res => {
            if (res.data == null) {
              this.list = null
            } else {
              this.list = JSON.parse(JSON.stringify(this.del_list));
              this.list.splice(0, this.list.length, res.data)
            }
          });
        } else {
          this.list = JSON.parse(JSON.stringify(this.del_list))
        }

      },

      //删除
      myDelete(index, row) {
        // 新增删除提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(() => {

          deleteClassCommentOne(row.id).then((res) => {
            if (res.success === true) {
              this.select_cate = '';
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
      batchDelete() {
        let str = '';
        this.multipleSelection.forEach((selection, index) => {
          str += `${selection.id},`
        });
        if (str.endsWith(',')) {
          str = str.slice(0, -1);
        }

        postClassCommentList(str).then((res) => {
          if (res.success === true) {
            this.getData();
          }
        });
      },

      //点击选中被删除项
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },





      //新增弹框显示
      handleAdd() {
        this.select_cate = '';
        this.isEditForm = false;
        this.addForm = {
          user_id: '',
          type: 0,
          class_id: '',
          content: '',
          status: 0
        };

        this.addFormVisible = true;
      },


      //新增弹框 确认按钮 点击
      confirmAdd() {
        this.$refs['addForm'].validate((valid) => {
          console.log(valid);
          if (valid) {
            if (this.isEditForm) {
              this.myPutClassCommentChange();
            } else {
              this.myPostClassCommentAdd();
            }
          }
        })

      },

      //新增
      myPostClassCommentAdd() {
        postClassComment(this.addForm).then((res) => {
          if (res.success === true) {

            this.addFormVisible = false;
            this.getData();
          } else {
            this.$message({
              message: res.data,
              type: "error"
            })
          }
        }).catch((res) => {
          this.$message({
            message: res.data,
            type: "error"
          })

        })
      },


      //编辑按钮点击
      handleEdit(index, row) {
        console.log(row.status);
        this.isEditForm = true;

        this.addForm = {
          id: row.id,
          user_id: row.user_id,
          type: row.type,
          class_id: row.class_id,
          content: row.content,
          status: row.status,
        };
        this.addFormVisible = true;
      },


      //修改
      myPutClassCommentChange() {
        putClassComment(this.addForm, this.addForm.id).then((res) => {
          if (res.success === true) {
            this.addFormVisible = false;
            this.getData();
          } else {
            this.$message({
              message: res.data,
              type: 'error'
            });
          }
        });
      }

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