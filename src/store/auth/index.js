import axios from "axios";
let timer;

const authModules = {
  state() {
    return {
      userId: null,
      userEmail: null,
      token: null,
      didAutoLogout: false,
    };
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    userEmail(state) {
      return state.userEmail;
    },
    token(state) {
      return state.token;
    },
    isAuth(state) {
      return !!state.token;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
  mutations: {
    setUser(state, data) {
      state.token = data.token;
      state.userId = data.userId;
      state.tokenExpiration = data.tokenExpiration;
      state.didAutoLogout = false;
    },
    setUserData(state, email) {
      state.userEmail = email;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async login(ctx, data) {
      return ctx.dispatch("auth", {
        ...data,
        mode: "login",
      });
    },

    async signup(ctx, data) {
      return ctx.dispatch("auth", {
        ...data,
        mode: "signup",
      });
    },

    async auth(ctx, data) {
      const mode = data.mode;
      let URL =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCKvBP0pCGylUVc_mn24iw67SrIdIZsnTI";

      if (mode === "signup") {
        URL =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCKvBP0pCGylUVc_mn24iw67SrIdIZsnTI";
      }
      await axios
        .post(URL, {
          email: data.email,
          password: data.password,
          returnSecureToken: true,
        })
        .then((res) => {
          const resData = res.data;

          const expiresIn = +resData.expiresIn * 1000;
          const expirationDate = new Date().getTime() + expiresIn;

          localStorage.setItem("token", resData.idToken);
          localStorage.setItem("userId", resData.localId);
          localStorage.setItem("tokenExpiration", expirationDate);

          ctx.dispatch("getUserData", token);

          timer = setTimeout(() => {
            ctx.dispatch("autoLogout");
          }, expiresIn);

          ctx.commit("setUser", {
            token: resData.idToken,
            userid: resData.localId,
          });
          ctx.commit('setUserData', resData.email)
        })
        .catch((err) => {
          throw `Email or password is incorrect (${err.message})`;
        });
    },
    tryLogin(ctx) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const expiresIn = +tokenExpiration - new Date().getTime();
      if (expiresIn < 0) {
        return;
      }

      ctx.dispatch("getUserData", token);

      timer = setTimeout(() => {
        ctx.dispatch("autoLogout");
      }, expiresIn);

      if (token && userId) {
        ctx.commit("setUser", {
          token,
          userId,
        });
      }
    },
    getUserData(ctx, idToken) {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCKvBP0pCGylUVc_mn24iw67SrIdIZsnTI",
          {
            idToken,
          }
        )
        .then((res) => {
          const resData = res.data;
          const userEmail = resData.users[0].email;
          ctx.commit("setUserData", userEmail);
        })
        .catch((err) => {
          throw `Failed to fetch user data (${err.message})`;
        });
    },
    logout(ctx, state) {
      localStorage.clear();

      clearTimeout(timer);
      ctx.commit("setUser", {
        token: null,
        userId: null,
      });
    },
    autoLogout(ctx) {
      ctx.dispatch("logout");
      ctx.commit("setAutoLogout");
    },
  },
};

export default authModules;
