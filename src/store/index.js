import Vue from "vue";
import Vuex from "vuex";
import Seller from './modules/seller/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    Seller
  },
});
