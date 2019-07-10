<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <div class="addbtn">
          <el-tooltip class="item" effect="dark" content="点击键盘“K”键即可进行“新增”操作" placement="left">
            <i class="el-icon-info addbtn2"></i>
          </el-tooltip>
          <el-button type="primary" icon="add" @click="addImg" class="">新增</el-button>
        </div>
      </div>
      <div class="mediaBox">

        <el-row :gutter="0">
          <el-col :span="4.8" v-for="item in audiosArr" :key="item.id" class="allAudiobox">
            <audio :src="item.audio_url" alt="" class="mediaImgs" /></audio>
            <div class="edits" @click="editImg(item)">
              <i class="el-icon-edit"></i>
            </div>
            <div class="delimg" @click="delImg(item)">
              <i class="el-icon-delete"></i>
            </div>
            <div class="imgInfo">
              <span>{{ item.audio_name }}</span>
            </div>
            <div class="imgInfo2">
              {{item.audio_time}}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--新增编辑弹框-->
    <div class="categories-news" v-if="this.addFormVisible">
      <div class="categories-news-main">
        <div class="categories-news-title">
          <span>{{this.isEditForm?'修改':'新增'}}</span>
          <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
        </div>
        <div class="categories-news-content">
          <el-form :model="addForm" ref="addForm" label-position="left" label-width="80px">
            <el-form-item label="标题:" prop="audio_name">
              <el-input v-model="addForm.audio_name"></el-input>
            </el-form-item>
            <el-form-item label="上传音频:" prop="pic_url">
              <el-input v-model="addForm.audio_url"></el-input>
              <el-upload class="upload-demo" :show-file-list="false" action="" :on-change="handleAudioSuccess"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="音频时长:" prop="audio_time">
              <el-input v-model="addForm.audio_time"></el-input>
            </el-form-item>
          </el-form>
          <div class="categories-news-button">
            <button @click="confirmAdd">确定</button>
            <button @click="addFormVisible = false">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import { getMediaData, postMediaData, putMediaData, DelMediaData, getAudioURL } from '../../../../api/api';
  import { formatDate, handleCommonAudioSuccess } from '../../../Utility/Utility';
  export default {
    data() {
      return {
        audiosArr: [],
        group: 0, // request param
        select_cate: '',
        cur_page: 1,
        list: [],
        total: 0,
        size: 10,
        addFormVisible: false,
        selectType: 'meitiku',
        selectImgSrc: '',
        //新增界面数据
        addForm: {
          id: '',
          audio_name: '',
          audio_url: '',
          audio_time: '',
          status: 0
        },
        statusOptions: [{
          value: 0,
          label: '下线'
        }, {
          value: 1,
          label: '上线'
        }]
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
    computed: {},

    methods: {
      addKey() {
        this.isEditForm = false;
        this.addImg();
        this.addFormVisible = true;
      },
      closeKey() {
        this.addFormVisible = false;
      },
      //上传音频
      handleAudioSuccess(file, fileList) {
        // console.log(file.name + file.size);
        var _this = this;
        this.progressVisible = true;
        if (file.name && file.name.match(/\.(mp3|MP3)$/)) {
          var complete = function (res) {
            if (res.key && res.key.match(/\.(mp3|MP3)$/)) {
              getAudioURL(res.key).then(function (res) {
                _this.progressVisible = false;
                _this.addForm.audio_url = res.data
                console.log(_this.addForm)
                //获取音频信息时长等字段
                _this.$axios.get(res.data + '?avinfo')
                  .then((res) => { //res为undefined
                    console.log("长度为" + res.data.format.duration)
                    const timedata = res.data.format.duration
                    //秒转分
                    var time = timedata
                    if (null != time && "" != time) {
                      if (time > 60 && time < 60 * 60) {
                        if (parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) == 0) {
                          time = parseInt(time / 60.0) + "分钟"
                        } else {
                          time = parseInt(time / 60.0) + "分" + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + "秒";
                        }
                        console.log("转换的时间是" + time);
                        _this.addForm.audio_time = time
                        console.log(_this.addForm)
                      }
                    }
                  })
                  .catch((error) => {
                    console.log("报错" + error)
                  })
              })
            }
          };
          var error = function (err) {
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
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData() {
        await this.$axios("https://www.easy-mock.com/mock/5cef8f14eb9aed32bc249007/MediaData/getAudioData").then(res => {
          console.log(res.data);
          if (!res.data || res.data === [] || res.data.length === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.list = []
            }
          } else {
            this.audiosArr = res.data;
            this.group++
            if (res.data.count) {
              this.total = res.data.count
            } else {
              this.total = res.data.length
            }
          }
        });
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
      //删除
      delImg(row) {
        // 新增删除提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(() => {
          DelMediaData(row.id).then(res => {
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
            type: 'img_name',
            message: '已取消删除'
          });
        });
      },
      //点击选中被删除项
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //新增弹框按钮点击显示
      addImg() {
        this.select_cate = "";
        this.text = '';
        this.isEditForm = false;
        this.addForm = {
          id: '',
          audio_name: '',
          audio_url: '',
          audio_time: '',
          status: 0
        };
        this.addFormVisible = true;
      },
      //新增
      myPostCoursesAdd() {
        console.log(this.addForm)
        postMediaData(this.addForm).then((res) => {
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
              this.myPutCoursesChange();
            } else {
              this.myPostCoursesAdd();
            }
          }
        })
      },
      //编辑按钮点击
      editImg(item) {
        this.isEditForm = true;
        this.addForm = {
          id: item.id,
          audio_url: item.audio_url,
          audio_name: item.audio_name,
          audio_time: item.audio_time,
          status: item.status
        };
        this.addFormVisible = true;
      },
      //修改
      myPutCoursesChange() {
        // putMediaData(this.addForm.id, this.addForm).then((res) => {
        //   if (res.success === true) {
        //     this.addFormVisible = false;
        //     this.getData();
        //   } else {
        //     this.$message({
        //       message: res.data,
        //       type: 'error'
        //     });
        //   }
        // });
      },
      selectImg(e, item) {
        if (document.querySelector('.isSelect_media')) {
          document.querySelector('.isSelect_media').classList.remove("isSelect_media");
        }
        e.currentTarget.parentNode.classList.add("isSelect_media") //.classList.add("类名") js添加单个class
        this.selectImgSrc = item.img_url;
      }
    },
    components: {
    },
    mounted() {
      window.addEventListener("beforeunload", function (e) {
        console.log("I want to cancel");
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = "hello";
      });
    },
  }
