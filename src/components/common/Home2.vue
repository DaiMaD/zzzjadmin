<template>
  <div class="wrapper">
    <!--内容管理-->
    <v-sidebar :slidebarData="slidebarData" v-if="slidebarData.length>0"></v-sidebar>
    <v-tabs></v-tabs>
    <!--<div class="content">
            <router-view></router-view>
        </div>-->
  </div>
</template>

<script>
  import vTabs from './Tabs2.vue';
  import vSidebar from './Sidebar.vue';
  import bus from '../common/bus';
  import { getRouteTree } from '../../api/api';
  export default {
    data() {
      return {
        collapse: false,
        slidebarData: [
        ]
      }
    },
    components: {
      vSidebar, vTabs
    },
    created() {
      getRouteTree().then(res => {
        this.slidebarData = res.data[0].subs;
        console.log(this.slidebarData);
      })
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })
    }
  }
</script>
<style type="text/css">
  .el-menu--horizontal>.el-menu-item {
    width: 12%;
  }
</style>