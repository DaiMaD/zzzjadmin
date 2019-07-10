<template>
  <div class="wrapper">
    <!--内容管理-->
    <v-sidebar :slidebarData="slidebarData"></v-sidebar>
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
  export default {
    data() {
      return {
        collapse: false,
        slidebarData: [
          {
            icon: 'el-icon-bell',
            index: 'Class',
            title: '上课',
            subs: [
              {
                index: 'Courier',
                title: '今日真知速递',
                subs: [
                  {
                    index: 'Courier1',
                    title: '套课列表'
                  },
                  {
                    index: 'Courier2',
                    title: '小节列表'
                  },
                  {
                    index: 'Courier3',
                    title: '套课分享'
                  }
                ]
              }, {
                index: 'searchFor',
                title: '热门搜索'
              },
            ]
          },
          {
            icon: 'el-icon-setting',
            index: 'LectureContents',
            title: '大讲堂',
            subs: [
              {
                index: 'Category',
                title: '频道分类'
              },
              {
                index: 'Course',
                title: '课程列表'
              },
              {
                index: 'Categoryzj',
                title: '套课“灼见”'
              },
              {
                index: 'Sections',
                title: '小节列表'
              },
              {
                index: 'ClassComment',
                title: '课程留言'
              },
              {
                index: 'Courseshare',
                title: '课程分享'
              },
            ]
          },
          //fm模块
          {
            icon: 'el-icon-service',
            index: 'FMClass',
            title: '金融FM',
            subs: [
              {
                index: 'FMcourse',
                title: '课程列表'
              }, {
                index: 'FMlist',
                title: '小节列表'
              }, {
                index: 'FMshare',
                title: '课程分享'
              }
            ]
          },
          //商学院课程模块
          {
            icon: 'el-icon-news',
            index: 'School',
            title: '商学院',
            subs: [
              {
                index: 'school1',
                title: '年费价格表'
              }, {
                index: 'school2',
                title: '模块分类'
              }, {
                index: 'school3',
                title: '课程列表'
              }, {
                index: 'school4',
                title: '小节列表'
              }, {
                index: 'school5',
                title: '商学院分享',
              }
            ]
          },
          //读书模块
          {
            icon: 'el-icon-document',
            index: 'Reading',
            title: '读书',
            subs: [
              {
                index: 'Classification',
                title: '读书解读分类'
              }, {
                index: 'ReadingList',
                title: '图书列表'
              },
            ]
          },
          //标签管理
          {
            icon: 'el-icon-view',
            index: 'LabelManagement',
            title: '标签管理',
            subs: [
              {
                index: 'Label',
                title: '标签管理'
              }
            ]
          },
          {
            icon: 'el-icon-tickets',
            index: 'ActivityManageMent',
            title: '活动管理',
            subs: [
              {
                index: 'ActivityCity',
                title: '活动城市'
              },
              {
                index: 'ActivityTicket',
                title: '活动门票'
              },
              {
                index: 'Activity',
                title: '活动列表'
              },
              {
                index: 'ActivityRegistrations',
                title: '报名列表'
              },
            ]
          },
          {
            icon: 'el-icon-date',
            index: 'PromotionManagement',
            title: '推广管理',
            subs: [
              {
                index: 'HomeBanner',
                title: '首页banner'
              },
              {
                index: 'InvitationPoster',
                title: '邀请海报'
              },
              {
                index: 'MineLB',
                title: '我的轮播图'
              },
              {
                index: 'CourseMarketing',
                title: '课程促销'
              }
            ]
          },
          {
            icon: 'el-icon-message',
            index: 'PushManagement',
            title: '推送',
            subs: [
              {
                index: 'contentpush',
                title: '内容发送'

              }
            ]
          },
          {
            icon: 'el-icon-edit-outline',
            index: 'ChanPinMoKuai',
            title: '产品模块',
          },
          {
            icon: 'el-icon-edit-outline',
            index: 'Medialibrary',
            title: '媒体库',
            subs: [
              {
                index: 'ImgMedialibrary',
                title: '图片媒体库'

              },
              {
                index: 'AudioMedialibrary',
                title: '音频媒体库'
              }
            ]
          },
          {
            icon: 'el-icon-date',
            index: 'IntegralMall',
            title: '积分兑换',
            subs: [
              {
                index: 'ModuleSettings',
                title: '模块设置'

              },
              {
                index: 'CourseDesign',
                title: '课程设置'
              }
            ]
          },
        ]
      }
    },
    components: {
      vSidebar, vTabs
    },
    created() {
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