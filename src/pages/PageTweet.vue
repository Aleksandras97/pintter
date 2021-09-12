<template>
  <q-page class="q-pa-sm">
    <!-- <q-scroll-area class="absolute full-width full-height"> -->
    <template v-if="loading">
      <div class="flex flex-center">
        <q-spinner-cube color="blue" size="5.5em" />
      </div>
    </template>
    <template v-else>
      <q-item>
        <q-item-section avatar top>
          <q-avatar size="xl">
            <img
              src="https://lh3.googleusercontent.com/ogw/ADea4I5HtYisyVZGJxJhzH9ipyVZcePNJPNVY5GRdaAtrg=s83-c-mo"
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle1">
            <!-- <strong>Aleksandr Narusevic</strong> -->
            <span class="text-grey-9">
              {{ pint.user.email }} <br class="lt-md" />
              &bull; {{ relativeDate }}
            </span>
          </q-item-label>
          <q-item-label class="pint-content text-body1">
            {{ pint.content }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div
        class="
          pint-icons
          row
          justify-evenly
          items-center
          q-mt-sm q-px-lg
          icons-seperator
        "
      >
        <div>
          <span class="numbers">{{ commentCount }}</span>
          <q-btn flat round color="grey" icon="fas fa-comment" size="sm" />
        </div>
        <q-btn flat round color="grey" icon="fas fa-retweet" size="sm" />
        <q-btn
          flat
          round
          @click="toggleLiked()"
          :color="pint.liked ? 'pink' : 'gray'"
          :icon="pint.liked ? 'fas fa-heart' : 'far fa-heart'"
          size="sm"
        />
        <q-btn
        v-if="logedInUser.id === pint.user.id"
          flat
          round
          color="grey"
          icon="fas fa-trash"
          size="sm"
          @click="deletePint()"
        />
      </div>
    </template>

    <add-new-comment @add-comment="addComment" />
    <q-separator size="1px" color="grey-4" />
    <comments
      :comments="comments"
      :postId="pintId"
      @update-liked="toggleLikedComment"
      @delete-comment="deletePintComment"
    />

    <!-- </q-scroll-area> -->
  </q-page>
</template>

<script>
import { formatDistance } from "date-fns";
import AddNewComment from "src/components/Comments/AddNewComment.vue";
import Comments from "src/components/Comments/Comments.vue";

export default {
  components: { AddNewComment, Comments },
  props: ["pintId"],
  data() {
    return {
      loading: false,
      newComment: "",
    };
  },
  methods: {
    toggleLiked() {
      if (!this.isLoggedIn) {
        this.$router.push(`/auth?redirect=pints/${this.pintId}`);
        return;
      }

      this.pint.liked = !this.pint.liked;
      // Toggle the "liked" field of the pint
      this.$store.dispatch("pint/updateLiked", this.pint);
    },
    toggleLikedComment(id) {
      if (!this.isLoggedIn) {
        this.$router.push(`/auth?redirect=pints/${this.pintId}`);
        return;
      }
      const index = this.comments.findIndex((comment) => comment.id === id);
      this.comments[index].liked = !this.comments[index].liked;
      // Toggle the "liked" field of the pint comment
      this.$store.dispatch("com/updateLiked", {
        pint: this.pint,
        comment: this.comments[index],
      });
    },
    addComment(comment) {
      if (!this.isLoggedIn) {
        this.$router.push(`/auth?redirect=pints/${this.pintId}`);
        return;
      }

      const user = this.logedInUser;

      const newComment = {
        content: comment,
        date: Date.now(),
        liked: false,
        pintId: this.pintId,
        user,
      };

      this.$store.dispatch("com/addComment", newComment);

      this.newComment = "";
    },
    async deletePint() {
      if (!this.isLoggedIn) {
        this.$router.push(`/auth?redirect=pints/${this.pintId}`);
        return;
      }
      this.$store.dispatch("pint/deletePint", this.pint);
      this.$router.replace("/pints");
    },
    deletePintComment(id) {
      if (!this.isLoggedIn) {
        this.$router.push(`/auth?redirect=pints/${this.pintId}`);
        return;
      }
      const comment = this.comments.find((comment) => comment.id === id);

      this.$store.dispatch("com/deleteComment", comment);
    },
    async loadTweetAndComments() {
      this.loading = true;

      // const pints = this.$store.getters["pint/pints"];
      await this.$store.dispatch("pint/loadPint", this.pintId);
      await this.$store.dispatch("com/loadComments", this.pintId);

      this.loading = false;
    },
  },
  created() {
    this.loadTweetAndComments();
  },
  computed: {
    relativeDate() {
      const date = formatDistance(this.pint.date, new Date());
      return date;
    },
    commentCount() {
      return this.comments.length;
    },
    pint() {
      const pint = this.$store.getters["pint/pints"].find(
        (pint) => pint.id === this.pintId
      );

      return pint;
    },
    comments() {
      const comments = this.$store.getters["com/comments"];
      return comments;
    },
    isLoggedIn() {
      return this.$store.getters.isAuth;
    },
    logedInUser(){
      return this.$store.getters.user;
    }
  },
};
</script>

<style lang="sass">
.icons-seperator
  border-top: 1px solid #ccc
  border-bottom: 1px solid #ccc

.new-pint
  textarea
    font-size: 19px
    line-height: 1.4 !important

.numbers
  color: $grey-9
</style>
