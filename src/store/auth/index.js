import axios from "axios";

const authModules = {
  state() {
    return {
      userId: null,
      token: null,
      tokenExpiration: null,
    };
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token
    }
  },
  mutations: {
    setUser(state, data) {
      state.token = data.token;
      state.userId = data.userId;
      state.tokenExpiration = data.tokenExpiration;
    },
  },
  actions: {
    login(ctx, data) {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCKvBP0pCGylUVc_mn24iw67SrIdIZsnTI",
          {
            email: data.email,
            password: data.password,
            returnSecureToken: true,
          }
        )
        .then((res) => {
          const resData = res.data;
          ctx.commit("setUser", {
            token: resData.idToken,
            userid: resData.localId,
            tokenExpiration: resData.exipresIn,
          });
        })
        .catch((err) => {
          throw `Email or password is incorrect (${err.message})`
        });
    },
    signup(ctx, data) {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCKvBP0pCGylUVc_mn24iw67SrIdIZsnTI",
          {
            email: data.email,
            password: data.password,
            returnSecureToken: true,
          }
        )
        .then((res) => {
          const resData = res.data;
          ctx.commit("setUser", {
            token: resData.idToken,
            userid: resData.localId,
            tokenExpiration: resData.exipresIn,
          });
        })
        .catch((err) => {
          throw `Email or password is incorrect (${err.message})`
        });
    },
  },
};

export default authModules;
