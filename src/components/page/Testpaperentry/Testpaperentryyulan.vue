<template>
  <div class="table">
    <div class="crumbs">
      <!-- 选择题 -->
      <div class="container">
        <div class="handle-box">
          <el-select v-model="zhengshuval" placeholder="选择证书类型/级别" @change="selectType">
            <el-option v-for="item in zhengshutype" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="shenyueval" placeholder="选择审阅状态" @change="selectStatus">
            <el-option v-for="item in shenyuestatus" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="add" @click="qingchu">清除</el-button>
        </div>
        <el-table :data="list" border stripe max-height="400" style="width: 100%;" :row-class-name="tableRowClassName"
          ref="multipleTable" @selection-change="handleSelectionChange"
          :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
          <el-table-column type="selection" min-width="55" fixed></el-table-column>
          <el-table-column type="index" :index="indexMethod" min-width="80" fixed></el-table-column>
          <el-table-column prop="paper_no" label="试卷编号" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="subject" label="证书类型" min-width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="status" label="上线状态" min-width="100" :formatter="formatHome"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="check_status" label="审阅状态" min-width="100" :formatter="shenyuetext"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="check_person" label="审阅人" min-width="100" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="check_time" sortable label="审阅时间" min-width="180" :formatter="formatTime"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="create_time" sortable label="创建时间" min-width="180" :formatter="formatTime"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">审阅</el-button>
              <el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- -------分页------------- -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :page-size="100" layout="prev, pager, next"
            :total="this.total" background>
          </el-pagination>
        </div>
        <!--新增弹框-->
        <div class="categories-news" v-if="this.addFormVisible">
          <div class="categories-news-main">
            <div class="categories-news-title">
              <span>{{this.isEditForm?'审阅':'新增'}}</span>
              <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
            </div>
            <div class="categories-news-content">
              <el-form :model="addForm" ref="addForm" label-position="left" label-width="120px">
                <div class="title_jj">
                  <el-row>
                    <el-col :span="4">
                      <span>审核人:</span>
                    </el-col>
                    <el-col :span="8">
                      <el-input ref='shenhename' placeholder="请输入名字" v-model="shenheren" clearable>
                        style="width:30px;"
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
                <div class="title_zs">
                  <p>{{addForm.subject}}</p>
                </div>
                <div class="title_jj fubiaoti">
                  <span>{{ guizeText }}</span>
                </div>
                <div class="title_jj danxuanti">
                  <span>{{ danxuanText }}</span>
                </div>
                <ol id="list_ol">
                  <li v-for="(datay, index) in datas" :key="index" class="bianju">
                    <div class="lirou">
                      <p class="title_jj tigan">{{datay.content}}</p>
                      <p>
                        <span>选项A--</span>
                        {{datay.option_a}}
                      </p>
                      <p>
                        <span>选项B--</span>
                        {{datay.option_b}}
                      </p>
                      <p>
                        <span>选项C--</span>
                        {{datay.option_c}}
                      </p>
                      <p>
                        <span>选项D--</span>
                        {{datay.option_d}}
                      </p>
                      <p>
                        <span>正确答案==></span>
                        {{datay.answer}}
                      </p>
                    </div>
                  </li>
                </ol>
                <div class="title_jj danxuanti" v-if="this.duoxuandataShow">
                  <span>{{ duoxuanText }}</span>
                </div>
                <ol id="list_ol" :start='this.duoxuanStart'>
                  <li v-for="(datab, index) in duoxuandata" :key="index" class="bianju">
                    <div class="lirou">
                      <p class="title_jj tigan">{{datab.content}}</p>
                      <p>
                        <span>选项A--</span>
                        {{datab.option_a}}
                      </p>
                      <p>
                        <span>选项B--</span>
                        {{datab.option_b}}
                      </p>
                      <p>
                        <span>选项C--</span>
                        {{datab.option_c}}
                      </p>
                      <p>
                        <span>选项D--</span>
                        {{datab.option_d}}
                      </p>
                      <p>
                        <span>正确答案==></span>
                        {{datab.answer}}
                      </p>
                    </div>
                  </li>
                </ol>
                <div class="title_jj panduandata">
                  <span>{{ panduanText }}</span>
                </div>
                <ol id="list_ol" :start="this.panduanStart">
                  <li v-for="(datac, index) in panduandata" :key="index" class="bianju">
                    <div class="lirou">
                      <p class="title_jj tigan">{{datac.content}}</p>
                      <p>
                        <span>正确答案==></span>
                        {{datac.answer}}
                      </p>
                    </div>
                  </li>
                </ol>
                <div class="title_jj jiandadata">
                  <span>{{ jiandaText }}</span>
                </div>
                <ol id="list_ol" :start="this.jiandaStart">
                  <li v-for="(datad, index) in jiandadata" :key="index" class="bianju">
                    <div class="lirou">
                      <p class="title_jj tigan">{{datad.content}}</p>
                      <p class="myanswerBox">
                        <span>正确答案:</span><br />
                        {{datad.answer}}
                      </p>
                      <p>
                        <span>答案解析:</span><br />
                        {{datad.answer_desc}}
                      </p>
                    </div>
                  </li>
                </ol>
                <div class="title_jj zonghedata" v-if="this.zonghedataShow">
                  <span>{{ zongheText }}</span>
                </div>
                <ol id="list_ol" :start="this.zongheStart">
                  <li v-for="(dataf, index) in zonghedata" :key="index" class="bianju">
                    <div class="lirou">
                      <p class="title_jj tigan">{{dataf.content}}</p>
                      <p class="myanswerBox">
                        <span>正确答案:</span><br />
                        {{dataf.answer}}
                      </p>
                      <p>
                        <span>答案解析:</span><br />
                        {{dataf.answer_desc}}
                      </p>
                    </div>
                  </li>
                </ol>
                <div>
                  <el-select placeholder="是否上线" v-model="addForm.status" @change='statusChange'>
                    <el-option v-for="item in homeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form>
            </div>
            <div class="categories-news-button">
              <button @click="confirmAdd">确定</button>
              <button @click="addFormVisible = false">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getpanduanti,
    addpanduanti,
    putpanduanti,
    Deletepanduanti,
    searchpanduanti,
    createPaper,
    getPaperList,
    getPaperInfo,
    shangxianshijuan,
    shenyueDelete,
    selectTypeData,
    selectStatusData
  } from "../../../api/api";
  import {
    formatDate,
    handleCommonAvatarSuccess,
    handleCommonAudioSuccess
  } from "../../Utility/Utility";
  import { get } from "../../../api";
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
        paper_no: '',//试卷审核人
        checkresult: '',//审核状态 1通过 0未通过
        checkperson: '',//审核人
        status: '',//1上线 2下线
        zhengshuval: '',//证书筛选初始值
        shenyueval: '',//审阅状态筛选初始值
        guizeText: '规则',//试题规则
        danxuanText: '单选介绍',
        duoxuanText: '多选介绍',
        panduanText: '判断介绍',
        jiandaText: '简答介绍',
        zongheText: '综合介绍',
        statusVal: 0,
        select_cate: "",
        cur_page: 1,
        list: [],
        total: 0,
        size: 10,
        contentShow: false,
        //    editShow: false,
        text: "",
        pushtype: "1",
        shangxianData: {},
        datas: [],
        duoxuandata: [],
        panduandata: [],
        jiandadata: [],
        zonghedata: [],
        duoxuanStart: 0,
        panduanStart: 0,
        jiandaStart: 0,
        zongheStart: 0,
        zonghedataShow: false,
        duoxuandataShow: false,

        //选择题==新增界面是否显示
        addFormVisible: false,
        //判断题==新增界面是否显示
        addFormVisible_pd: false,
        //简答题==新增界面是否显示
        addFormVisible_jd: false,
        //综合题==新增界面是否显示
        addFormVisible_zh: false,
        //进度条是否显示
        //    progressVisible: false,
        progressPercent: 0,
        shenheren: '',
        //新增界面数据
        addForm: {
          check_person: '李大钊',
          certificate: 0, //证书类型
          paperlevel: "", //证书级别
          subject: "", //考试科目
          papermonth: "", //试卷考期
          papertime: "", //考试时间
          paper_total_score: "", //试卷总分
          paper_pass_score: "", //合格分数
          learn_time: "", //学习时长
          status: 0,
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
        recommendOptions: [
          {
            value: "单选",
            label: "单选"
          },
          {
            value: "多选",
            label: "多选"
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
        shenyuestatus: [
          {
            value: 0,
            label: "未审阅"
          },
          {
            value: 1,
            label: "已审阅"
          }
        ]
      };
    },
    created() {
      this.getData();
    },
    computed: {},
    methods: {
      indexMethod(index) {
        return index + 1;
      },
      qingchu() {
        this.getData();
        this.zhengshuval = "";
        this.shenyueval = "";
      },
      tableRowClassName(row) {
        return 'rowheight'
      },
      // 点击抽题,将当前选择的参数值赋值给addForm并提示
      //  buttonchouti(index, row) {
      //    this.addForm = {
      //      id: row.id,
      //      certificate: row.certificate,
      //      paperlevel: row.paperlevel,
      //      subject: row.subject,
      //      papermonth: row.papermonth,
      //      papertime: row.papertime,
      //      paper_total_score: row.paper_total_score,
      //      paper_pass_score: row.paper_pass_score,
      //      learn_time: row.learn_time
      //    };
      //    this.$confirm("是否抽选此类形体?", "提示", {
      //      confirmButtonText: "确定",
      //      cancelButtonText: "取消",
      //				cancelButtonClass: "btn-custom-cancel",
      //      type: "warning"
      //    })
      //      .then(() => {
      //        createPaper(this.addForm).then(res => {
      //          console.log(res);
      //        });
      //        this.$message({
      //          type: "success",
      //          message: "成功!"
      //        });
      //      })
      //      .catch(() => {
      //        this.$message({
      //          type: "info",
      //          message: "已取消"
      //        });
      //      });
      //  },
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData() {
        console.log(this.cur_page, this.size);
        await getPaperList(this.cur_page, this.size).then(res => {
          console.log(res);
          if (!res.data || res.data === [] || res.data.length === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1;
              this.getData();
            } else {
              this.list = [];
            }
          } else {
            this.list = res.data;
            if (res.data.count) {
              this.total = res.data.count;
            } else {
              this.total = res.data.length;
            }
          }
        });
        this.del_list = JSON.parse(JSON.stringify(this.list));
      },
      //分页导航
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
      //根据试题编号搜索---综合题

      search() {
        if (this.select_cate !== "") {
          searchpanduanti(parseInt(this.select_cate)).then(res => {
            if (res.data == null) {
              this.list = null;
            } else {
              this.list = JSON.parse(JSON.stringify(this.del_list));
              this.list.splice(0, this.list.length, res.data);
            }
          });
        } else {
          this.list = JSON.parse(JSON.stringify(this.del_list));
        }
      },
      //
      selectType(value) {
        console.log(value);
        selectTypeData(value).then(res => {
          this.list = res.data
          if (res.data.count) {
            this.total = res.data.count;
          } else {
            this.total = res.data.length;
          }
        })

      },
      selectStatus(value) {
        selectStatusData(value).then(res => {
          this.list = res.data
        })
      },


      //------删除试卷--------
      myDelete(index, row) {
        console.log(row.paper_no)
        // 新增删除提示
        var self = this;

        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning"
        })
          .then(() => {
            shenyueDelete(row.paper_no).then(res => {
              console.log(res);
              getPaperList(self.cur_page, self.size).then(res => {
                self.list = res.data
              })
            });

            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },

      //点击选中被删除项
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 确认按钮 点击
      statusChange(value) {
        this.statusVal = value;
        console.log(this.statusVal)
      },
      confirmAdd() {
        var self = this;
        var check_person = this.$refs.shenhename.value;
        console.log(check_person)
        self.shangxianData = {
          paperno: this.paper_no,//试卷编号
          checkperson: check_person,//审核人
          checkresult: 1,//审核状态
          status: this.statusVal//状态 上线/下线
        }
        this.$refs["addForm"].validate(valid => {
          console.log(valid)
          if (valid) {
            shangxianshijuan(self.shangxianData).then(res => {
              console.log(res)
              getPaperList(self.cur_page, self.size).then(res => {
                self.list = res.data
              })
            })
          }
        });
        this.addFormVisible = false
      },
      //点击审阅时
      handleEdit(index, row) {
        this.isEditForm = true;
        console.log(row)
        this.shenheren = row.check_person;
        self = this;
        if (row.certification_type == 1 || row.certification_type == 3) {
          this.zonghedataShow = false;
          this.duoxuandataShow = false;
          this.guizeText = '共分为三个部分，总分100分，答题时间120分钟'
          this.danxuanText = '单选题：'
          this.duoxuanText = ''
          this.panduanText = '判断题：'
          this.jiandaText = '简答题：'
          this.zongheText = ''
        } else if (row.certification_type == 4 || row.certification_type == 2) {
          this.zonghedataShow = true;
          this.duoxuandataShow = true;
          this.guizeText = '共分为五个部分，总分100分，答题时间120分钟'
          this.danxuanText = '单选题：'
          this.duoxuanText = '多选题：'
          this.panduanText = '判断题：'
          this.jiandaText = '简答题：'
          this.zongheText = '综合题：'
        }
        this.paper_no = row.paper_no;

        this.addForm = {
          id: row.id,
          paper_no: row.paper_no,
          subject: row.subject,
          status: row.status,
          paper_status: row.paper_status,
          check_person: row.check_person,
          check_time: row.check_time,
          create_time: row.create_time
        };
        var self = this;
        getPaperInfo(this.addForm.paper_no).then(res => {
          console.log(res.data);
          self.duoxuanStart = res.data.danxuandata.length + 1;
          self.panduanStart = res.data.danxuandata.length + res.data.duoxuandata.length + 1;
          self.jiandaStart = res.data.danxuandata.length + res.data.duoxuandata.length + res.data.panduandata.length + 1;
          self.zongheStart = res.data.danxuandata.length + res.data.duoxuandata.length + res.data.panduandata.length + res.data.jiandadata.length + 1;
          self.datas = res.data.danxuandata;
          self.duoxuandata = res.data.duoxuandata;
          self.panduandata = res.data.panduandata;
          self.jiandadata = res.data.jiandadata;
          self.zonghedata = res.data.zonghedata;

          console.log(self.duoxuanStart, self.panduanStart, self.jiandaStart, self.zongheStart)
          console.log(res.data.danxuandata)
        });
        this.addFormVisible = true;
      },
      //属性状态判断
      formatType: function (row, column, cellValue) {
        if (cellValue === 1) {
          return "单选";
        } else {
          return "多选";
        }
      },
      //home判断
      formatHome: function (row, column, cellValue) {
        if (cellValue == 0) {
          return "未上线";
        } else if (cellValue == 1) {
          return "已上线";
        }
      },
      shenyuetext: function (row, column, cellValue) {
        if (cellValue === 0) {
          return "未审阅";
        } else {
          return "已审阅";
        }
      },
      //创建时间
      formatTime: function (row, column, cellValue) {
        if (cellValue == null || cellValue == '' || cellValue == [] || cellValue == 0) {
          return '无'
        } else {
          return formatDate(cellValue);
        }
      }
    }
  }
</script>

<style scoped>
  .title_zs,
  .fubiaoti,
  .danxuanti,
  .panduandata,
  .duoxuandata,
  .panduandata {
    font-size: 18px;
  }

  .title_jj {
    margin: 10px 0;
  }

  .tigan {
    font-weight: bold;
    font-size: 16px;
  }

  #list_ol {
    margin-left: 20px;
  }

  .lirou p {
    font-size: 12px;
  }

  .myanswerBox {
    background: #eee;
    margin-bottom: 10px;
    border-radius: 5px;
    padding: 10px 10px;
  }

  .rowheight {
    height: 50px;
  }
</style>