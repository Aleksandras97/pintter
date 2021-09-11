import axios from "axios";

const commentModules = {
  namespaced: true,
  state() {
    return {
      comments: [
        {
          id: "c1",
          contect: "Maximilian",
          date: 1631276929992,
          liked: false,
          postId: "p1",
        },
      ],
    };
  },
  getters: {
    comments(state) {
      return state.comments;
    },
  },
  mutations: {
    setComments(state, data) {
      state.comments = data;
    },
    setComment(state, comment) {
      state.comments.unshift(comment);
    },
    deleteComment(state, data) {
      const index = state.comments.findIndex(
        (comment) => comment.id === data.id
      );
      state.comments.splice(index, 1);
    },
  },
  actions: {
    async loadComments(ctx, pintId) {
      await axios
        .get(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${pintId}/comments.json`
        )
        .then((res) => {
          const resData = res.data;
          // console.log('pint Comments', resData);

          const comments = [];

          for (const key in resData) {
            const comment = {
              id: key,
              content: resData[key].content,
              date: resData[key].date,
              liked: resData[key].liked,
              pintId: resData[key].pintId,
            };
            comments.push(comment);
          }
          console.log("pint Comments 2", comments);
          ctx.commit("setComments", comments);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    addComment(ctx, data) {

      const token = ctx.rootGetters.token

      const comment = {
        ...data,
      };

      axios
        .post(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${data.pintId}/comments.json?auth=${token}`,
          {
            ...comment,
          }
        )
        .then((res) => {
          console.log(res);
          ctx.commit("setComment", {
            ...comment,
            id: res.data.name,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateLiked(ctx, { pint, comment }) {
      const token = ctx.rootGetters.token

      axios.patch(
        `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${pint.id}/comments/${comment.id}.json?auth=${token}`,
        {
          liked: comment.liked,
        }
      );
    },
    deleteComment(ctx, comment) {
      const token = ctx.rootGetters.token

      axios
        .delete(
          `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${comment.pintId}/comments/${comment.id}.json?auth=${token}`
        )
        .then(() => {
          ctx.commit("deleteComment", {
            ...comment,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};

export default commentModules;
