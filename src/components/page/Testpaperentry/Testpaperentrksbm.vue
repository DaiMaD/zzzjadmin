<template>
  <div class="table">
    <div class="crumbs">
      <!-- 选择题 -->
      <div class="container">
        <div class="handle-box">
          <el-input
            style="width:180px"
            v-model="addForm.mobile"
            placeholder="手机号"
            ref="mobileInput"
          ></el-input>
          <el-select v-model="addForm.zhengshutype" placeholder="选择证书类型/级别" @change="changeTypebm">
            <el-option
              v-for="item in zhengshutype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" icon="add" @click="qingchu">清除</el-button>
          <el-button type="primary" icon="add" @click="exportExcel">导出</el-button>
          <!-- <el-button type="primary" icon="add" @click="handleAdd">新增</el-button> -->
        </div>
        <el-table
          :data="list"
          border
          stripe
          max-height="660"
          style="width: 100%;mso-number-format:'\@';"
          ref="multipleTable"
          :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}"
        >
          <el-table-column type="selection" fixed></el-table-column>
          <el-table-column type="index" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="name" label="学员姓名" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="mobile" label="手机号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="address" label="地址" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="address_detail" label="详细地址" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ID_number" label="身份证号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="photo" label="个人电子照片" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.photo" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="ID_photo_front" label="身份证正面照" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.ID_photo_front" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="ID_photo_back" label="身份证反面照" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.ID_photo_back" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="ID_photo_handheld" label="手持身份证照" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.ID_photo_handheld" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column
            prop="certification_type"
            label="证书类别/级别"
            :formatter="formatType"
            :show-overflow-tooltip="true"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="考试报名时间"
            :formatter="formatTime"
            :show-overflow-tooltip="true"
            width="150"
          ></el-table-column>
          <el-table-column prop="lefttimes" sortable label="剩余考试次数"></el-table-column>
        </el-table>
        <!-- -------分页------------- -->
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total"
          ></el-pagination>
        </div>
        <!--新增弹框-->
        <div class="categories-news" v-if="this.addFormVisible">
          <div class="categories-news-main">
            <div class="categories-news-title">
              <span>{{this.isEditForm?'修改':'新增'}}</span>
              <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
            </div>
            <div class="categories-news-content">
              <el-form :model="addForm" label-position="left" label-width="120px">
                <el-form-item label="学员姓名:" prop="name">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号:" prop="mobile">
                  <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="详细地址:" prop="address_detail">
                  <el-input v-model="addForm.address_detail"></el-input>
                </el-form-item>
                <el-form-item label="身份证号:" prop="ID_number">
                  <el-input v-model="addForm.ID_number"></el-input>
                </el-form-item>
                <el-form-item label="个人照片:" prop="photo">
                  <el-input v-model="addForm.photo"></el-input>
                </el-form-item>
                <el-form-item label="身份证照:" prop="ID_photo_front">
                  <el-input v-model="addForm.ID_photo_front"></el-input>
                </el-form-item>
                <el-form-item label="证书类型/级别:" prop="certification_type">
                  <el-input v-model="addForm.certification_type"></el-input>
                </el-form-item>
                <el-form-item label="剩余考试次数:" prop="lefttimes">
                  <el-input v-model="addForm.lefttimes"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="categories-news-button">
              <button @click="confirmAdd()">提交</button>
              <button @click="addFormVisible = false">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { quillEditor } from 'vue-quill-editor'
