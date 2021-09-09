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
            <strong>Aleksandr Narusevic</strong>
            <span class="text-grey-7">
              @aleksandr <br class="lt-md" />
              &bull; {{ relativeDate }}
            </span>
          </q-item-label>
          <q-item-label class="pint-content text-body1">
            {{ pint.content }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div
        class="pint-icons row justify-between items-center q-mt-sm q-px-lg icons-seperator"
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
import db from "../boot/firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import { formatDistance } from "date-fns";
import AddNewComment from "src/components/Comments/AddNewComment.vue";
import Comments from "src/components/Comments/Comments.vue";

export default {
  components: { AddNewComment, Comments },
  props: ["pintId"],
  data() {
    return {
      // pint: {
      // id: "p1",
      // content:
      //   "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam, impedit pariatur architecto ut explicabo fugit expedita iste ea alias molestiae odit dolorem ipsum, voluptatibus ipsam maxime repudiandae quam enim? Nam.",
      // date: Date.now() + 1,
      // liked: false,
      // },
      pint: null,
      loading: false,
      newComment: "",
      comments: [
        // {
        //   id: "c1",
        //   content:
        //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam, impedit pariatur architecto ut explicabo fugit expedita iste ea alias molestiae odit dolorem ipsum, voluptatibus ipsam maxime repudiandae quam enim? Nam.",
        //   date: Date.now(),
        //   pintId: this.pintId,
        // },
        // {
        //   id: "c2",
        //   content:
        //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam, impedit pariatur architecto ut explicabo fugit expedita iste ea alias molestiae odit dolorem ipsum, voluptatibus ipsam maxime repudiandae quam enim? Nam.",
        //   date: Date.now(),
        //   pintId: this.pintId,
        // },
        // {
        //   id: "c3",
        //   content:
        //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam, impedit pariatur architecto ut explicabo fugit expedita iste ea alias molestiae odit dolorem ipsum, voluptatibus ipsam maxime repudiandae quam enim? Nam.",
        //   date: Date.now(),
        //   pintId: this.pintId,
        // },
      ],
    };
  },
  methods: {
    async toggleLiked() {
      const pintRef = doc(db, "pints", this.pintId);
      // Toggle the "liked" field of the pint
      this.pint.liked = !this.pint.liked;

      await updateDoc(pintRef, {
        liked: this.pint.liked,
      });
    },
    async toggleLikedComment(id) {

      const pintRef = doc(db, "comments", id);

      const comment = this.comments.find((comment) => comment.id === id);

      // Toggle the "liked" field of the pint comment
      await updateDoc(pintRef, {
        liked: !comment.liked,
      });
    },
    addComment(comment) {
      const newComment = {
        content: comment,
        date: Date.now(),
        liked: false,
        pintId: this.pintId,
      };

      addDoc(collection(db, "comments"), {
        ...newComment,
      });
    },
    deletePint() {
      deleteDoc(doc(db, "pints", this.pintId));
      this.$router.replace("/");
    },
    deletePintComment(id) {
      deleteDoc(doc(db, "comments", id));
    },
    async getTweet() {
      this.loading = true;

      const docRef = doc(db, "pints", this.pintId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.pint = docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      this.loading = false;
    },
  },
  created() {
    this.getTweet();
  },
  computed: {
    relativeDate() {
      const date = formatDistance(this.pint.date, new Date());
      return date;
    },
    commentCount() {
      return this.comments.length
    }
  },
  mounted() {
    const q = query(
      collection(db, "comments"),
      where("pintId", "==", this.pintId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let commentChange = change.doc.data();
        commentChange.id = change.doc.id;
        if (change.type === "added") {
          // console.log("New comment: ", change.doc.data());
          this.comments.unshift(commentChange);
        }
        if (change.type === "modified") {
          // console.log("Modified comment: ", change.doc.data());
          let index = this.comments.findIndex(
            (comment) => comment.id === commentChange.id
          );
          Object.assign(this.comments[index], commentChange);
        }
        if (change.type === "removed") {
          // console.log("Removed comment: ", change.doc.data());
          let index = this.comments.findIndex(
            (comment) => comment.id === commentChange.id
          );
          this.comments.splice(index, 1);
        }
      });
    });
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
