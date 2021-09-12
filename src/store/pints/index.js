import axios from "axios";

const pintModules = {
  namespaced: true,
  state() {
    return {
      pints: [
      ],
    };
  },
  getters: {
    pints(state) {
      return state.pints;
    },
  },
  mutations: {
    setPints(state, data) {
      state.pints = data;
    },
    setPint(state, pint) {
      state.pints.unshift(pint);
    },
    deletePint(state, data) {
      const index = state.pints.findIndex((pint) => pint.id === data.id);
      state.pints.splice(index, 1);
      this.$router.replace("/pints");
    },
  },
  actions: {
    loadPints(ctx) {
      axios
        .get(
          "https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints.json"
        )
        .then((res) => {
          const resData = res.data;

          const pints = [];

          for (const key in resData) {
            const pint = {
              id: key,
              content: resData[key].content,
              date: resData[key].date,
              liked: resData[key].liked,
              user: resData[key].user,
            };
            pints.push(pint);
          }

          ctx.commit("setPints", pints);
        })
        .catch((err) => {
          throw `Failed to fetch data (${err.message})`;
        });
    },
    async loadPint(ctx, pintId) {
      await axios
        .get(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${pintId}.json`
        )
        .then((res) => {
          const resData = res.data;

          const pints = [];

          const pint = {
            id: pintId,
            content: resData.content,
            date: resData.date,
            liked: resData.liked,
            user: resData.user,
          };

          pints.push(pint);

          ctx.commit("setPints", pints);
        })
        .catch((err) => {
          throw `Failed to fetch data (${err.message})`;
        });
    },
    addPint(ctx, data) {
      const pint = {
        ...data,
      };

      const token = ctx.rootGetters.token;
      const userId = ctx.rootGetters.token;

      axios
        .post(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints.json?auth=${token}`,
          {
            ...pint,
          }
        )
        .then((res) => {
          ctx.commit("setPint", {
            ...pint,
            id: res.data.name,
            userId: userId,
          });
        })
        .catch((err) => {
          throw `Failed to create data (${err.message})`;
        });
    },
    updateLiked(ctx, data) {
      const token = ctx.rootGetters.token;
      axios.patch(
        `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${data.id}.json?auth=${token}`,
        { liked: data.liked }
      );
    },
    deletePint(ctx, pint) {
      const token = ctx.rootGetters.token;

      axios
        .delete(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${pint.id}.json?auth=${token}`
        )
        .then(() => {
          ctx.commit("deletePint", {
            ...pint,
          });
        })
        .catch((err) => {
          throw `Failed to destroy data (${err.message})`;
        });
    },
  },
};

export default pintModules;
