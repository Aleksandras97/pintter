<template>
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
          {{ commentUserEmail }} <br class="lt-md" />
          &bull; {{ relativeDate }}
        </span>
      </q-item-label>
      <q-item-label class="pint-content text-body1">
        {{ content }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <div class="pint-icons row justify-evenly q-mt-sm q-px-lg icons-seperator">
    <q-btn
      flat
      round
      @click="$emit('updated-liked', id)"
      :color="liked ? 'pink' : 'gray'"
      :icon="liked ? 'fas fa-heart' : 'far fa-heart'"
      size="sm"
    />
    <q-btn
      v-if="logedInUser.id === commentUserId"
      flat
      round
      color="grey"
      icon="fas fa-trash"
      size="sm"
      @click="$emit('delete-comment', id)"
    />
  </div>
</template>

<script>
import { formatDistance } from "date-fns";
export default {
  emits: ["updated-liked", "delete-comment"],
  props: [
    "liked",
    "content",
    "date",
    "id",
    "postId",
    "commentUserEmail",
    "commentUserId",
  ],
  computed: {
    relativeDate() {
      const date = formatDistance(this.date, new Date());
      return date;
    },
    logedInUser() {
      return this.$store.getters.user;
    },
    email() {
      return this.user.email;
    },
  },
};
</script>

<style lang="sass" scoped></style>
