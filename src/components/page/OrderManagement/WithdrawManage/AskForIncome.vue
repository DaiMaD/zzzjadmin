<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-input
          size="medium"
          label="手机号"
          v-model="mobile"
          placeholder="请输入手机号"
          class="handle-select mr10"
          clearable
        ></el-input>
        <el-select v-model="checkstatus" placeholder="申请状态查询" :on-change="fenye()">
          <el-option
            v-for="item in ddtypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker v-model="starttime" type="datetime" placeholder="开始时间"></el-date-picker>
        <el-date-picker v-model="endtime" type="datetime" placeholder="结束时间"></el-date-picker>
        <el-button type="primary" icon="search" fixed="right" @click="search">查询</el-button>
        <el-button type="info" icon="add" @click="qingchu">清除</el-button>
        <el-button type="primary" fixed="right" @click="exportExcel_AskFor">导出</el-button>
      </div>
      <el-table
        :data="list"
        border
        min-height="400"
        style="width: 100%"
        ref="multipleTable"
        :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}"
        class="el-table_AskFor"
      >
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <!-- <el-table-column type="index" :index="indexMethod" width="80" fixed></el-table-column> -->
        <el-table-column prop="id" label="id" width="100"></el-table-column>
        <el-table-column prop="usertype" label="用户角色" min-width="100" :formatter="formatjeuse"></el-table-column>
        <el-table-column prop="user_id" label="用户ID" min-width="100"></el-table-column>
        <el-table-column prop="name" label="用户名" min-width="100"></el-table-column>
        <el-table-column prop="status" label="提现状态" min-width="100" :formatter="formatRecommend"></el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="160"></el-table-column>
        <el-table-column prop="pay" label="提现金额" min-width="160"></el-table-column>
        <!-- <el-table-column prop="order_type" label="提现方式" width="300"></el-table-column> -->
        <el-table-column prop="nickname" label="提现帐号" min-width="160"></el-table-column>
        <el-table-column prop="create_time" label="申请时间" min-width="160" :formatter="formatTime"></el-table-column>
        <el-table-column prop="update_time" label="审批时间" min-width="160" :formatter="formatTime"></el-table-column>
        <!-- <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <!-- 查看弹窗 -->
      <div class="categories-news" v-if="this.addFormVisible">
        <div class="categories-news-main">
          <div class="categories-news-content">
            <el-table
              :data="list1"
              border
              style="width: 100%"
              :header-cell-style="{color:'#000',font_weight:800,background:'#f6f6f6'}"
            >
              <el-table-column prop="username" label="用户名" width="180"></el-table-column>
              <el-table-column prop="mobile" label="手机号"></el-table-column>
              <el-table-column prop label="课程名称"></el-table-column>
              <el-table-column prop label="支付价格"></el-table-column>
              <el-table-column prop="create_time" label="支付时间" :formatter="formatTime"></el-table-column>
              <el-table-column prop label="对应城市合伙人"></el-table-column>
              <el-table-column prop="goldcoin_change" label="佣金"></el-table-column>
            </el-table>
          </div>
          <div class="categories-news-content">
            <el-button size="small" type="primary" @click="addFormVisible = false , ReviewBy()">审核通过</el-button>
            <el-button size="small" type="danger" @click="addFormVisible = false , turnDown()">驳回</el-button>
            <el-button size="small" type="info" @click="addFormVisible = false">取消</el-button>
          </div>
        </div>
      </div>
      <!-- -------分页------------- -->
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {
  getCompanyPay,
  goldCoinLog,
  companyPay2,
  companypayCheckBack,
  getByCheckStatus,
  getByCompanyPayTime,
  getCompanyPayByMobile
} from '../../../../api/api'
import {
  formatDate,
  handleCommonAvatarSuccess,
  datetime_to_unix
} from '../../../Utility/Utility'
import { get } from '../../../../api'
export default {
  data() {
    return {
      id: '',
      radio: '1',
      list: [],
      currentPage: 1,
      list1: [],
      dlist: [],
      cur_page: 1,
      total: 0,
      size: 10,
      userid: 0,
      mobile: '',
      starttime: '',
      endtime: '',

      checkstatus: '', //搜索参数

      datay: { id: '' },
      addFormVisible: false,
      //当夜内容展示
      addForm: {
        pushtitle: '',
        pushcontent: ''
      },
      //订单状态
      ddtypeOptions: [
        {
          value: 1,
          label: '已结算'
        },
        {
          value: 0,
          label: '待审批'
        },
        {
          value: -1,
          label: '已驳回'
        }
      ],
      //订单来源
      ddlyOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: 'Android'
        },
        {
          value: 2,
          label: 'iOS'
        },
        {
          value: 3,
          label: '小程序'
        }
      ]
    }
  },
  mounted() {},
  created() {
    this.getData()
  },

  methods: {
    //当选择栏状态改变时,重置当前页面导航下标
    fenye() {
      this.cur_page = 1
      console.log(this.cur_page)
    },
    qingchu() {
      this.getData()
      this.mobile = ''
      this.checkstatus = ''
      this.starttime = ''
      this.endtime = ''
    },
    handleSizeChange(val) {
      this.size = val
      this.getData()
    },
    //提现搜索
    search() {
      // 手机号
      if (this.mobile !== '') {
        getCompanyPayByMobile(this.mobile).then(res => {
          console.log(this.mobile)
          console.log(res)
          if (!res.data || res.data === [] || res.data === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.list = []
            }
          } else {
            this.list = res.data
            if (res.data.length) {
              this.total = res.data.length
            }
          }
        })
        // 状态
      } else if (this.checkstatus !== '') {
        getByCheckStatus(this.checkstatus, this.cur_page, this.size).then(
          res => {
            console.log(this.checkstatus)
            console.log(res)
            if (
              !res.data.result ||
              res.data.result === [] ||
              res.data.result.length === 0
            ) {
              if (this.cur_page - 1 > 0) {
                this.cur_page -= 1
                this.getData()
              } else {
                this.list = []
              }
            } else {
              this.list = res.data.result
              if (res.data.totalPages) {
                this.total = res.data.totalPages * 10
              }
            }
          }
        )
        // 总代签约日期查询
      } else {
        // 中国标准时间转换成yyyy-MM-dd
        let StartDat = formatDate(this.starttime) //开始时间
        let EndDat = formatDate(this.endtime) //结束时间

        // yyyy-MM-dd 转换成 时间戳
        let unix1 = datetime_to_unix(StartDat) + '000'
        let unix2 = datetime_to_unix(EndDat) + '000'
        getByCompanyPayTime(unix1, unix2, this.cur_page, this.size).then(
          res => {
            if (!res.data || res.data === [] || res.data.length === 0) {
              if (this.cur_page - 1 > 0) {
                this.cur_page -= 1
                this.getData()
              } else {
                this.list = []
              }
            } else {
              this.list = res.data.result
              if (res.data.totalPages) {
                this.total = res.data.totalPages * 10
              }
            }
          }
        )
      }
    },

    //
    exportExcel_AskFor() {
      console.log(XLSX)
      var self = this
      new Promise(function(resolve, reject) {
        getCompanyPay(1, self.total).then(res => {
          self.list = res.data.result
          self.size = res.data.count
          self.total = 1
          resolve()
        })
      }).then(res => {
        var fix = document.querySelector('.el-table__fixed')
        var wb = XLSX.utils.table_to_book(
          document.querySelector('.el-table_AskFor').removeChild(fix),
          { raw: true }
        )
        document.querySelector('.el-table_AskFor').appendChild(fix)
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            '提现申请.xlsx'
          )
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        this.size = 10
        this.total = 0
        getCompanyPay(this.cur_page, this.size).then(res => {
          self.list = res.data.result
          this.total = res.data.count
        })
        return wbout
      })
    },

    //分页导航
    handleCurrentChange(val) {
      this.cur_page = val
      // 手机号
      if (this.mobile !== '') {
        getCompanyPayByMobile(this.mobile).then(res => {
          console.log(this.mobile)
          console.log(res)
          if (!res.data || res.data === [] || res.data === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.list = []
            }
          } else {
            this.list = res.data
            if (res.data.length) {
              this.total = res.data.length
            }
          }
        })
        // 状态
      } else if (this.checkstatus !== '') {
        getByCheckStatus(this.checkstatus, this.cur_page, this.size).then(
          res => {
            console.log(this.checkstatus)
            console.log(res)
            if (
              !res.data.result ||
              res.data.result === [] ||
              res.data.result.length === 0
            ) {
              if (this.cur_page - 1 > 0) {
                this.cur_page -= 1
                this.getData()
              } else {
                this.list = []
              }
            } else {
              this.list = res.data.result
              if (res.data.totalPages) {
                this.total = res.data.totalPages * 10
              }
            }
          }
        )
        // 总代签约日期查询
      } else if (this.starttime !== '') {
        // 中国标准时间转换成yyyy-MM-dd
        let StartDat = formatDate(this.starttime) //开始时间
        let EndDat = formatDate(this.endtime) //结束时间

        // yyyy-MM-dd 转换成 时间戳
        let unix1 = datetime_to_unix(StartDat) + '000'
        let unix2 = datetime_to_unix(EndDat) + '000'
        getByCompanyPayTime(unix1, unix2, this.cur_page, this.size).then(
          res => {
            if (!res.data || res.data === [] || res.data.length === 0) {
              if (this.cur_page - 1 > 0) {
                this.cur_page -= 1
                this.getData()
              } else {
                this.list = []
              }
            } else {
              this.list = res.data.result
              if (res.data.totalPages) {
                this.total = res.data.totalPages * 10
              }
            }
          }
        )
      } else {
        this.getData()
      }
    },
    //推荐判断
    formatRecommend: function(row, column, cellValue) {
      if (cellValue === 1) {
        return '成功'
      } else if (cellValue === 0) {
        return '未完成'
      } else if (cellValue === 2) {
        return '失败'
      }
    },
    //用户角色
    formatjeuse: function(row, column, cellValue) {
      if (cellValue === 0) {
        return '总代理'
      } else if (cellValue === 1) {
        return '合伙人'
      } else {
        return '普通用户'
      }
    },
    handleEdit(index, row) {
      // 将当前条目的id当成下单ID
      this.datay.id = row.id
      console.log(this.datay.id)
      goldCoinLog(row.user_id).then(res => {
        console.log(res)
        this.list1 = res.data.result
      })
      this.addFormVisible = true
    },
    //审核按钮
    ReviewBy() {
      companyPay2(this.datay).then(res => {
        console.log(res)
      })
    },
    //审核驳回
    turnDown() {
      companypayCheckBack(this.datay.id).then(res => {
        console.log(res)
      })
    },
    getData() {
      getCompanyPay(this.cur_page, this.size).then(res => {
        if (
          !res.data.result ||
          res.data.result === [] ||
          res.data.result.length === 0
        ) {
          if (this.cur_page - 1 > 0) {
            this.cur_page -= 1
            this.getData()
          } else {
            this.list = []
          }
        } else {
          console.log(res.data.result)
          for (let i = 0; i < res.data.result.length; i++) {
            console.log(res.data.result[i].check_status)
          }
          this.list = res.data.result
          if (res.data.count) {
            this.total = res.data.count
          }
        }
      })
    },
    //时间
    formatTime: function(row, column, cellValue) {
      return formatDate(cellValue)
    }
  }
}
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