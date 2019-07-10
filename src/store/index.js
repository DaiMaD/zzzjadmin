import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {//全局状态存储}
  roleArr: []
}


const getters = {//实时监听state值的变化(最新状态)
  isChange(state) {//承载变化的roleArr的值
    return state.roleArr
  }
}

const mutations = {
  changeRole(state, arr) {//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    state.roleArr = arr
  }
}

const actions = { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
  setRole({ commit }, arr) {
    commit('changeRole', arr)
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;