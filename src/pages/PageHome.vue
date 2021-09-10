<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="new-pint"
            bottom-slots
            v-model="newPint"
            placeholder="what's happening?"
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
            @click="addNewPint"
            class="q-mb-lg"
            :disable="!newPint"
            unelevated
            rounded
            color="primary"
            no-caps
            label="Pint"
          />
        </div>
      </div>

      <q-separator size="1rem" color="grey-2" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="q-py-md" v-for="pint in AllTweets" :key="pint.id">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img
                  src="https://lh3.googleusercontent.com/ogw/ADea4I5HtYisyVZGJxJhzH9ipyVZcePNJPNVY5GRdaAtrg=s83-c-mo"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Aleksandr Narusevic</strong>
                <span class="text-grey-7">
                  @aleksandr <br class="lt-md" />
                  &bull; {{ relativeDate(pint.date) }}</span
                >
              </q-item-label>
              <q-item-label class="pint-content text-body1">
                {{ pint.content }}
              </q-item-label>
              <div class="pint-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-comment"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  :color="pint.liked ? 'pink' : 'gray'"
                  :icon="pint.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  @click="toggleLiked(pint)"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  @click="deletePint(pint)"
                />
              </div>
              <div class="flex justify-center view-detail">
                <router-link :to="tweetDetailLink(pint)">
                  View Detail
                </router-link>
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { formatDistance } from "date-fns";

export default {
  data() {
    return {
      newPint: "",
      pints: [],
      isLoading: false,
    };
  },
  methods: {
    addNewPint() {
      const newPint = {
        content: this.newPint,
        date: Date.now(),
        liked: false,
      };

      this.$store.dispatch("pint/addPint", newPint);

      this.newPint = "";
    },
    toggleLiked(pint) {


      pint.liked = !pint.liked

      // Toggle the "liked" field of the pint
      this.$store.dispatch('pint/updateLiked', pint);

    },
    deletePint(data){

      this.$store.dispatch('pint/deletePint', data);


    },
    loadPints() {
      this.isLoading = true;

      this.$store.dispatch("pint/loadPints");

      this.isLoading = false;
    },
  },
  computed: {
    relativeDate() {
      return (value) => {
        return formatDistance(value, new Date());
      };
    },
    tweetDetailLink() {
      return (pint) => {
        const detailLink = this.$route.path + "/" + pint.id;
        return detailLink;
      };
    },
    AllTweets() {
      const pints = this.$store.getters["pint/pints"];
      return pints
    },
  },
  created() {
    this.loadPints();
  },
};
</script>

<style lang="sass">
.new-pint
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.pint-content
  white-space: pre-line

.pint-icons
  margin-left: -5px

.view-detail
  a
    text-decoration: none
    color: $primary
</style>
