<template>
    <div class="wrapper">
        <!--系统管理-->
        <v-sidebar :slidebarData="slidebarData7" v-if="slidebarData7.length>0"></v-sidebar>
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
    import vTabs from './Tabs7.vue';
    export default {
        data() {
            return {
                collapse: false,
                slidebarData7: [

                ]
            }
        },
        components: {
            vSidebar, vTabs
        },
        created() {
            getRouteTree().then(res => {
                this.slidebarData7 = res.data[5].subs;
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