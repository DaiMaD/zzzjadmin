<template>
  <div id="app">
    <v-headbar></v-headbar>
    <router-view></router-view>
    <!--本次更新弹框-->
    <div class="categories-news" v-if="this.nowUpdate">
      <div class="categories-news-main">
        <div class="categories-news-title" id="updateTitle">
          <span>
            版本：
            <span class="lv">v0.2.0</span>
          </span>
          <br>
          <br>
          <h3>本次更新：</h3>
        </div>
        <div class="categories-news-content" id="updateContent">
          <p>1.新增媒体库</p>
          <p>2.每个页面的新增添加快捷键，按下键盘“k”键可快捷打开新增页面，按下“esc”可关闭</p>
          <p>3.标签管理改为标签样式，新增标签点击“+new tag”按钮，输入标签名；删除标签点击标签右侧的叉号并确认即可删除</p>
        </div>
        <div class="categories-news-button">
          <button @click="confirmAdd">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import vHeadbar from './components/common/HeaderSidebar.vue'
  export default {
    data() {
      return {
        nowUpdate: false
      }
    },
    components: {
      vHeadbar
    },
    created() {
      console.log(localStorage.getItem('showUpdateBox'));
      if (!localStorage.getItem('showUpdateBox')) {
        this.nowUpdate = true;
      } else {
        this.nowUpdate = false;
      }
    },
    methods: {
      confirmAdd() {
        localStorage.setItem('showUpdateBox', true);
        this.nowUpdate = false
      }
    }
  }
</script>
<style lang="less">
  @import '../static/css/main.css';
  @import '../static/css/color-dark.css';


  /*深色主题*/
  /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
  .lv {
    color: #666 !important;
  }

  #updateTitle {
    height: 60px;
  }

  #updateContent {
    font-family: cursive;
  }

  #updateContent p {
    line-height: 30px;
  }

  .el-table {
    overflow: auto;
  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 170px;
    height: 40px;
  }

  .handle-del {
    width: 70px;
    height: 34px;
    text-align: center;
    /*line-height: 33px;*/
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  ul>li {
    list-style: none;
  }

  .categories-news {
    z-index: 120;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    min-width: 950px;
    overflow: auto;
    height: calc(100% + 1px);

    .categories-news-main {
      position: absolute;
      width: 50%;
      background: #fff;
      left: 50%;
      transform: translateX(-50%);
      top: 15%;
      margin-bottom: 50px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      z-index: 150;

      .categories-news-title {
        position: relative;
        padding: 20px 20px 0;
        height: 36px;
        line-height: 1;
        font-size: 16px;

        span {
          font-weight: 700;
          color: #1f2d3d;
        }

        i {
          position: absolute;
          right: 20px;
        }
      }

      .categories-news-content {
        padding: 10px 20px;
      }

      .categories-news-button {
        height: 36px;
        padding: 10px 20px 15px;
        box-sizing: content-box;

        button {
          float: right;
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
    }

    .categories-content-main {
      width: 790px;
    }
  }

  .cell {
    text-align: center;
  }

  .handle-box>.el-button:nth-child(1) {
    width: 80px;
  }

  .upload-demo {
    height: 32px;
  }

  .upload-demo .el-upload {
    border: none;
    height: 100%;
    width: 80px;
    margin-left: 30px;
  }

  .el-form-item__content {
    display: flex;
  }

  .el-progress--circle {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -100px;
    margin-top: -50px;
  }

  .cancel-upload {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 100px;
    margin-left: -80px;
  }

  .uploader-none {
    display: none;
  }

  th>div {
    height: 43px;
  }

  td>div {
    height: 43px;
  }

  table--small th {
    padding: 0;
  }
</style>