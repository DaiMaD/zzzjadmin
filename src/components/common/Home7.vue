<template>
    <div class="wrapper">
        <!--系统管理-->
        <v-sidebar :slidebarData="slidebarData7"></v-sidebar>
        <v-tabs></v-tabs>
        <!--<div class="content" :class="{'content-collapse':collapse}">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>-->
    </div>
</template>

<script>

    import vSidebar from './Sidebar.vue';
    import bus from '../common/bus';
    import vTabs from './Tabs7.vue';
    export default {
        data() {
            return {
                collapse: false,
                slidebarData7: [
                    {
                        icon: 'el-icon-warning',
                        index: '11',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'AdministratorList',
                                title: '管理员列表'

                            },
                            {
                                index: 'Help',
                                title: '帮助信息'
                            },
                            // {
                            //     index: 'AdministratorList2',
                            //     title: '管理员列表2'
                            // },
                            {
                                index: 'UpdateHistory',
                                title: '版本更新'
                            }
                        ]
                    }
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