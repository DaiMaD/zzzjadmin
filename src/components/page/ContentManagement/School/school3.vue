<template>
  <div class="table">

    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>


        <el-input size="medium" v-model="keywords" placeholder="请输入查询关键词" class="handle-select mr10" clearable>
        </el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <div class="addbtn">
          <el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
            <i class="el-icon-info addbtn2"></i>
          </el-tooltip>
          <el-button type="primary" icon="add" @click="handleAdd" class="">新增</el-button>
        </div>
      </div>

      <el-table :data="list" border max-height="680" style="width: 100%" ref="multipleTable"
        @selection-change="handleSelectionChange"
        :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column prop="id" label="课程ID" min-width="60" fixed></el-table-column>
        <el-table-column prop="name" label="课堂名" min-width="100" fixed :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="speechmaker" label="主讲人" min-width="100"></el-table-column>
        <el-table-column prop="content" label="内容" min-width="100">
          <template slot-scope="scope">
            <span @click="isContentShow(scope.$index, scope.row)" style="cursor: pointer">点击查看详情</span>
          </template>
        </el-table-column>
        <el-table-column prop="viewed_num" label="观看人数" min-width="100"></el-table-column>
        <el-table-column prop="cover_img" label="套课纵图" min-width="100">
          <template slot-scope="scope">
            <a :href="scope.row.cover_img" target="true"><img :src="scope.row.cover_img" height="90%" /></a>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="上线状态" min-width="70" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="ori_price" label="原始价格" min-width="70"></el-table-column>
        <el-table-column prop="sale_price" label="销售价格" min-width="70"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="200" :formatter="formatTime"></el-table-column>
        <el-table-column prop="update_time" label="修改时间" min-width="200" :formatter="formatTime"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
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

      <!--新增弹框-->
      <div class="categories-news" v-if="this.addFormVisible">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <span>{{this.isEditForm?'修改':'新增'}}</span>
            <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
          </div>
          <div class="categories-news-content">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="120px">
              <el-form-item label="课程名:" prop="name">
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
              <el-form-item label="主讲人:" prop="speechmaker">
                <el-input v-model="addForm.speechmaker"></el-input>
              </el-form-item>
              <el-form-item label="主讲人身份职位:" prop="position">
                <el-input v-model="addForm.position" width="90"></el-input>
              </el-form-item>
              <el-form-item label="商学院缩略图:" prop="avatar">
                <el-input v-model="addForm.avatar"></el-input>
                <el-button @click="selectMedia" type="primary" class="selectFileBtn">选取文件</el-button>
              </el-form-item>
              <el-form-item label="商学院头图:" prop="banner">
                <el-input v-model="addForm.banner"></el-input>
                <el-button @click="selectMedia2" type="primary" class="selectFileBtn">选取文件</el-button>
              </el-form-item>
              <el-form-item label="套课纵图:" prop="cover_img">
                <el-input v-model="addForm.cover_img"></el-input>
                <el-button @click="selectMedia3" type="primary" class="selectFileBtn">选取文件</el-button>
              </el-form-item>
              <el-form-item label="新课上架图:" prop="xksj_img">
                <el-input v-model="addForm.xksj_img"></el-input>
                <el-button @click="selectMedia4" type="primary" class="selectFileBtn">选取文件</el-button>
              </el-form-item>
              <el-form-item label="分享链接:" prop="shareURL">
                <el-input v-model="addForm.shareURL"></el-input>
              </el-form-item>
              <el-form-item label="分享ID:">
                <el-input v-model="addForm.uuid"></el-input>
              </el-form-item>
              <el-form-item label="内容:" prop="content">
                <template slot-scope="scope">
                  <span @click="isEditShow(scope.$index, scope.row)" style="cursor: pointer">点击编辑内容</span>
                </template>
              </el-form-item>

              <el-form-item label="所属分类ID:" prop="categoryid">
                <el-input v-model.number="addForm.categoryid"></el-input>
              </el-form-item>

              <!-- 标签 -->
              <el-form-item label="套课标签:" prop="lables">
                <el-checkbox-group v-model="lablesdata" size="mini">
                  <el-checkbox v-for="(lis) in dlist" :key="lis.lable_name" :label='lis.lable_name' border
                    @change="clickindex(lis)"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="观看人数:" prop="viewed_num">
                <el-input v-model="addForm.viewed_num"></el-input>
              </el-form-item>

              <el-form-item label="上线状态:" prop="status">
                <el-select v-model="addForm.status">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="是否推荐:" prop="recommend">
                <el-select v-model="addForm.recommend">
                  <el-option v-for="item in recommendOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="是否推荐上首页:" prop="home">
                <el-select v-model="addForm.home">
                  <el-option v-for="item in homeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="购买次数:" prop="buy_times">
                <el-input v-model="addForm.buy_times"></el-input>
              </el-form-item>

              <el-form-item label="原始价格:" prop="ori_price">
                <el-input type="number" v-model="addForm.ori_price"></el-input>
              </el-form-item>

              <el-form-item label="销售价格:" prop="sale_price">
                <el-input type="number" v-model="addForm.sale_price"></el-input>
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
            <el-upload class="avatar-uploader uploader-none" :show-file-list="false" action=""
              :on-change="handleTextImageSuccess" :auto-upload="false">
              <!--:on-success="uploadSuccess"-->
              <!--:on-error="uploadError"-->
              <!--:before-upload="beforeUpload"-->
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

      <media-select v-if="isSelect" @close="closeMedia" @overSelectMedia="overSelectMedia"
        @overSelectFile="overSelectFile"></media-select>
      <media-select v-if="isSelect2" @close="closeMedia" @overSelectMedia="overSelectMedia2"
        @overSelectFile="overSelectFile2"></media-select>
      <media-select v-if="isSelect3" @close="closeMedia" @overSelectMedia="overSelectMedia3"
        @overSelectFile="overSelectFile3"></media-select>
      <media-select v-if="isSelect4" @close="closeMedia" @overSelectMedia="overSelectMedia4"
        @overSelectFile="overSelectFile4"></media-select>
      <!--进度条弹框-->
      <div class="categories-news" v-if="this.progressVisible">
        <!--<el-progress :text-inside="true" :stroke-width="18" :percentage="this.progressPercent"></el-progress>-->

        <el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>
      </div>

    </div>
  </div>
