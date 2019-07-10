<template>
    <div class="wrapper">
        <!--用户管理-->
        <v-sidebar :slidebarData="slidebarData6"></v-sidebar>
        <v-tabs></v-tabs>
        <!--<div class="content" :class="{'content-collapse':collapse}">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>-->
    </div>
</template>

<script>

    import vSidebar from './Sidebar.vue';
    import bus from '../common/bus';
    import vTabs from './Tabs6.vue';
    export default {
        data() {
            return {
                collapse: false,
                slidebarData6: [
                    {
                        icon: 'el-icon-rank',
                        index: '10',
                        title: '用户管理',
                        subs: [
                            {
                                index: 'UserList',
                                title: '用户列表'
                            },
                            {
                                index: 'Collection',
                                title: '用户收藏'
                            }
                        ]
                    }
                ]
                // slidebarData6: [
                //     {
                //         index: 'UserList',
                //         title: '用户列表'
                //     },
                //     {
                //         index: 'Collection',
                //         title: '用户收藏'
                //     }
                // ]
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