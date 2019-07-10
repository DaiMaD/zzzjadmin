<template>
  <div class="table">
    <div class="container">
      <div class="tagsWrap">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="" name="*">
            <template slot="title">
              <h4>● 版本更新：V 0.3.0</h4>
              <span class="updateTime">更新时间：2019-06-08</span>
            </template>
            <p>1.套课分享合并到套课列表中，新增套课时填写列表与分享信息一并提交</p>
            <p>2.路由导航选中时，每级别背景色和字体颜色区分</p>
          </el-collapse-item>
          <el-collapse-item title="" name="2">
            <template slot="title">
              <h4>● 版本更新：V 0.2.0</h4>
              <span class="updateTime">更新时间：2019-06-12</span>
            </template>
            <p>1.新增媒体图片库，在需要添加图片的位置点击“选择文件”弹出媒体库选择图片</p>
            <p>2.每个页面的新增添加快捷键，按下键盘“k”键可快捷打开新增页面，按下“esc”可关闭</p>
            <p>3.标签管理改为标签样式，新增标签点击“+new tag”按钮，输入标签名；删除标签点击标签右侧的叉号并确认即可删除</p>
          </el-collapse-item>
          <el-collapse-item title="" name="1">
            <template slot="title">
              <h4>● 版本更新：V 0.1.0</h4>
              <span class="updateTime">更新时间：2019-06-09</span>
            </template>
            <p>1.分离一级导航，放在顶部</p>
            <p>2.新增tabs标签页，点击右侧叉号可关闭</p>
            <p>3.改版UI排版，主题从深紫色改为白色</p>
          </el-collapse-item>

        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: '*'
      }
    },
    created() {
    },
    computed: {},

    methods: {
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData() {
        await GetLables().then(res => {
          console.log(res);
          if (!res.data || res.data === [] || res.data.length === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.list = []
            }
          } else {
            this.list = res.data;
            if (res.data.count) {
              this.total = res.data.count
            } else {
              this.total = res.data.length
            }
          }
        });
      }
    }
  }
</script>

<style scoped>
  .tagsWrap {
    display: flex;
    justify-content: left;
    flex-flow: wrap;
  }

  .updateTime {
    margin-left: 10px;
  }

  .el-collapse {
    width: 100%;
  }

  .el-collapse p {
    color: #888;
    text-indent: 2em;
  }
</style>