</template>

<script>
  // import 'quill/dist/quill.core.css';
  // import 'quill/dist/quill.snow.css';
  // import 'quill/dist/quill.bubble.css';
  import { quillEditor } from 'vue-quill-editor';
  import { postsxycourseupdate, deletesxycourse, postsxycour, postCoursesList, getPicURL, postsxycourse, Viewlabel, GetLables, searchAll } from '../../../../api/api';
  import { formatDate, handleCommonAvatarSuccess } from '../../../Utility/Utility';

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
          callback(new Error('请输入正确的内容,不可以是空格'));
        } else {
          callback();
        }
      };
      return {
        isSelect: false,
        isSelect2: false,
        isSelect3: false,
        isSelect4: false,
        select_cate: '',
        cur_page: 1,
        list: [],
        total: 0,
        size: 10,
        contentShow: false,
        editShow: false,
        text: '',
        checked6: false,
        checcc: '',
        lablesdata: [],
        dlist: [],

        keywords: '',
        parentid: 2,
        //名称不能为空
        addFormRules: {
          name: [
            { required: true, message: '名称字段不能为空' },
            { validator: validateName, trigger: 'blur' }
          ],
          speechmaker: [
            { required: true, message: '讲师名称不能为空' },
            { validator: validateName, trigger: 'blur' }
          ],

          ori_price: [
            { required: true, message: '原始价格不能为空' },
            { validator: validateName, trigger: 'blur' }
          ],

          sale_price: [
            { required: true, message: '销售价格不能为空' },
            { validator: validateName, trigger: 'blur' }
          ],

        },



        //新增界面是否显示
        addFormVisible: false,

        //进度条是否显示
        progressVisible: false,
        progressPercent: 0,

        //新增界面数据
        addForm: {
          uuid: '',
          name: '',
          speechmaker: '',
          position: '',
          avatar: '',
          banner: '',
          content: '',
          categoryid: 0,
          shareURL: '',
          status: 0,
          recommend: 0,
          home: 0,
          buy_times: 0,
          ori_price: '',
          sale_price: '',
          lables: '',
          cover_img: '',
          xksj_img: '',
          viewed_num: '',
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
            label: '下线'
          },
          {
            value: 1,
            label: '上线'
          }
        ],
        //是否推荐
        recommendOptions: [{
          value: 0,
          label: '否'
        }, {
          value: 1,
          label: '是'
        }],
        //是否推荐上首页/  home
        homeOptions: [{
          value: 0,
          label: '否'
        }, {
          value: 1,
          label: '是'
        }],
      }
    },
    created() {
      this.getData();
      var _this = this;
      document.onkeydown = function (event) {
        var e = window.event || arguments.callee.caller.arguments[0];
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
      closeMedia() {
        this.isSelect = false
        this.isSelect2 = false
        this.isSelect3 = false
        this.isSelect4 = false
      },
      selectMedia() {
        this.isSelect = true;
      },
      selectMedia2() {
        this.isSelect2 = true;
      },
      selectMedia3() {
        this.isSelect3 = true;
      },
      selectMedia4() {
        this.isSelect4 = true;
      },
      overSelectMedia(str) {
        this.addForm.avatar = str
      },
      overSelectFile(str) {
        this.addForm.avatar = str
      },
      overSelectMedia2(str) {
        this.addForm.banner = str
      },
      overSelectFile2(str) {
        this.addForm.banner = str
      },
      overSelectMedia3(str) {
        this.addForm.cover_img = str
      },
      overSelectFile3(str) {
        this.addForm.cover_img = str
      },
      overSelectMedia4(str) {
        this.addForm.xksj_img = str
      },
      overSelectFile4(str) {
        this.addForm.xksj_img = str
      },
      //富文本上传图片
      handleTextImageSuccess(file, fileList) {
        console.log(file.name + file.size);
        if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
          file.name = Number(new Date()) + `${/\.(jpg|jpeg|png)$/.exec(file.name)[0]}`;
          var _this = this;
          this.progressVisible = true;
          let quill = this.$refs.myQuillEditor.quill;
          var complete = function (res) {
            if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
              getPicURL(res.key).then((res) => {
                console.log(res.data);
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
      async getData() {
        await postsxycour(this.cur_page, this.size).then(res => {
          console.log(res.data);
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
      handleSizeChange(val) {
        this.size = val
        this.getData();
        document.getElementById("table").setAttribute("style", "height: 1100px !important");
      },
      //搜索
      search() {
        if (this.keywords !== '') {
          searchAll(this.parentid, this.keywords, this.cur_page, this.size).then(res => {
            console.log(res.data.data)
            if (res.data == null) {
              this.list = null
            } else {
              this.list = res.data.data
              console.log(this.list);
            }
          });
        } else {
          this.list = JSON.parse(JSON.stringify(this.del_list))//parse 用于从一个字符串中解析出json 对象,stringify用于从一个对象解析出字符串
          console.log(this.list)
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

          deletesxycourse(row.id).then((res) => {
            if (res.success === true) {
              this.select_cate = "";
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

        postCoursesList(str).then((res) => {
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
          name: '',
          speechmaker: '',
          position: '',
          avatar: '',
          banner: '',
          content: '',
          categoryid: 0,
          shareURL: '',
          status: 0,
          recommend: 0,
          home: 0,
          buy_times: 0,
          ori_price: '',
          sale_price: '',
          lables: '',
          cover_img: '',
          xksj_img: '',
          viewed_num: '',
        };
        this.addFormVisible = true;
        //标签查看列表
        GetLables().then(res => {
          if (!res.data || res.data === [] || res.data.length === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.dlist = []
            }
          } else {
            this.dlist = res.data;
            console.log(this.dlist)
          }
        });
      },
      //标签
      clickindex(lis) {
        this.addForm.lables = (this.lablesdata).join(';')
        console.log(this.addForm.lables);
      },

      //新增
      myPostCoursesAdd() {
        postsxycourse(this.addForm).then((res) => {
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
      //新增弹框 确认按钮 点击
      confirmAdd() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            if (this.isEditForm) {
              console.log(1);
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
          uuid: row.uuid,
          id: row.id,
          name: row.name,
          status: row.status,
          speechmaker: row.speechmaker,
          position: row.position,
          avatar: row.avatar,
          banner: row.banner,
          content: row.content,
          categoryid: row.categoryid,
          shareURL: row.shareURL,
          recommend: row.recommend,
          home: row.home,
          buy_times: row.buy_times,
          ori_price: row.ori_price,
          sale_price: row.sale_price,
          lables: row.lables,
          cover_img: row.cover_img,
          xksj_img: row.xksj_img,
          viewed_num: row.viewed_num,
        };
        this.addFormVisible = true;
        //标签查看列表
        GetLables().then(res => {
          if (!res.data || res.data === [] || res.data.length === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.dlist = []
            }
          } else {
            this.dlist = res.data;
            console.log(this.dlist)
          }
        });
      },
      //标签
      clickindex(lis) {
        this.addForm.lables = (this.lablesdata).join(';')
        console.log(this.addForm.lables);
      },
      //修改
      myPutCoursesChange() {
        postsxycourseupdate(this.addForm, this.addForm.id).then((res) => {
          console.log(res);
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
          return '不可用';
        } else {
          return '可用';
        }
      },


      //推荐判断
      formatRecommend: function (row, column, cellValue) {
        if (cellValue === 0) {
          return '否'
        } else {
          return '是'
        }

      },


      //home判断
      formatHome: function (row, column, cellValue) {
        if (cellValue === 0) {
          return '否';
        } else {
          return '是';
        }

      },


      //时间
      formatTime: function (row, column, cellValue) {
        return formatDate(cellValue)
      },


      //详情
      isContentShow(index, row) {
        this.contentShow = true;
        console.log('hang', row);
        console.log(row.content);
        this.addForm.content = row.content;
      },


      //编辑富文本
      isEditShow(index, row) {
        this.editShow = true;
      },


      //取消编辑
      cancelEditing() {
        console.log(this.addForm.content);
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