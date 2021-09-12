<template>
  <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
    <div class="col">
      <q-input
        class="new-pint"
        bottom-slots
        v-model="newComment"
        placeholder="Write a reply?"
        counter
        maxlength="280"
        autogrow
      >
        <template v-slot:before>
          <q-avatar size="xl">
            <img
              src="https://lh3.googleusercontent.com/ogw/ADea4I5HtYisyVZGJxJhzH9ipyVZcePNJPNVY5GRdaAtrg=s83-c-mo"
            />
          </q-avatar>
        </template>
      </q-input>
    </div>
    <div class="col col-shrink">
      <q-btn
        @click="addNewComment"
        class="q-mb-lg"
        :disable="!newComment"
        unelevated
        rounded
        color="primary"
        no-caps
        label="Reply"
      />
    </div>
  </div>
</template>

<script>
export default {
  emits: ["add-comment"],
  data() {
    return {
      newComment: "",
    };
  },
  methods: {
    addNewComment() {
      this.$emit("add-comment", this.newComment);
      this.newComment = "";
    },
  },
};
</script>

<style scoped></style>
