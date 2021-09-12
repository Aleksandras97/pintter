import axios from "axios";

const commentModules = {
  namespaced: true,
  state() {
    return {
      comments: [],
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

          const comments = [];

          for (const key in resData) {
            const comment = {
              id: key,
              content: resData[key].content,
              date: resData[key].date,
              liked: resData[key].liked,
              pintId: resData[key].pintId,
              user: resData[key].user,
            };
            comments.push(comment);
          }
          ctx.commit("setComments", comments);
        })
        .catch((err) => {
          throw `Failed to fetch user data  (${err.message})`;
        });
    },
    addComment(ctx, data) {
      const token = ctx.rootGetters.token;

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
          ctx.commit("setComment", {
            ...comment,
            id: res.data.name,
          });
        })
        .catch((err) => {
          throw `Failed to create data (${err.message})`;
        });
    },
    updateLiked(ctx, { pint, comment }) {
      const token = ctx.rootGetters.token;

      axios.patch(
        `https://pintter-96560-default-rtdb.europe-west1.firebasedatabase.app/pints/${pint.id}/comments/${comment.id}.json?auth=${token}`,
        {
          liked: comment.liked,
        }
      );
    },
    deleteComment(ctx, comment) {
      const token = ctx.rootGetters.token;

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
          throw `Failed to destroy data (${err.message})`;
        });
    },
  },
};

export default commentModules;
