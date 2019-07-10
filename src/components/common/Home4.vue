<template>
    <div class="wrapper"><!--考试管理-->
        <v-sidebar :slidebarData="slidebarData4"></v-sidebar>
        <v-tabs></v-tabs>
        <!--<div class="content" :class="{'content-collapse':collapse}">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>-->
    </div>
</template>

<script>
    
    import vSidebar from './Sidebar.vue';
    import bus from '../common/bus';
    import vTabs from './Tabs4.vue';
    export default {
        data(){
            return {
                collapse: false,
                slidebarData4: [
                		{
                         icon: 'el-icon-edit',
                         index: '/home4',
                         title: '考试管理',
                         subs: [
                           {
                             index: 'Testpaperentrtiku',
                             title: '题库管理',
                             subs:[
                                 {
                                     index:'Testpaperentryxz',
                                     title:'选择题'
                                 },
                                 {
                                     index:'Testpaperentrypd',
                                     title:'判断题'
                                 },
                                 {
                                     index:'Testpaperentryjd',
                                     title:'简答题'
                                 },
                                 {
                                     index:'Testpaperentryzh',
                                     title:'综合题'
                                 }
                             ]
                           },{
                             index: 'Testpaperentryshenpi',
                             title: '考试管理'
                           },
                           {
                             index: 'Testpaperentryyulan',
                             title: '试卷预览'
                           },
                           {
                             index: 'Testpaperentrypigai',
                             title: '试卷批改'
                           },
                           {
                             index: 'Testpaperentrxueyuan',
                             title: '学员学籍管理',
                             subs: [
                             	{
	                             index: 'Testpaperentrksbm',
	                             title: '考试报名'
	                           },
	                           {
	                             index: 'Testpaperentrjgcx',
	                             title: '考试结果查询'
	                           }
                             ]
                           },
                         ]
                       }
                ]
            }
        },
        components:{
            vSidebar,vTabs
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>
<style type="text/css">
	.el-menu--horizontal>.el-menu-item{
		width: 12%;
	}
</style>
