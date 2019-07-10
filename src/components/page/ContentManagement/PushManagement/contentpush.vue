<template>
  <div class="table">
    <!-- 控制器 -->
    <DIV id="pushtype">
      推送类型:&nbsp;&nbsp;&nbsp; <el-radio v-model="pushtype" label="1">消息推送</el-radio>
      <el-radio v-model="pushtype" label="2">课程推送</el-radio>
      <el-radio v-model="pushtype" label="3">版本更新</el-radio>
    </DIV>
    <!-- 消息推送 -->
    <div v-if="pushtype == 1" class="xxts">
      <div class="categories-news-main">
        <div class="categories-news-content">
          <el-form :model="addForm" label-position="left" label-width="100px">

            <el-form-item label="标题文案:" prop="pushtitle" :rules="[
                  { required: true, message: '标题文案不能为空'},
                ]">

              <el-input v-model="addForm.pushtitle" class="handle-input" placeholder="至多50个字" :change="xzzf()">
              </el-input>

            </el-form-item>
            <el-form-item class="tishi" v-show="bool1"><span>{{tishi}}</span></el-form-item>
            <el-form-item label="内容文案:" :rules="[
                  { required: true, message: '内容文案不能为空'},
                ]">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="至多128个字"
                v-model="addForm.pushcontent" :change="xzzfc()">
              </el-input>
            </el-form-item>
            <el-form-item class="tishi" v-show="bool2"><span>{{tishi}}</span></el-form-item>
            <el-form-item label="目标人群:">
              <el-radio v-model="radio1" label="1" class="countetps">全部用户</el-radio>
            </el-form-item>
            <el-form-item label="发送时间:">
              <el-radio v-model="radio2" label="1" class="countetps">立即发送</el-radio>
              <el-radio v-model="radio2" label="2" class="countetps">自定义时间:</el-radio>
              <el-date-picker class="countetps" v-model="pushtime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="categories-news-button">
        <button @click="handelUpdate">发送</button>
      </div>
    </div>
    <!-- 课程推送 -->
    <div v-else-if="pushtype == 2" class="kcts">
      <div class="categories-news-main">
        <div class="categories-news-content">
          <el-form :model="addForm" label-position="left" label-width="100px">

            <el-form-item label="标题文案:" prop="pushtitle" :rules="[
                  { required: true, message: '标题文案不能为空'},
                ]">

              <el-input v-model="addForm.pushtitle" class="handle-input" placeholder="至多50个字" :change="xzzf()">
              </el-input>

            </el-form-item>
            <el-form-item class="tishi" v-show="bool1"><span>{{tishi}}</span></el-form-item>

            <el-form-item label="内容文案:" :rules="[
                  { required: true, message: '内容文案不能为空'},
                ]">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="至多128个字"
                v-model="addForm.pushcontent" :change="xzzfc()">
              </el-input>
            </el-form-item>
            <el-form-item class="tishi" v-show="bool2"><span>{{tishi}}</span></el-form-item>

            <el-form-item label="打开指定页面：">
              <el-radio v-model="addForm.target" label="1" class="countetps">商学院</el-radio>
              <el-radio v-model="addForm.target" label="2" class="countetps">大讲堂</el-radio>
              <el-radio v-model="addForm.target" label="3" class="countetps">FM:</el-radio>
              <div class="block">
                <el-select v-model="targettype1" style='width:100px' class="countetps mar">
                  <el-option v-for="item in gifOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <el-radio v-model="addForm.target" label="4" class="countetps">今日速递:</el-radio>
              <el-select v-model="targettype2" style='width:100px' class="countetps mar">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-radio v-model="addForm.target" label="5" class="countetps">活动</el-radio>
              <el-radio v-model="addForm.target" label="6" class="countetps">读书</el-radio>
              <el-radio v-model="addForm.target" label="7" class="countetps">Banner</el-radio>
            </el-form-item>
            <el-form-item label="指定课程/活动/读书ID">
              <!-- <el-input size="medium"  v-model="addForm.targetid" placeholder="請手動輸入id" class="handle-select mr10" clearable> -->
              <el-input size="medium" v-model="keywords" placeholder="请输入课程 书名 老师" class="handle-select mr10" clearable>
              </el-input>
              <el-button class="but" type="primary" icon="search" size="mini" @click="search">搜索</el-button>
            </el-form-item>
            <el-form-item label="当前选择的ID：">
              <el-input size="medium" v-model="addForm.targetid" placeholder="选择的id" class="handle-select mr10"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="目标人群:">
              <el-radio v-model="radio1" label="1" class="countetps">全部用户</el-radio>
            </el-form-item>
            <el-form-item label="发送时间:">
              <el-radio v-model="radio2" label="1" class="countetps">立即发送</el-radio>
              <el-radio v-model="radio2" label="2" class="countetps">自定义时间</el-radio>
              <el-date-picker class="countetps" v-model="pushtime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="categories-news-button">
        <button @click="handelUpdate">发送</button>
      </div>
    </div>
    <!-- 版本更新 -->
    <div v-else class="xxts">
      <div class="categories-news-main">
        <div class="categories-news-content">
          <el-form :model="addForm" label-position="left" label-width="100px">

            <el-form-item label="标题文案:" prop="pushtitle" :rules="[
                  { required: true, message: '标题文案不能为空'},
                ]">

              <el-input v-model="addForm.pushtitle" class="handle-input" placeholder="至多50个字" :change="xzzf()">
              </el-input>

            </el-form-item>
            <el-form-item class="tishi" v-show="bool1"><span>{{tishi}}</span></el-form-item>
            <el-form-item label="内容文案:" :rules="[
                  { required: true, message: '内容文案不能为空'},
                ]">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="至多128个字"
                v-model="addForm.pushcontent" :change="xzzfc()">
              </el-input>
            </el-form-item>
            <el-form-item class="tishi" v-show="bool2"><span>{{tishi}}</span></el-form-item>
            <el-form-item label="更新平台:">
              <el-radio v-model="addForm.pushsystem" label="1" class="countetps">iOS</el-radio>
              <el-radio v-model="addForm.pushsystem" label="2" class="countetps">Android</el-radio>
            </el-form-item>
            <el-form-item label="目标人群:">
              <el-radio v-model="radio1" label="1" class="countetps">全部用户</el-radio>
            </el-form-item>
            <el-form-item label="发送时间:">
              <el-radio v-model="radio2" label="1" class="countetps">立即发送</el-radio>
              <el-radio v-model="radio2" label="2" class="countetps">自定义时间:</el-radio>
              <el-date-picker class="countetps" v-model="pushtime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="categories-news-button">
        <button @click="handelUpdate">发送</button>
      </div>
    </div>
    <!-- 搜索内容弹框 -->
    <div class="categories-news" v-if="this.addFormVisible">
      <div class="categories-news-main">
        <div class="categories-news-content">
          <el-table :data="list" border style="width: 100%">
            <!-- <el-table-column  type="index" :index="indexMethod" width="80" fixed></el-table-column>                   -->
            <el-table-column prop="id" label="ID" width="180"></el-table-column>
            <el-table-column prop="lecturer" label="主讲人" width="180"></el-table-column>
            <el-table-column prop="name" label="课程/书/活动名"></el-table-column>
            <el-table-column prop="to_id" label="banner分享标题"></el-table-column>
            <el-table-column prop="link_url" label="banner链接地址"></el-table-column>
            <!-- <el-table-column  prop="share_sub_title" label="banner/分享副标题"></el-table-column> -->
            <!-- <el-table-column  prop="share_img" label="banner/分享图片"></el-table-column> -->
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="confirmAdd(scope.$index, scope.row)">选定</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="categories-news-content">
          <el-button size="small" type="danger" @click="addFormVisible = false">取消</el-button>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import { postpush, pushsearch } from '../../../../api/api';
  import { formatDate, handleCommonAvatarSuccess } from '../../../Utility/Utility';
  import { quillEditor } from 'vue-quill-editor';
  import { get } from '../../../../api';
  export default {
    data() {
      return {
        pushtype: '1',//推送类型
        radio_mbrq1: '',
        radio1: '1',
        radio2: '1',
        label: '1',
        //小节套课
        targettype1: '',
        targettype2: '',
        //列表内容
        list: [],
        // 搜索需要
        keywords: '',
        //新增界面是否显示
        addFormVisible: false,
        tishi: '至多50字',
        bool1: false,//提示弹窗
        bool2: false,//提示弹窗
        pushtime: '',
        //当页内容展示
        addForm: {
          pushtype: '1',//推送类型
          pushtitle: '',//推送标题
          pushcontent: '',//推送文案
          pushtime: '',//推送时间
          target: '1',//分类类型
          targettype: '',//..小节或者套课
          targetid: '',
          bookuuid: '',
          booktype: '1',
          pushsystem: '1',
          bannerlinkurl: '',//banner 链接地址
          sharemaintitle: '',//banner 分享主标题
          sharesubtitle: '',//banner 分享副标题
          shareimg: '',//banner 分享图片
        },
        //属性状态
        gifOptions: [
          {
            value: 1,
            label: '套课'
          },
          {
            value: 2,
            label: '小节'
          }
        ],
        typeOptions: [
          {
            value: 1,
            label: '套课'
          },
          {
            value: 2,
            label: '小节'
          }
        ],
        //属性状态
        IsOptions1: [
          {
            value: 0,
            label: '免费'
          },
          {
            value: 1,
            label: '付费'
          }
        ],
        selectResult: false
      }
    },
    mounted() {

    },

    methods: {
      //index
      indexMethod(index) {
        return index + 1
      },
      xzzf() {
        if (this.addForm.pushtitle.length > 50) {
          this.tishi = '至多50字'
          this.bool1 = true
          setTimeout(() => {
            this.bool1 = false
          }, 3000);
        } else {

        }

      },
      xzzfc() {
        if (this.addForm.pushcontent.length > 128) {
          this.tishi = '至多128字'
          this.bool2 = true
          setTimeout(() => {
            this.bool2 = false
          }, 3000);
        } else {

        }

      },
      //搜索
      search() {
        // 重新定义addFrom值
        if (this.addForm.target == '3') {
          this.addForm.targettype = this.targettype1
        } else {
          this.addForm.targettype = this.targettype2
        }
        if (this.keywords !== '') {
          pushsearch(this.addForm.target, this.keywords, this.addForm.targettype).then(res => {
            if (res.data == null) {
              this.list = null
              alert('请确认您是否已经选择')
            } else {
              this.list = res.data.data
              this.addFormVisible = true
            }
          });
        } else {
          this.list = JSON.parse(JSON.stringify(this.del_list))//parse 用于从一个字符串中解析出json 对象,stringify用于从一个对象解析出字符串
          alert('请输入您搜索的关键字')
        }
      },
      //搜索框内容确认按钮
      confirmAdd(index, row) {
        this.addForm = {
          targetid: row.id,
          bookuuid: row.uuid,
          booktype: row.type,
          bannerlinkurl: row.link_url,//banner 链接地址
          sharemaintitle: row.share_main_title,//banner 分享主标题
          sharesubtitle: row.share_sub_title,//banner 分享副标题
          shareimg: row.share_img,//banner 分享图片
          // 将已有内容重新定义
          pushtype: this.addForm.pushtype,//推送类型
          pushtitle: this.addForm.pushtitle,//推送标题
          pushcontent: this.addForm.pushcontent,//推送文案
          pushtime: this.addForm.pushtime,//推送时间
          target: this.addForm.target,//分类类型
          targettype: this.addForm.targettype,//..小节或者套课
          pushsystem: this.addForm.pushsystem,
        }
        this.$confirm('是否选择当前內容?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'canceBtn',
          type: 'warning'
        }).then(() => {
          this.addFormVisible = false
          this.$message({
            type: 'success',
            message: '选择成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handelUpdate() {
        // 数字类型转换成string
        this.addForm.targetid = this.addForm.targetid.toString();
        this.addForm.targettype = this.addForm.targettype.toString();
        this.addForm.pushtype = this.pushtype
        // 判断类型为 null 处理
        if (this.addForm.booktype == null) {
          this.addForm.booktype = '1'
        }
        // 如果选择立即发送则时间应为空
        if (this.radio2 == '1') {
          this.addForm.pushtime = ''
        } else {
          //将中国标准时间  Wed Mar 06 2019 00:03:00 GMT+0800 (中国标准时间)  格式改成 yyyy-MM-dd hh:mm:ss 2019-03-14 19:04:00
          console.log(this.pushtime)
          var D = new Date(this.pushtime);
          if ((D.getMonth() + 1) < 10) {
            var dateMonth = '0' + (D.getMonth() + 1)
          } else {
            var dateMonth = D.getMonth() + 1
          }
          if (D.getDate() < 10) {
            var dateDay = '0' + D.getDate()
          } else {
            var dateDay = D.getDate()
          }
          if (D.getHours() < 10) {
            var dateHours = '0' + D.getHours()
          } else {
            var dateHours = D.getHours()
          }
          if (D.getMinutes() < 10) {
            var dateMinutes = '0' + D.getMinutes()
          } else {
            var dateMinutes = D.getMinutes()
          }
          if (D.getSeconds() < 10) {
            var dateSeconds = '0' + D.getSeconds()
          } else {
            var dateSeconds = D.getSeconds()
          }
          this.addForm.pushtime = D.getFullYear() + '-' + dateMonth + '-' + dateDay + ' ' + dateHours + ':' + dateMinutes + ':' + dateSeconds;
        }

        if (this.addForm.pushtitle == '' || this.addForm.pushtitle.length == 0 || this.addForm.pushcontent == '' || this.addForm.pushcontent.length == 0) {
          this.tishi = '请填写推送内容'
          this.bool2 = true
          setTimeout(() => {
            this.bool2 = false
          }, 3000);
        } else {
          this.$confirm('此操作将推送当前內容, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: "cancel-btns",
            type: 'warning'
          }).then(() => {
            console.log(this.addForm.pushtime)
            postpush(this.addForm).then(res => {
              console.log(this.addForm);
            }),
              this.$message({
                type: 'success',
                message: '推送成功!'
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消推送'
            });
          });
        }

      }
    },

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
      ;
    }
  }

  .xxts {
    margin-top: 20px;
    padding: 20px 30px 20px 20px;
    background: #fff;
  }

  .kcts {
    margin-top: 20px;
    padding: 20px 30px 20px 20px;
    background: #fff;
  }

  .countetps {
    line-height: 32px;
  }

  .mar {
    margin: 0 30px 0 7px;
  }

  .el-date-editor {
    margin: 0 0 0 7px;
  }

  .but {
    height: 36px;
    margin: 0 0 0 7px;
  }

  .categories-news-content {
    text-align: center
  }

  .tishi span {
    font-size: 14px;
    color: red
  }
</style>