/* eslint-disable no-restricted-syntax */
<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)">
      </div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button @click.prevent="newSong(song)"
        type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
          focus:outline-none">
          <i class="fas"
            :class="{'fa-play': !playing || playing && !isCurrentSong,
              'fa-pause': playing && isCurrentSong}"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{song.modified_name}}</div>
          <div>{{song.genre}}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{song.comment_count}})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div class="text-white text-center font-bold p-4 mb-4" v-if="comment_show_alert"
            :class="comment_alert_variant">
            {{comment_alert_message}}
          </div>
          <vee-form :validation-schema="schema" @submit="submitComment" v-if="userLoggedIn">
              <label for="text-area">
                  <vee-field name = "comment" type = "text-area"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                      transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                      placeholder="Your comment here..." id="text-area"></vee-field>
                        <ErrorMessage class="text-red-600" name="comment" />
              </label>
            <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission">
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <label for="select1">
              <select v-model="sort"
              class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded">
              <option value="1">Latest</option>
              <option value="2">Oldest</option>
              </select>
          </label>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <comment-component v-for="comment in sortedComments" :key="comment.docID"
        :comment="comment"/>
    </ul>
  </main>
</template>

<script>
import {
  songsCollection, auth, commentsCollection, usersCollection,
} from '@/includes/firebase';
import store from '@/store/index';
import CommentComponent from '@/components/Comment.vue';

export default {
  name: 'Song-View',
  components: {
    CommentComponent,
  },
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait, your comment is being submitted.',
      comments: [],
      sort: '1',
    };
  },
  computed: {
    userLoggedIn() {
      return store.state.userLoggedIn;
    },
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return b.datePosted.toDate() - a.datePosted.toDate();
        }
        return a.datePosted.toDate() - b.datePosted.toDate();
      });
    },
    playing() {
      return store.getters.playing;
    },
    isCurrentSong() {
      if (store.getters.currentSong.docID === this.$route.params.id) {
        return true;
      }
      return false;
    },
  },
  methods: {
    newSong(_song) {
      if (this.isCurrentSong) {
        store.commit('toggleAudio');
      } else {
        store.dispatch('newSong', _song);
      }
    },
    async submitComment(values, context) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait, your comment is being submitted.';

      const comment = {
        content: values.comment,
        datePosted: new Date(),
        sid: this.$route.params.id,
        uid: auth.currentUser.uid,
      };

      await commentsCollection.add(comment);

      this.song.comment_count += 1;

      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count,
      });

      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_message = 'Comment added!';

      context.resetForm();
    },
    async getComments() {
      const snapshots = await commentsCollection.where('sid', '==', this.$route.params.id).get();
      this.comments = [];

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const comment of this.comments) {
        // eslint-disable-next-line no-await-in-loop
        const userSnapshot = await usersCollection.doc(comment.uid).get();
        const userName = userSnapshot.data().name;
        comment.userName = userName;
      }
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
  async beforeRouteEnter(to, from, next) {
    const docSnapshot = await songsCollection.doc(to.params.id).get();

    next(async (vm) => {
      if (!docSnapshot.exists) {
        vm.$router.push({ name: 'home' });
        return;
      }

      const { sort } = vm.$route.query;

      // eslint-disable-next-line no-param-reassign
      vm.sort = sort === '1' || sort === '2' ? sort : '1';

      // eslint-disable-next-line no-param-reassign
      vm.song = docSnapshot.data();
      await vm.getComments();

      // eslint-disable-next-line no-param-reassign
      vm.song.comment_count = vm.comments.length;
    });
  },
};
</script>

<style>

</style>
