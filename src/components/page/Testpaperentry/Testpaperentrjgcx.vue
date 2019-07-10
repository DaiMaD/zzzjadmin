<template>
  <div class="table">
    <div class="crumbs">
      <!--<el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>题库管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>考试结果查询</el-breadcrumb-item>
      </el-breadcrumb>-->
      <!-- 选择题 -->
      <div class="container">
        <div class="handle-box">
          <el-input v-model="mobile" placeholder="手机号" style="width:180px;" ref='jieguoMobile'></el-input>
          <el-select v-model="addForm.zhengshutype" placeholder="选择证书类型/级别" @change='changeType'>
            <el-option
              v-for="item in zhengshutype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="addForm.examIspass" placeholder="选择考试结果状态" @change='changePass'>
            <el-option
              v-for="item in examIspass"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="" @click="qingchu">清除</el-button>
          <el-button type="primary" icon="add" @click="exportExcel">导出</el-button>
        </div>
        <el-table :data="list" border stripe max-height="680" style="width: 100%" ref="multipleTable" :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
          <el-table-column type="selection" min-width="55" fixed></el-table-column>
          <el-table-column type="index" min-width="80" fixed></el-table-column>
          <el-table-column prop="name" label="学员姓名" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="user_mobile" label="手机号" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="subject" label="证书类别/级别" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="study_time" label="学习时长(分)" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="exam_time" label="正式考试时间" min-width="100" :formatter="formatTime" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="use_time" label="答题时长(分)" min-width="100" :formatter="formaExamtime" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="is_pass" label="考试结果" min-width="100" :formatter="formatRecommend" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            prop="certification_status"
            label="证书发放状态"
            width="100"
            :formatter="formatType"
          ></el-table-column>
          <el-table-column
            prop="certification_set_time"
            label="证书发放时间"
            width="100"
            :formatter="formatTime"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <!-- <el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
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
                <el-form-item label="证书发放状态:" prop="certification_status">
                  <el-select v-model="addForm.certification_status">
                    <el-option
                      v-for="item in ddtypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  inline
                  label="发放时间:"
                  prop="certification_set_time"
                  class="inline-block"
                >
                  <div class="inline-block">
                    <span class="demonstration"></span>
                    <el-date-picker
                      v-model="addForm.certification_set_time"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="timestamp"
                    ></el-date-picker>
                  </div>
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
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { quillEditor } from "vue-quill-editor";
import {
  getPaperInfo,
  getexamResult,
  postexamResult,
  putexamResult,
  selectMobileJg,
  selectTypeJg,
  selectPassJg
} from "../../../api/api";
import {
  formatDate,
  handleCommonAvatarSuccess,
  handleCommonAudioSuccess
} from "../../Utility/Utility";
import { get } from "../../../api";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (/^\s*$/.test(value)) {
        callback(new Error("请输入正确的内容,不可以是空格"));
      } else {
        callback();
      }
    };
    return {
    	mobile:'',
      select_cate: "",
      cur_page: 1,
      list: [],
      total: 0,
      size: 10,
      contentShow: false,
      editShow: false,
      text: "",
      pushtype: "1",

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
        name: "",
        user_mobile: 0, //手机号
        subject: "", //证书级别
        study_time: "", //学习时长
        exam_time: "", //正式考试时间
        use_time: "", //答题时长
        is_pass: "", //考试结果
        certification_status: "", //证书发放状态
        certification_set_time: "" //发放时间
      },
      editorOption: {
        placeholder: "",
        theme: "snow" // or 'bubble'
      },

      isEditForm: false, //是否是编辑页面
      //分类状态
      statusOptions: [
        {
          value: 0,
          label: "不可用"
        },
        {
          value: 1,
          label: "可用"
        }
      ], //付费属性
      typesOptions: [
        {
          value: 1,
          label: "金融管理师"
        },
        {
          value: 2,
          label: "金融理财师"
        }
      ],
      //是否推荐
      ddtypeOptions: [
        {
          value: 0,
          label: "未发放"
        },
        {
          value: 1,
          label: "已发放"
        }
      ],
      //是否推荐上首页/  home
      homeOptions: [
        {
          value: 0,
          label: "下线"
        },
        {
          value: 1,
          label: "上线"
        }
      ],
      zhengshutype: [
        {
          value: "互联网金融管理师初级",
          label: "互联网金融管理师初级"
        },
        {
          value: "互联网金融管理师中级",
          label: "互联网金融管理师中级"
        },
        {
          value: "互联网金融理财师初级",
          label: "互联网金融理财师初级"
        },
        {
          value: "互联网金融理财师中级",
          label: "互联网金融理财师中级"
        }
      ],
      examIspass: [
        {
          value: 0,
          label: "未通过"
        },
        {
          value: 1,
          label: "已通过"
        }
      ]
    };
  },
  methods: {

    // 导出Excel功能
    exportExcel() {
      console.log(XLSX)
      var self = this;
      new Promise(function (resolve,reject) {
      	getexamResult(1, self.allcount).then(res =>{
	     	self.list = res.data.data;
	     	self.size = res.data.count;
	     	self.total = 1;
	     	resolve()
	     })
      }).then(res =>{
      	var fix = document.querySelector('.el-table__fixed');
     /* generate workbook object from table */
//  	  let xlsxParam = { raw: true };
      var wb = XLSX.utils.table_to_book(document.querySelector(".el-table").removeChild(fix),{ raw: true });
      document.querySelector(".el-table").appendChild(fix);
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "考试结果.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      this.size = 10;
      this.total = 0;
      getexamResult(this.cur_page, this.size).then(res =>{
     	self.list = res.data.data;
     })
      return wbout;
      })
     
    },



    //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
    async getData() {
      await getexamResult(this.cur_page, this.size).then(res => {
        console.log(res);
        if (
          !res.data.data ||
          res.data.data === [] ||
          res.data.data.length === 0
        ) {
          if (this.cur_page - 1 > 0) {
            this.cur_page -= 1;
            this.getData();
          } else {
            this.list = [];
          }
        } else {
          this.list = res.data.data;
          if (res.data.count) {
            this.total = res.data.count;
          }else{
          		this.total = res.data.data.length;
          }
        }
      });
      this.del_list = JSON.parse(JSON.stringify(this.list));
    },
    qingchu(){
    	this.mobile = '';
    	this.addForm.examIspass = '';
    	this.addForm.zhengshutype = '';
    	this.getData();
    },
    // 新增
    handleAdd() {
      this.select_cate = "";
      this.isEditForm = false;
      this.addForm = {
        name: "",
        user_mobile: 0, //手机号
        subject: "", //证书级别
        study_time: "", //学习时长
        exam_time: "", //正式考试时间
        use_time: "", //答题时长
        is_pass: "", //考试结果
        certification_status: "", //证书发放状态
        certification_set_time: "" //发放时间
      };
      this.addFormVisible = true;
    },
    //点击批改时
    handleEdit(index, row) {
      console.log(row);
      this.isEditForm = true;
      this.addForm = {
        id: row.id,
        certification_status: row.certification_status,
        certification_set_time: row.certification_set_time
      };
      this.addFormVisible = true;
    },
    //批改弹窗 确认按钮 点击
    confirmAdd() {
      if (this.isEditForm) {
        this.myPuhhrChange();
      } else {
        this.myhhrAdd();
      }
    },
    myPuhhrChange() {
      putexamResult(this.addForm, this.addForm.id).then(res => {
        if (res.success === true) {
          this.addFormVisible = false;
          this.getData();
        } else {
          this.$message({ message: res.data, type: "error" });
        }
      });
    },
    myhhrAdd() {
      postexamResult(this.addForm).then(res => {
        if (res.success === true) {
          this.addFormVisible = false;
          this.getData();
        } else {
          this.$message({
            message: res.data,
            type: "error"
          });
        }
      });
    },
    //分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleSizeChange(val){
	  		this.size = val
	  		this.getData();
	  },
    //根据试题编号搜索---选择题

    search() {
      var jieguoMobile = this.$refs.jieguoMobile.value;
      selectMobileJg(jieguoMobile).then(res =>{
      	this.list = res.data;
      })
    },
		changeType(value){
			console.log(value)
			selectTypeJg(value).then(res =>{
				console.log(res)
				this.list = res.data
			})
		},
		changePass(value){
			console.log(value)
			selectPassJg(value).then(res =>{
				this.list = res.data
				console.log(res)
			})
		},
    //下拉框/时间值处理
    //批改状态
    formatStatus: function(row, column, cellValue) {
      if (cellValue === 0) {
        return "未批改";
      } else {
        return "已批改";
      }
    },
    //属性状态判断
    formatType: function(row, column, cellValue) {
      if (cellValue === 0) {
        return "未发放";
      } else {
        return "已发放";
      }
    },
    //推荐判断
    formatRecommend: function(row, column, cellValue) {
      if (cellValue === 1) {
        return "已通过";
      } else {
        return "未通过";
      }
    },
    //home判断
    formatHome: function(row, column, cellValue) {
      if (cellValue === 0) {
        return "否";
      } else {
        return "是";
      }
    },
    //时间
    formatTime: function(row, column, cellValue) {
      if(cellValue == null || cellValue == '' || cellValue == []){
					return '无'
				}else{
					return formatDate(cellValue);
				}
    },
    formaExamtime:function(row, column, cellValue) {
    			return Math.ceil(cellValue/60)
    },
    //详情
    isContentShow(index, row) {
      this.contentShow = true;
      console.log("hang", row);
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
      this.$message.success("内容修改成功！");
      this.text = "";
    }
  },
  mounted() {
    this.getData();
  },
  computed: {},
  components: {
    quillEditor
  }
};
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
