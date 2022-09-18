import { createApp } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import './assets/main.css';
import VeeValidatePlugin from './includes/validation';
import { auth } from './includes/firebase';
import icon from './directives/icon';

registerSW({ immediate: true });

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.directive('icon', icon);

    app.mount('#app');
  }
});
