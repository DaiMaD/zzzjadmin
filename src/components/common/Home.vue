<template>
    <div class="wrapper">
        <v-sidebar :slidebarData="this.slidebarData"></v-sidebar>
        <div class="content" :class="{'content-collapse':collapse}">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    
    import vSidebar from './Sidebar.vue';
    import bus from '../common/bus';
    export default {
        data(){
            return {
                collapse: false,
                slidebarData: []
            }
        },
        components:{
            vSidebar
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>
<style type="text/css">
	
</style>
