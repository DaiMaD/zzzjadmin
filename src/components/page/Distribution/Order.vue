<template>
  <div class="table" id="table">
    <div>
      <div class="container">
        <div class="handle-box">
          <el-select placeholder="支付状态" v-model="orderstatus" :on-change="fenye()">
            <el-option v-for="item in ddtypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-model="starttime" type="datetime" placeholder="开始时间"></el-date-picker>
          <el-date-picker v-model="endtime" type="datetime" placeholder="结束时间"></el-date-picker>
          <el-button type="primary" icon="search" @click="search" fixed="right">查询</el-button>
          <el-button type="info" icon="add" @click="qingchu">清除</el-button>

          <el-table :data="list" :row-style="tableRowStyle"
            :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}" stripe border max-height="680"
            style="width: 100%;margin-top: 20px;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="coursename" label="课程名称" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop="order_num" label="订单编号"></el-table-column> -->
            <el-table-column prop="pay" label="支付价格" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="status" label="订单状态" :formatter="formatStatus" :show-overflow-tooltip="true">
            </el-table-column>
            <!-- <el-table-column prop="pay_time" label="支付时间" :formatter="formatTime"></el-table-column> -->
            <el-table-column prop="name" label="用户昵称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="mobile" label="用户(手机号)" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="zongdainame" label="总代理" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="zongdaimobile" label="对应总代理（手机号）" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="citypartnername" label="城市合伙人" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="citypartnermobile" label="对应城市合伙人（手机号）" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" :formatter="formatTime" :show-overflow-tooltip="true">
            </el-table-column>
          </el-table>
          <!-- -------分页------------- -->
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
              :total="this.total"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    courseOrder,
    promotionSearchByOrderId,
    promotionSearchByOrderStatus,
    promotionSearchByOrderFrom,
    promotionSearchByOrderTime,
    getByCompanyPayTime
  } from '../../../api/api'
  import {
    formatDate,
    handleCommonAvatarSuccess,
    datetime_to_unix,
    formatTime
  } from '../../Utility/Utility'
  export default {
    // data开始
    data() {
      // return开始
      return {
        list: [],
        // 搜索功能
        keywords: '',
        orderid: '', //ID
        orderstatus: '', //状态
        orderfrom: '', //来源
        starttime: '', //开始时间
        endtime: '', //结束时间
        total: 0,

        cur_page: 1,
        size: 10,
        //订单状态
        ddtypeOptions: [
          {
            value: 0,
            label: '未支付'
          },
          {
            value: 1,
            label: '已支付'
          },
          {
            value: -1,
            label: '已取消'
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
        ],
        addForm: '',
        selectResult: false
      }
      // return结束
    },
    // data结束
    mounted() {
      this.getData()
    },

    methods: {
      qingchu() {
        this.getData()
        this.keywords = ''
        this.orderid = ''
        this.orderstatus = ''
        this.starttime = ''
        this.endtime = ''
      },
      // 修改table tr行的背景色
      tableRowStyle({ row, rowIndex }) {
        return 'background-color: #fff'
      },

      //时间
      formatTime: function (row, column, cellValue) {
        return formatDate(cellValue)
      },
      formatStatus: function (row, column, cellValue) {
        //    console.log(cellValue);
        if (cellValue === 0) {
          return '未支付'
        } else if (cellValue === 1) {
          return '已支付'
        } else {
          return '已取消'
        }
      },
      //当选择栏状态改变时,重置当前页面导航下标
      fenye() {
        this.cur_page = 1
        console.log(this.cur_page)
      },
      //分页导航
      handleCurrentChange(val) {
        this.cur_page = val
        if (this.orderstatus !== '') {
          promotionSearchByOrderStatus(
            this.orderstatus,
            this.cur_page,
            this.size
          ).then(res => {
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
              if (res.data.count) {
                this.total = parseInt(res.data.count)
              }
            }
          })
        } else if (this.starttime !== '') {
          // 中国标准时间转换成yyyy-MM-dd
          let StartDat = formatDate(this.starttime) //开始时间
          let EndDat = formatDate(this.endtime) //结束时间

          // yyyy-MM-dd 转换成 时间戳
          let unix1 = datetime_to_unix(StartDat) + '000'
          let unix2 = datetime_to_unix(EndDat) + '000'
          promotionSearchByOrderTime(unix1, unix2, this.cur_page, this.size).then(
            res => {
              console.log(res)
              if (!res.data || res.data === [] || res.data.length === 0) {
                if (this.cur_page - 1 > 0) {
                  this.cur_page -= 1
                  this.getData()
                } else {
                  this.list = []
                }
              } else {
                this.list = res.data.result
                if (res.data.count) {
                  this.total = parseInt(res.data.count)
                }
              }
            }
          )
        } else {
          this.getData()
        }
      },
      handleSizeChange(val) {
        this.size = val
        this.getData()
        document
          .getElementById('table')
          .setAttribute('style', 'height: 1100px !important')
      },
      search() {
        if (this.orderstatus !== '') {
          alert(1)
          promotionSearchByOrderStatus(
            this.orderstatus,
            this.cur_page,
            this.size
          ).then(res => {
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
              if (res.data.count) {
                this.total = parseInt(res.data.count)
              }
            }
          })
        } else if (this.starttime !== '') {
          // 中国标准时间转换成yyyy-MM-dd
          let StartDat = formatDate(this.starttime) //开始时间
          let EndDat = formatDate(this.endtime) //结束时间

          // yyyy-MM-dd 转换成 时间戳
          let unix1 = datetime_to_unix(StartDat) + '000'
          let unix2 = datetime_to_unix(EndDat) + '000'
          promotionSearchByOrderTime(unix1, unix2, this.cur_page, this.size).then(
            res => {
              console.log(res)
              if (!res.data || res.data === [] || res.data.length === 0) {
                if (this.cur_page - 1 > 0) {
                  this.cur_page -= 1
                  this.getData()
                } else {
                  this.list = []
                }
              } else {
                this.list = res.data.result
                if (res.data.count) {
                  this.total = parseInt(res.data.count)
                }
              }
            }
          )
        } else {
          this.getData()
        }
      },
      getData() {
        courseOrder(this.cur_page, this.size).then(res => {
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
            if (res.data.count) {
              this.total = parseInt(res.data.count)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .table {
    padding: 10px;
    height: 1010px;
  }

  .table>div {
    background: #fff !important;
  }
</style>