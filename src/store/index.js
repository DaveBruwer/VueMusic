import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
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

      state.duration = helper.formatTime(state.sound.duration());

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

      commit('toggleAuth');
    },
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit('toggleAuth');
    },
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('toggleAuth');
      }
    },
    async signout({ commit }) {
      await auth.signOut();
      commit('toggleAuth');
    },
    async newSong({ commit, state, dispatch }, _song) {
      commit('newSong', _song);

      state.sound.on('play', () => {
        dispatch('progress');
      });
    },
    async toggleAudio({ commit }) {
      commit('toggleAudio');
    },
    progress({ state, dispatch }) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());

      if (state.sound.playing()) {
        requestAnimationFrame(() => { dispatch('progress'); });
      }
    },
  },
});
