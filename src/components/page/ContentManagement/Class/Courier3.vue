<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
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
      <el-table :data="list" border max-height="600" style="width: 100%" ref="multipleTable"
        @selection-change="handleSelectionChange"
        :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column prop="head_title" label="海报标题" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="head_img" label="头图" width="150">
          <template slot-scope="scope">
            <a :href="scope.row.head_img" target="true"><img :src="scope.row.head_img" height="90%" /></a>
          </template>
        </el-table-column>
        <el-table-column prop="teacher_brief" label="老师简介" min-width="100"><template slot-scope="scope">
            <span @click="laoshijianjie(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
          </template></el-table-column>
        <el-table-column prop="course_brief" label="课程要点(海报)" min-width="100"><template slot-scope="scope">
            <span @click="kechengyaodianhaibao(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
          </template></el-table-column>
        <el-table-column prop="course_brief_linkshare" label="课程要点(链接)" min-width="100"><template slot-scope="scope">
            <span @click="kechengyaodianlianjie(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
          </template></el-table-column>
        <el-table-column prop="syllabus" label="课程大纲" min-width="100"><template slot-scope="scope">
            <span @click="kechengdagang(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
          </template></el-table-column>
        <el-table-column prop="suitabe_population" label="适宜人群" min-width="100"><template slot-scope="scope">
            <span @click="shiyirenqun(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
          </template></el-table-column>
        <el-table-column prop="purchase_notice" label="购买须知" min-width="100"><template slot-scope="scope">
            <span @click="goumaixuzhi(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
          </template></el-table-column>
        <el-table-column prop="status" label="上线状态" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="update_time" label="更新时间" width="200"></el-table-column>
        <el-table-column label="操作" width="180" fixed='right'>
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

      <!-- 新增弹框 -->
      <div class="categories-news" v-if="this.addFormVisible">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <span>新增</span>
            <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
          </div>
          <div class="categories-news-content">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="80px">
              <el-form-item label="所属套课id:" prop="course_uuid">
                <el-input v-model="addForm.course_uuid"></el-input>
              </el-form-item>
              <el-form-item label="海报标题:" prop="head_title">
                <el-input v-model="addForm.head_title"></el-input>
              </el-form-item>
              <el-form-item label="头图" prop="head_img">
                <el-input v-model="addForm.head_img"></el-input>
                <el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
              </el-form-item>
              <el-form-item label="老师简介:" prop="teacher_brief">
                <!-- <el-input v-model.string="addForm.teacher_brief"></el-input> -->
                <el-input type="textarea" autosize placeholder="请输入内容" v-model.string="addForm.teacher_brief">
                </el-input>
              </el-form-item>
              <el-form-item label="课程要点(海报):" prop="course_brief">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.course_brief"></el-input>
              </el-form-item>
              <el-form-item label="课程要点(链接):" prop="course_brief_linkshare">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.course_brief_linkshare">
                </el-input>
              </el-form-item>
              <el-form-item label="课程大纲:" prop="syllabus">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.syllabus"></el-input>
              </el-form-item>
              <el-form-item label="适宜人群:" prop="suitabe_population">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.suitabe_population"></el-input>
              </el-form-item>
              <!--<el-form-item label="购买须知:" prop="purchase_notice">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.purchase_notice"></el-input>
              </el-form-item>-->
              <el-form-item label="上线状态:" prop="status">
                <el-select v-model="addForm.status">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
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
      <media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia"
        @overSelectFile="overSelectFile"></media-select>
      <!--进度条弹窗-->
      <div class="categories-news" v-if="this.progressVisible">
        <el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
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
            <el-upload class="avatar-uploader uploader-none" :show-file-list="false" action=""
              :on-change="handleTextImageSuccess" :auto-upload="false">
            </el-upload>
          </div>
          <div class="categories-news-content">
            <quill-editor ref="myQuillEditor" v-model="text" :options="editorOption">
            </quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">
              提交
            </el-button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  // import 'quill/dist/quill.core.css';
  // import 'quill/dist/quill.snow.css';
  // import 'quill/dist/quill.bubble.css';
  import { quillEditor } from 'vue-quill-editor';
  import { getjrsdshare, posteradd, posterupdate, getPicURL, DeletePoster } from '../../../../api/api';
  import { formatDate, handleCommonAvatarSuccess, handleCommonAudioSuccess } from '../../../Utility/Utility'
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ];
  export default {
    data() {
      var validateName = (rule, value, callback) => {
        if (/^\s*$/.test(value)) {
          callback(new Error('不可以为空'));
        } else {
          callback();
        }
      };
      var validatePrice = (rule, value, callback) => {
        var price = Number(value)
        if (/^\s*$/.test(value)) {
          callback(new Error('不可以为空'));
          if (! /^([1-9]\d*|[0]{1,1})$/.test(price)) {
            callback(new Error('请输入正确的价格'));
          }
        } else {
          callback();
        }
      };
      return {
        isSelect: false,
        select_cate: '',
        cur_page: 1,
        list: [],
        total: 0,
        size: 10,
        contentShow: false,
        editShow: false,
        text: '',
        //新增界面数据
        addForm: {
          parent_category_id: 4,
          course_uuid: 0,
          head_img: '',
          head_title: '',
          teacher_brief: '',
          course_brief: '',
          course_brief_linkshare: '',
          syllabus: '',
          suitabe_population: '',
          purchase_notice: '',
          status: 0,
        },
        //新增界面是否显示
        addFormVisible: false,
        //进度条弹窗是否显示
        progressVisible: false,
        progressPercent: 0.0,
        //是否是编辑页面
        isEditForm: false,
        //名称不能为空
        addFormRules: {

          course_uuid: [
            { required: true, message: '课程id字段不能为空' },
            { validator: validatePrice, trigger: 'blur' }
          ],
        },
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  // console.log("234");
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
        //分类状态
        statusOptions: [
          {
            value: 0,
            label: '下线'
          }, {
            value: 1,
            label: '上线'
          }
        ],
        //推荐
        recommendOptions: [
          {
            value: 0,
            label: '是'
          }, {
            value: 1,
            label: '否'
          }
        ],
        //是否推荐上首页/  home
        homeOptions: [
          {
            value: 0,
            label: '否'
          }, {
            value: 1,
            label: '是'
          }
        ],
        //小节属性
        typeOptions: [
          {
            value: 0,
            label: '免费'
          }, {
            value: 1,
            label: '付费'
          }
        ],
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
      selectMedia() {
        this.isSelect = true;
      },
      closeMedia() {
        this.isSelect = false
      },
      overSelectMedia(str) {
        this.addForm.head_img = str
      },
      overSelectFile(str) {
        this.addForm.head_img = str
      },
      //富文本上传图片
      handleTextImageSuccess(file, fileList) {
        // console.log(file.name + file.size);
        if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
          file.name = Number(new Date()) + `${/\.(jpg|jpeg|png)$/.exec(file.name)[0]}`;
          var _this = this;
          this.progressVisible = true;
          let quill = this.$refs.myQuillEditor.quill;
          var complete = function (res) {
            if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
              getPicURL(res.key).then((res) => {
                // console.log(res.data);
                var urlData = res.data
                let insertStr = (soure, start, newStr) => {
                  return soure.slice(0, start) + newStr + soure.slice(start)
                }
                console.log(insertStr(urlData, 4, 's'))
                _this.$message({
                  message: "上传成功",
                  type: "success"
                });
                _this.progressVisible = false;
                let length = quill.getSelection().index;
                // 插入图片  res.info为服务器返回的图片地址
                quill.insertEmbed(length, 'image', " " + insertStr(urlData, 4, 's'));
                length = quill.getSelection().index;
                // 调整光标到最后
                quill.setSelection(length + 2)
              })
            }
          };
          var error = function (err) {
            // console.log(err);
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
      //fm上传音频
      handleAudioSuccess(file, fileList) {
        // console.log(file.name + file.size);
        this.progressVisible = true;
        if (file.name && file.name.match(/\.(mp3|MP3)$/)) {
          var _this = this;
          var complete = function (res) {
            if (res.key && res.key.match(/\.(mp3|MP3)$/)) {
              // console.log(res.key);
              getAudioURL(res.key).then((res) => {
                // console.log(res.data);
                _this.progressVisible = false;
                _this.addForm.sound_url = res.data
              })
            }
          };
          var error = function (err) {
            // console.log(err);
            _this.progressVisible = false;
            alert("上传出错")
          };
          var next = function (response) {
            var total = response.total;
            _this.progressPercent = parseFloat(total.percent.toFixed(2));
          };
          handleCommonAudioSuccess(file, fileList, complete, error, next)
        } else {
          this.progressVisible = false;
          this.$message({
            message: "请输入mp3格式音频",
            type: "error"
          })
        }

      },
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)   小节列表
      async getData() {
        await getjrsdshare(this.cur_page, this.size, this.parentid).then(res => {

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
      //搜索
      search() {
        if (this.select_cate !== '') {
          getCoursesOne(parseInt(this.select_cate)).then(res => {
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

          DeletePoster(row.id).then((res) => {
            // alert("刷新成功!")
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

        postFm2List(str).then((res) => {
          if (res.success === true) {
            this.getData();
          }
        });
      },
      //点击选中被删除项
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //新增弹框点击显示
      handleAdd() {
        this.select_cate = '';
        this.isEditForm = false;
        this.addForm = {
          parent_category_id: 4,
          course_uuid: '',
          head_img: '',
          head_title: '',
          teacher_brief: '',
          course_brief: '',
          course_brief_linkshare: '',
          syllabus: '',
          suitabe_population: '',
          purchase_notice: '',
          status: 0,
        };
        this.addFormVisible = true;
      },
      //新增弹框 确认按钮 点击
      confirmAdd() {
        this.$refs['addForm'].validate((valid) => {
          // console.log(valid);
          if (valid) {
            if (this.isEditForm) {
              this.myputFm2Change();
            } else {
              this.myPostCFM2Add();
            }
          }
        })

      },
      //新增
      myPostCFM2Add() {
        posteradd(this.addForm).then((res) => {
          if (res.success === true) {
            this.addFormVisible = false;
            this.getData();
          } else {
            this.$message({
              message: res.data,
              type: "error"
            })
          }
        });
      },
      //编辑按钮点击
      handleEdit(index, row) {
        this.text = row.content;
        this.isEditForm = true;
        this.addForm = {
          id: row.id,
          course_uuid: row.course_uuid,
          head_img: row.head_img,
          head_title: row.head_title,
          teacher_brief: row.teacher_brief,
          course_brief: row.course_brief,
          course_brief_linkshare: row.course_brief_linkshare,
          syllabus: row.syllabus,
          suitabe_population: row.suitabe_population,
          purchase_notice: row.purchase_notice,
          status: row.status,
        };
        this.addFormVisible = true;
      },
      //修改
      myputFm2Change() {
        posterupdate(this.addForm, this.addForm.id).then((res) => {

          // console.log(res.success);
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
      },
      //下拉框/时间值处理
      //分类状态判断
      formatStatus: function (row, column, cellValue) {
        if (cellValue === 0) {
          return '下线';
        } else {
          return '上线';
        }
      },
      //推荐判断
      formatRecommend: function (row, column, cellValue) {
        if (cellValue === 0) {
          return '是'
        } else {
          return '否'
        }

      },
      //时间
      formatTime: function (row, column, cellValue) {
        return formatDate(cellValue)
      },
      //老师简介
      laoshijianjie(index, row) {
        this.contentShow = true;
        // console.log('han',row);
        console.log(row.teacher_brief);
        this.addForm.content = row.teacher_brief;
      },
      //课程要点海报
      kechengyaodianhaibao(index, row) {
        this.contentShow = true;
        // console.log('han',row);
        console.log(row.course_brief);
        this.addForm.content = row.course_brief;
      },
      //课程要点链接
      kechengyaodianlianjie(index, row) {
        this.contentShow = true;
        // console.log('han',row);
        console.log(row.course_brief_linkshare);
        this.addForm.content = row.course_brief_linkshare;
      },
      //课程大纲
      kechengdagang(index, row) {
        this.contentShow = true;
        // console.log('han',row);
        console.log(row.syllabus);
        this.addForm.content = row.syllabus;
      },
      //适宜人群
      shiyirenqun(index, row) {
        this.contentShow = true;
        // console.log('han',row);
        console.log(row.suitabe_population);
        this.addForm.content = row.suitabe_population;
      },
      //购买须知
      goumaixuzhi(index, row) {
        this.contentShow = true;
        // console.log('han',row);
        console.log(row.purchase_notice);
        this.addForm.content = row.purchase_notice;
      },
      //编辑富文本
      isEditShow(index, row) {
        this.editShow = true;
      },
      //取消编辑
      cancelEditing() {
        // console.log(this.addForm.content);
        this.editShow = false;
        this.text = this.addForm.content;
      },
      submit() {
        this.addForm.content = this.text;
        this.editShow = false;
        this.$message.success('内容修改成功！');
        this.text = '';
      }
    },
    components: {
      quillEditor
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