</script>

<style scoped>
  .mediaBox {
    text-align: center;
    position: relative;
  }

  .mediaImgs {
    max-height: 85%;
    max-width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .allAudiobox {
    border: 2px solid #eee;
    background-image: url("../../../../../static/img/musicBg4.png");
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: 50% 20%;
    background-color: #eee;
  }

  .el-col {
    height: 150px;
    width: 150px;
    margin: 10px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .imgInfo {
    position: absolute;
    bottom: 0px;
    left: 0;
    height: 30px;
    width: 100%;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    text-align: center;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .el-col:hover .imgInfo {
    bottom: 0px;
  }

  .imgInfo2 {
    position: absolute;
    top: -30px;
    height: 30px;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    line-height: 30px;
    width: 100%;
    font-size: 10px;
  }

  .el-col:hover .imgInfo2 {
    top: 0px;
  }

  .edits {
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 35px;
    right: -30px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    background: rgba(0, 0, 0, .6);
    border-radius: 50%;
  }

  .el-col:hover .edits {
    right: 5px;
  }

  .delimg {
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 70px;
    right: -30px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    background: rgba(0, 0, 0, .6);
    border-radius: 50%;
  }

  .el-col:hover .delimg {
    right: 5px;
  }

  .el-tabs {
    width: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 15%;
    margin-bottom: 8%;
  }

  .el-tabs>div {
    width: auto !important;
    left: 0 !important;
    top: 0% !important;
    background: #fff !important;
  }

  .addoreditBox {
    width: 100% !important;
    top: 0;
    position: relative;
    margin: 0 !important;
    overflow: hidden;
  }

  .selectlocal {
    height: 400px;
  }

  .isSelect_media {
    box-shadow: 0px 0px 1px 3px blue;
  }

  .selectImgSrc {
    width: 300px;
  }
</style>