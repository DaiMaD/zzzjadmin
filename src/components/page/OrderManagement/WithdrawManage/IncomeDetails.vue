<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-input size="medium" label="手机号" v-model="mobile" placeholder="请输入手机号" class="handle-select mr10" clearable>
        </el-input>
        <el-button type="primary" icon="search" fixed="right" @click="search">查询</el-button>
        <el-button type="info" icon="add" @click="qingchu">清除</el-button>
        <el-button type="primary" fixed="right" @click="exportExcel">导出</el-button>
      </div>
      <el-table :data="list" border min-height="400" max-height="600" style="width: 100%" ref="multipleTable"
        :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}" class="el-table2">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <!-- <el-table-column type="index" :index="indexMethod" width="80" fixed></el-table-column> -->
        <!-- <el-table-column prop="id" label="id" width="100"></el-table-column> -->
        <el-table-column prop="name" label="用户名" min-width="200"></el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="300"></el-table-column>
        <el-table-column prop="goldcoin_change" label="收益金额" min-width="300"></el-table-column>
        <!-- <el-table-column prop="order_type" label="提现方式" width="300"></el-table-column> -->
        <el-table-column prop="coursename" label="来源课程" min-width="300" :formatter="formatCourse"></el-table-column>
        <el-table-column prop="create_time" label="入账时间" min-width="300" :formatter="formatTime"></el-table-column>
      </el-table>

      <!-- -------分页------------- -->
      <div class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10"
          layout="total, sizes, prev, pager, next, jumper" :total="this.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import {
    goldCoinLogDetail,
    goldCoinLog,
    companyPay2,
    companypayCheckBack,
    getByCheckStatus,
    getByCompanyPayTime,
    goldCoinLogDetailByMobile
  } from "../../../../api/api";
  import {
    formatDate,
    handleCommonAvatarSuccess,
    datetime_to_unix
  } from "../../../Utility/Utility";
  import { get } from "../../../../api";
  export default {
    data() {
      return {
        id: "",
        radio: "1",
        list: [],
        list1: [],
        dlist: [],
        cur_page: 1,
        total: 0,
        currentPage: 1,
        size: 10,
        userid: 0,
        mobile: "",
        starttime: "",
        endtime: "",

        checkstatus: "", //搜索参数

        datay: { id: "" },
        addFormVisible: false,
        //当夜内容展示
        addForm: {
          pushtitle: "",
          pushcontent: ""
        },
        //订单来源
        ddlyOptions: [
          {
            value: 0,
            label: "全部"
          },
          {
            value: 1,
            label: "Android"
          },
          {
            value: 2,
            label: "iOS"
          },
          {
            value: 3,
            label: "小程序"
          }
        ]
      };
    },
    mounted() {

    },
    created() {
      this.getData();
    },

    methods: {
      //当选择栏状态改变时,重置当前页面导航下标
      fenye() {
        this.cur_page = 1;
        console.log(this.cur_page);
      },
      qingchu() {
        this.getData();
        this.mobile = "";
        this.checkstatus = "";
        this.starttime = "";
        this.endtime = "";
      },
      handleSizeChange(val) {
        this.size = val
        this.getData();
      },
      //提现搜索
      search() {
        // 手机号
        if (this.mobile !== "") {
          goldCoinLogDetailByMobile(this.mobile, this.cur_page, this.size).then(res => {
            console.log(this.mobile);
            console.log(res);
            if (!res.data || res.data === [] || res.data === 0) {
              if (this.cur_page - 1 > 0) {
                this.cur_page -= 1;
                this.getData();
              } else {
                this.list = [];
              }
            } else {
              this.list = res.data.result;
              if (res.data.count) {
                this.total = res.data.count;
              }
            }
          }).catch(function () {
            alert('手机号查询无结果')
          });
          // 状态
        } else {
          // 中国标准时间转换成yyyy-MM-dd
          let StartDat = formatDate(this.starttime); //开始时间
          let EndDat = formatDate(this.endtime); //结束时间

          // yyyy-MM-dd 转换成 时间戳
          let unix1 = datetime_to_unix(StartDat) + '000';
          let unix2 = datetime_to_unix(EndDat) + '000';
          getByCompanyPayTime(unix1, unix2, this.cur_page, this.size).then(res => {
            if (!res.data || res.data === [] || res.data.length === 0) {
              if (this.cur_page - 1 > 0) {
                this.cur_page -= 1;
                this.getData();
              } else {
                this.list = [];
              }
            } else {
              this.list = res.data.result;
              if (res.data.count) {
                this.total = res.data.count;
              }
            }
          });
        }
      },
      //分页导航
      handleCurrentChange(val) {
        this.cur_page = val;
        // 手机号
        if (this.mobile !== "") {
          goldCoinLogDetailByMobile(this.mobile, this.cur_page, this.size).then(res => {
            console.log(this.mobile);
            console.log(res);
            if (!res.data || res.data === [] || res.data === 0) {
              if (this.cur_page - 1 > 0) {
                this.cur_page -= 1;
                this.getData();
              } else {
                this.list = [];
              }
            } else {
              this.list = res.data.result;
              if (res.data.length) {
                this.total = res.data.length;
              }
            }
          });
          // 状态
        } else {
          this.getData();
        }
      },
      //导出Word表格

      exportExcel() {
        console.log(XLSX);
        var self = this;
        new Promise(function (resolve, reject) {
          goldCoinLogDetail(1, self.total).then(res => {
            self.list = res.data.result;
            self.size = res.data.count;
            self.total = 1;
            resolve()
          })
        }).then(res => {
          var fix = document.querySelector('.el-table__fixed');
          console.log(fix);
          console.log(document.querySelector(".el-table2"))
          var wb = XLSX.utils.table_to_book(document.querySelector(".el-table2").removeChild(fix), { raw: true });
          document.querySelector(".el-table2").appendChild(fix);
          var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
          });
          try {
            FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "收益明细.xlsx"
            );
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
          this.size = 10;
          this.total = 0;
          goldCoinLogDetail(this.cur_page, this.size).then(res => {
            self.list = res.data.result;
            this.total = res.data.count;
          })
          return wbout;
        })
      },

      getData() {
        goldCoinLogDetail(this.cur_page, this.size).then(res => {
          if (
            !res.data.result ||
            res.data.result === [] ||
            res.data.result.length === 0
          ) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1;
              this.getData();
            } else {
              this.list = [];
            }
          } else {
            console.log(res.data);
            this.list = res.data.result;
            if (res.data.count) {
              this.total = res.data.count;
            }
          }
        });
      },
      //时间
      formatTime: function (row, column, cellValue) {
        return formatDate(cellValue);
      },
      formatCourse: function (row, column, value) {
        if (value == '' || value == null) {
          console.log(row)
          if (parseFloat(row.goldcoin_change) < 0) {
            return '已提现'
          }
        } else {
          return value
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .categories-news-button {
    height: 36px;
    padding: 10px 20px 15px;
    box-sizing: content-box;

    button {
      float: left;
      height: 36px;
      line-height: 36px;
      width: 60px;
      cursor: pointer;
      background: #fff;
      border: 1px solid #bfcbd9;
      color: #1f2d3d;
      outline: 0;
      border-radius: 4px;
      margin-left: 10px;
    }

    button:nth-child(1) {
      background: #20a0ff;
      color: #fff;
    }
  }

  .xxts {
    margin-top: 20px;
    padding: 20px 30px 20px 20px;
    background: #fff;
  }
</style>