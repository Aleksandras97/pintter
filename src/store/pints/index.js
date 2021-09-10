import axios from "axios";

const pintModules = {
  namespaced: true,
  state() {
    return {
      pints: [
        // {
        //   id: "c1",
        //   contect: "Maximilian",
        //   date: 1631276929992,
        //   liked: false,
        // },
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
      this.$router.replace('/pints')
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
            };
            pints.push(pint);
          }

          ctx.commit("setPints", pints);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async loadPint(ctx, pintId) {
      await axios
        .get(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${pintId}.json`
        )
        .then((res) => {
          const resData = res.data;
          console.log("loadPint", resData);

          const pints = [];

          const pint = {
            id: pintId,
            content: resData.content,
            date: resData.date,
            liked: resData.liked,
          };

          pints.push(pint);

          ctx.commit("setPints", pints);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    addPint(ctx, data) {
      const pint = {
        ...data,
      };

      axios
        .post(
          "https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints.json",
          {
            ...pint,
          }
        )
        .then((res) => {
          console.log(res);
          ctx.commit("setPint", {
            ...pint,
            id: res.data.name,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateLiked(_, data) {
      console.log("update pint data", data);
      axios.patch(
        `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${data.id}.json`,
          {liked: data.liked}

      );
    },
    deletePint(ctx, pint) {
      axios
        .delete(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${pint.id}.json`
        )
        .then(() => {
          ctx.commit("deletePint", {
            ...pint,
          });
        });
    },
  },
};

export default pintModules;
