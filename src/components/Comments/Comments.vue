<template>
  <q-list v-for="comment in comments" :key="comment.id" separator>
    <comment-item
      @delete-comment="deleteComment"
      @updated-liked="updateLiked"
      :id="comment.id"
      :content="comment.content"
      :date="comment.date"
      :liked="comment.liked"
      :postId="postId"
      :commentUserEmail="comment.user.email"
      :commentUserId="comment.user.id"
    />
  </q-list>
</template>

<script>
import CommentItem from "./CommentItem.vue";
export default {
  components: { CommentItem },
  emits: ['update-liked', 'delete-comment'],
  props: ["comments", "postId"],
  methods: {
    updateLiked(id) {
      this.$emit('update-liked', id)
    },
    deleteComment(id) {
      this.$emit("delete-comment", id);
    },
  }
};
</script>

<style lang="sass" scoped>
</style>
