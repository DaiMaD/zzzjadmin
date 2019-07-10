<template>
    <div class="wrapper">
        <!--用户管理-->
        <v-sidebar :slidebarData="slidebarData6" v-if="slidebarData6.length>0"></v-sidebar>
        <v-tabs></v-tabs>
        <!--<div class="content" :class="{'content-collapse':collapse}">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>-->
    </div>
</template>

<script>

    import vSidebar from './Sidebar.vue';
    import bus from '../common/bus';
    import { getRouteTree } from '../../api/api';
    import vTabs from './Tabs6.vue';
    export default {
        data() {
            return {
                collapse: false,
                slidebarData6: [

                ]
            }
        },
        components: {
            vSidebar, vTabs
        },
        created() {
            getRouteTree().then(res => {
                this.slidebarData6 = res.data[4].subs;
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