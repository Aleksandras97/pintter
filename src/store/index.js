import { createStore } from "vuex";
import authModules from "./auth/index";

const store = createStore({
  modules: {
    auth: authModules,
  },
  state() {
    return {};
  },
  getters: {},
  mutations: {},
  actions: {},
});

export default store;
