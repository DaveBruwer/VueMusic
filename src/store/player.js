import { createStore } from 'vuex';
import { Howl } from 'howler';

export default createStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    testString: 'usePlayerStore test string',
  }),
  mutations: {
    newSong(state, song) {
      console.log('newSong mutation triggered!');
      state.current_song = song;

      state.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      state.sound.play();
    },
  },
  actions: {
    newSong(context, song) {
      context.commit('newSong', song);
    },
  },
});
