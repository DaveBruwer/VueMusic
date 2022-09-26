<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
        <div>
            <h4 class="inline-block text-2xl font-bold">{{song.modified_name}}</h4>
            <div v-show="!showForm">
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                  @click.prevent="deleteSong">
                    <i class="fa fa-times"></i>
                </button>
                <button @click.prevent="showForm = !showForm"
                    class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>
        </div>
        <div v-show="showForm">
            <div class= "text-white text-center font-bold p-4 mb-4" v-if="show_alert"
              :class="alert_variant">{{this.alert_message}}</div>
            <vee-form :validation-schema="schema" :initial-values="song" @submit="submit">
                <div class="mb-3">
                    <label class="inline-block mb-2" for="song-title">Song Title
                        <vee-field name="modified_name" type="text" id="song-title"
                          v-model="formSongTitle" @input="updateUnsavedFlag(true)"
                          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                            transition duration-500 focus:outline-none focus:border-black rounded"
                          placeholder="Enter Song Title" />
                        <ErrorMessage class="text-red-600" name="modified_name" />
                    </label>
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2" for="genre">Genre
                        <vee-field type="text" id="genre" v-model="formSongGenre" name="genre"
                            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                            transition duration-500 focus:outline-none focus:border-black rounded"
                            placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
                        <ErrorMessage class="text-red-600" name="genre" />
                    </label>
                </div>
                <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
                  :disabled="in_submission">
                Submit
                </button>
                <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
                    @click.prevent="showForm = false" :disabled="in_submission">
                Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";

export default {
  name: "composition-item",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    songIndex: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      formSongTitle: this.song.modified_name,
      formSongGenre: this.song.genre,
      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "Please wait! Updating song info.",
    };
  },
  methods: {
    async submit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = "Please wait! Updating song info.";

      console.log(values);

      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = "Something went wrong! Please try again.";
        return;
      }

      this.updateSong(this.songIndex, values);
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_message = "Success!";
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docID).delete();

      this.removeSong(this.songIndex);
    },
  },
  emits: ["song-update"],
};
</script>

<style>

</style>
