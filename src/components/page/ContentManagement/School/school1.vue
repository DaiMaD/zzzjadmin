<template>
    <div class="table">
        <div class="container">
          <div class="categories-news-main">
            <div class="categories-news-content">
              <el-form  :model="addForm"  ref="addForm"  label-position="left" label-width="80px">
                <el-form-item   label="价 格:" prop="total_price">
                  <el-input  v-model="addForm.total_price" class="handle-input"></el-input>
                </el-form-item>
                <!------------------------------------>
                <el-form-item label="分类类型:" prop="id">
                  <el-select v-model="addForm.id">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商学院年费图:" prop="brief_img">
                  <el-input  v-model="addForm.brief_img"></el-input>
                  <el-upload
                    class="upload-demo"
                    :show-file-list="false"
                    action=""
                    :on-change="handleBannercoverg"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  </el-upload>
              </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="categories-news-button">
            <button @click="handelUpdate">确定</button>
            <button>取消</button>
          </div>

          <p>当前年费价格为: {{total_price}}</p>
          <!--进度条弹框-->
          <div class="categories-news" v-if="this.progressVisible"  >
            <!--<el-progress :text-inside="true" :stroke-width="18" :percentage="this.progressPercent"></el-progress>-->

            <el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7" ></el-progress>
          </div>
        </div>
    </div>
</template>

<script>
    import {getUpdateyearfee, getYearfee,getPicURL} from '../../../../api/api';
    import {formatDate,handleCommonAvatarSuccess} from '../../../Utility/Utility';
    export default {
        data() {
          var validatePrice = (rule, value, callback) => {
            var price = Number(value)
            if (! /^([1-9]\d*|[0]{1,1})$/.test(price)) {
              callback(new Error('请输入正确的价格'));
            } else {
              callback();
            }
          };
            return {
                total_price: 0,
                select_cate: '',  //查询id
                list: [],         //数据
                del_list: [],     //查询时缓存的全部数据
                cur_page: 1,      //当前页
                total: 0,
                size: 10,
              //价格必须是正整数
              // addFormRules: {
              //   price: [
              //     {required: true, message: '价格不能为空,且必须是正整数类型'},
              //     {validator: validatePrice, trigger: 'blur'}
              //   ]
              // },
               fileList2: [
                  {name: 'food.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
                  {name: 'food2.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
                  ],
                //新增界面是否显示
                addFormVisible: false,
                //新增界面数据
                addForm: {
                  id: 2,
                  total_price: '',
                  brief_img:'',
                },
                isEditForm: false,//是否是编辑页面
                statusOptions: [
                  {
                    value: 0,
                    label: '不可用'
                  }, {
                    value: 1,
                    label: '可用'
                  }
                ],
                typeOptions: [
                  {
                    value: 0,
                    label: '讲堂内容'
                  }, {
                    value: 1,
                    label: 'fm音频管理器'
                  }, {
                    value: 2,
                    label: '商学院课程'
                  } 
                ],
              //进度条是否显示
              progressVisible: false,
              progressPercent :0,


              }
        },
        mounted () {
          getYearfee().then( res => {
            this.total_price = res.data[1].total_price
            this.addForm.total_price = this.total_price 
            this.addForm.brief_img = res.data[1].brief_img
          })
        },
      
        methods : {
          handelUpdate () {
            this.$refs['addForm'].validate((valid) => {
              if (valid) {
                if(this.addForm.id === 2) {
                  getUpdateyearfee(this.addForm).then(res => {
                    alert("年费修改成功！");
                    getYearfee().then( res => {
                        this.price = res.data[1].total_price
                        this.addForm.price = this.price
                        this.addForm.brief_img=res.data[1].brief_img
                      })
                  })
                } else {
                  alert("暂时未开通功能");
                }
              }
            })
          },
          //商学院上传图片4
          handleBannercoverg(file, fileList) {
            console.log(file.name + file.size);
            if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
              var _this = this;
              this.progressVisible = true;
              var complete = function(res) {
                if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
                  getPicURL(res.key).then((res)=>{
                    _this.progressVisible=false;
                    _this.addForm.brief_img = res.data
                  });
                }
              };
              var error = function(err) {
                console.log(err);
                _this.progressVisible = false;
                alert("上传出错")
              };
              var next = function(response) {
                var total = response.total;
                _this.progressPercent = parseFloat(total.percent.toFixed(2));
                console.log(_this.progressPercent);
              };
              handleCommonAvatarSuccess(file,fileList,complete,error,next)
            }else {
              this.$message({
                message:"请输入jpg,jpeg,png格式图片",
                type : "error"
              })
            }
          },
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
    button:nth-child(1){
      background:#20a0ff;
      color: #fff;;
    }
  }
  
</style>
