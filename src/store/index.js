import Vue from "vue";
import Vuex from "vuex";
import Supervisors from './modules/supervisors/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    Supervisors
  },
});
