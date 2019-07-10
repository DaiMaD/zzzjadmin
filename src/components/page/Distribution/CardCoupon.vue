<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>推送</el-breadcrumb-item>
                <el-breadcrumb-item>推送内容</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <DIV id="pushtype">
          推送类型:&nbsp;&nbsp;&nbsp;  <el-radio v-model="radio" label="1">消息推送</el-radio>  <el-radio v-model="radio" label="2">课程推送</el-radio>
                     
        </DIV>
        <div class="xxts">
          <div class="categories-news-main">
            <div class="categories-news-content">
              <el-form  :model="addForm" label-position="left" label-width="80px">

                <el-form-item label="标题文案:" prop="pushtitle">

                  <el-input v-model="addForm.pushtitle" class="handle-input" placeholder="请在这里输入标题文案"></el-input>
                
                </el-form-item>
                
                <el-form-item label="内容文案:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请在这里输入推送内容"
                    v-model="addForm.pushcontent">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  目标人群:&nbsp;&nbsp;&nbsp;  <el-radio v-model="radio" label="1">全部用户</el-radio>  
                </el-form-item>
                <el-form-item>
                  发送人群:&nbsp;&nbsp;&nbsp;  <el-radio v-model="radio" label="1">立即发送</el-radio>  <el-radio v-model="radio" label="2">自定义发送</el-radio>  
                     <el-date-picker
                      v-model="value1"
                      type="datetime"
                      placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="categories-news-button">
            <button @click="handelUpdate">发送</button>
          </div>
        </div>
    
    </div>
</template>

<script>
    import {} from '../../../api/api';
    import {formatDate,handleCommonAvatarSuccess} from '../../Utility/Utility';
    export default {
        data() {
          return {
            radio:'1',
            //当夜内容展示
            addForm:{
              pushtitle:'',
              pushcontent:'',
            },

          }
        },
        mounted () {
         
        },
      
        methods : {
         
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
  .xxts{
    margin-top: 20px;
    padding: 20px 30px 20px 20px;
    background: #fff;
  }
</style>
