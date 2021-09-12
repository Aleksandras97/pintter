import { createStore } from "vuex";
import authModules from "./auth/index";
import pintModules from "./pints/index";
import commentModules from "./comment/index";

const store = createStore({
  modules: {
    auth: authModules,
    pint: pintModules,
    com: commentModules,
  },
  state() {
    return {};
  },
  getters: {},
  mutations: {},
  actions: {},
});

export default store;