import {
  getpanduanti,
  addpanduanti,
  putpanduanti,
  Deletepanduanti,
  searchpanduanti,
  createPaper,
  getPaperList,
  getPaperInfo,
  paperScore,
  paperscoreid,
  commitUserPaper,
  cerBaoMing,
  postcerBaoMing,
  putcerBaoMing,
  deletecerBaoMing,
  selectPaperMobileData,
  selectPaperCertypeData
} from '../../../api/api'
import {
  formatDate,
  handleCommonAvatarSuccess,
  handleCommonAudioSuccess
} from '../../Utility/Utility'
import { get } from '../../../api'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
]
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (/^\s*$/.test(value)) {
        callback(new Error('请输入正确的内容,不可以是空格'))
      } else {
        callback()
      }
    }
    return {
      select_cate: '',
      cur_page: 1,
      list: [],
      total: 0,
      size: 10,
      allcount: 0,
      contentShow: false,
      editShow: false,
      text: '',
      pushtype: '1',
      fraction: [], //分数

      datas: [],
      duoxuandata: [],
      panduandata: [],
      jiandadata: [],
      zonghedata: [],

      //选择题==新增界面是否显示
      addFormVisible: false,
      //判断题==新增界面是否显示
      addFormVisible_pd: false,
      //简答题==新增界面是否显示
      addFormVisible_jd: false,
      //综合题==新增界面是否显示
      addFormVisible_zh: false,
      //进度条是否显示
      progressVisible: false,
      progressPercent: 0,
      //新增界面数据
      addForm: {
        id: '',
        user_id: '',
        certificate: 0, //证书类型
        paperlevel: '', //证书级别
        subject: '', //考试科目
        papermonth: '', //试卷考期
        papertime: '', //考试时间
        paper_total_score: '', //试卷总分
        paper_pass_score: '', //合格分数
        learn_time: '' //学习时长
      },
      addForm1: {
        user_id: '', //用户id
        papersocreid: '', //答题id
        checkperson: '', //阅卷人
        checkresult: '' //主观题得分数据
      },
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quillEditor.format('image', false)
                }
              }
            }
          }
        }
      },
      isEditForm: false, //是否是编辑页面
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
      ], //付费属性
      typesOptions: [
        {
          value: 1,
          label: '金融管理师'
        },
        {
          value: 2,
          label: '金融理财师'
        }
      ],
      //是否推荐
      recommendOptions: [
        {
          value: '单选',
          label: '单选'
        },
        {
          value: '多选',
          label: '多选'
        }
      ],
      //是否推荐上首页/  home
      homeOptions: [
        {
          value: 0,
          label: '下线'
        },
        {
          value: 1,
          label: '上线'
        }
      ],
      zhengshutype: [
        {
          value: 1,
          label: '互联网金融管理师初级'
        },
        {
          value: 2,
          label: '互联网金融管理师中级'
        },
        {
          value: 3,
          label: '互联网金融理财师初级'
        },
        {
          value: 4,
          label: '互联网金融理财师中级'
        }
      ],
      shenyuestatus: [
        {
          value: 0,
          label: '未审阅'
        },
        {
          value: 1,
          label: '以审阅'
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  computed: {},
  methods: {
    qingchu() {
      this.addForm.shenyuestatus = ''
      this.addForm.mobile = ''
      this.getData()
    },
    // 导出Excel功能
    exportExcel() {
      console.log(XLSX)
      var self = this
      new Promise(function(resolve, reject) {
        cerBaoMing(1, self.allcount).then(res => {
          self.list = res.data.data
          self.size = res.data.count
          self.total = 1
          resolve()
        })
      }).then(res => {
        var fix = document.querySelector('.el-table__fixed')
        var wb = XLSX.utils.table_to_book(
          document.querySelector('.el-table').removeChild(fix),
          { raw: true }
        )
        document.querySelector('.el-table').appendChild(fix)
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            '考试报名.xlsx'
          )
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        this.size = 10
        this.total = 0
        cerBaoMing(this.cur_page, this.size).then(res => {
          self.list = res.data.data
        })
        return wbout
      })
    },
    indexMethod(index) {
      return index + 1
    },
    //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
    async getData() {
      console.log(this.cur_page, this.size)
      await cerBaoMing(this.cur_page, this.size).then(res => {
        console.log(res)
        if (
          !res.data.data ||
          res.data.data === [] ||
          res.data.data.length === 0
        ) {
          if (this.cur_page - 1 > 0) {
            this.cur_page -= 1
            this.getData()
          } else {
            this.list = []
          }
        } else {
          this.list = res.data.data
          this.total = res.data.count
          this.allcount = res.data.count
        }
      })
      this.del_list = JSON.parse(JSON.stringify(this.list))
    },
    changeTypebm(value) {
      console.log(value)
      selectPaperCertypeData(value).then(res => {
        this.list = res.data
      })
    },
    // 新增
    handleAdd() {
      this.select_cate = ''
      this.isEditForm = false
      this.addForm = {
        name: '', //总代姓名
        mobile: '', //手机号
        ID_number: '',
        address: '', //
        address_detail: '', //
        photo: '', //
        ID_photo_front: '', //
        ID_photo_back: '', //
        lefttimes: 0
      }
      this.addFormVisible = true
    },
    //点击批改时
    handleEdit(index, row) {
      this.isEditForm = true
      this.addForm = {
        id: row.id,
        name: row.name,
        mobile: row.mobile,
        ID_number: row.ID_number,
        address: row.address,
        address_detail: row.address_detail,
        photo: row.photo,
        ID_photo_front: row.ID_photo_front,
        ID_photo_back: row.ID_photo_back,
        lefttimes: row.lefttimes
      }
      paperscoreid(this.addForm.id).then(res => {
        this.datas = res.data.danxuandata
        this.duoxuandata = res.data.duoxuandata
        this.panduandata = res.data.panduandata
        this.jiandadata = res.data.jiandadata
        this.zonghedata = res.data.zonghedata
      })
      this.addFormVisible = true
    },
    //批改弹窗 确认按钮 点击
    confirmAdd() {
      if (this.isEditForm) {
        this.myPuhhrChange()
      } else {
        this.myhhrAdd()
      }
    },
    myhhrAdd() {
      postcerBaoMing(this.addForm).then(res => {
        if (res.success === true) {
          this.addFormVisiblehhr = false
          this.getData()
        } else {
          this.$message({
            message: res.data,
            type: 'error'
          })
        }
      })
    },
    //分页导航
    handleCurrentChange(val) {
      this.cur_page = val
      this.getData()
    },
    handleSizeChange(val) {
      this.size = val
      this.getData()
      //	  		document.getElementById("table").setAttribute("style","height: 1100px !important");
    },
    //根据试题编号搜索---选择题

    search() {
      //    if (this.select_cate !== "") {
      //      searchpanduanti(parseInt(this.select_cate)).then(res => {
      //        if (res.data == null) {
      //          this.list = null;
      //        } else {
      //          this.list = JSON.parse(JSON.stringify(this.del_list));
      //          this.list.splice(0, this.list.length, res.data);
      //        }
      //      });
      //    } else {
      //      this.list = JSON.parse(JSON.stringify(this.del_list));
      //    }

      var mobileVal = this.$refs.mobileInput.value
      console.log(mobileVal)
      selectPaperMobileData(mobileVal).then(res => {
        if (res.data != '' && res.data != null) {
          this.list = res.data
        }
      })
    },

    //下拉框/时间值处理
    //批改状态
    formatStatus: function(row, column, cellValue) {
      if (cellValue === 0) {
        return '未批改'
      } else {
        return '已批改'
      }
    },
    //属性状态判断
    formatType: function(row, column, cellValue) {
      if (cellValue === 1) {
        return '互联网金融管理师初级'
      } else if (cellValue === 2) {
        return '互联网金融管理师中级'
      } else if (cellValue === 3) {
        return '互联网金融理财师初级'
      } else if (cellValue === 4) {
        return '互联网金融理财师中级'
      }
    },
    //推荐判断
    formatRecommend: function(row, column, cellValue) {
      if (cellValue === 1) {
        return '金融管理师'
      } else {
        return '金融理财师'
      }
    },
    //home判断
    formatHome: function(row, column, cellValue) {
      if (cellValue === 0) {
        return '否'
      } else {
        return '是'
      }
    },
    //时间
    formatTime: function(row, column, cellValue) {
      if (cellValue == null || cellValue == '' || cellValue == []) {
        return '无'
      } else {
        return formatDate(cellValue)
      }
    },
    //详情
    isContentShow(index, row) {
      this.contentShow = true
      console.log('hang', row)
      console.log(row.content)
      this.addForm.content = row.content
    },
    //编辑富文本
    isEditShow(index, row) {
      this.editShow = true
    },

    //取消编辑
    cancelEditing() {
      console.log(this.addForm.content)
      this.editShow = false
      this.text = this.addForm.content
    },

    submit() {
      this.addForm.content = this.text
      this.editShow = false
      this.$message.success('内容修改成功！')
      this.text = ''
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped>
input {
  margin: 2px;
}
.title_zs,
.fubiaoti,
.danxuanti {
  font-size: 18px;
}
.tigan {
  font-weight: bold;
  font-size: 16px;
}
.shnehename span {
  font-size: 18px;
}
#list_ol {
  margin-left: 20px;
}

.lirou p {
  font-size: 14px;
}
.el-input--small .el-input__inner {
}
.title_jj {
  margin: 10px 0;
}
</style>
