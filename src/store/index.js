import { createStore } from "vuex";
import { auth, usersCollection } from "@/includes/firebase";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, song) {
      state.current_song = song;

      state.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      state.sound.play();
    },
    toggleAudio(state) {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
  },
  getters: {
    authModalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
    seek: (state) => state.seek,
    duration: (state) => state.duration,
    playerProgress: (state) => state.playerProgress,
    currentSong: (state) => state.current_song,
  },
  actions: {
    async register({ commit }, payload) {
      // eslint-disable-next-line max-len
      const userCred = await auth.createUserWithEmailAndPassword(payload.email, payload.password);

      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
        subscription: payload.subscription,
      });

      await userCred.user.updateProfile({
        displayName: payload.name,
        photoURL: `https://robohash.org/${userCred.user.uid}?set=set5&size=100x100`,
      });

      commit("toggleAuth");
    },
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit("toggleAuth");
    },
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit("toggleAuth");
      }
    },
    async signout({ commit }) {
      await auth.signOut();
      commit("toggleAuth");
    },
    async newSong({ commit, state, dispatch }, _song) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit("newSong", _song);

      const songUser = await usersCollection.doc(state.current_song.uid).get();

      state.current_song.display_name = songUser.data().name;

      state.sound.on("play", () => {
        dispatch("progress");
      });
    },
    async toggleAudio({ commit }) {
      commit("toggleAudio");
    },
    progress({ state, dispatch }) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());

      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;

      if (state.sound.playing()) {
        requestAnimationFrame(() => { dispatch("progress"); });
      }
    },
    updateSeek({ state, dispatch }, event) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);
      state.sound.once("seek", () => dispatch("progress"));
    },
  },
});
