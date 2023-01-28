import './assets/app.css';
// Import Quasar css
import 'quasar/src/css/index.sass';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

import App from './App.vue';
import { Quasar } from 'quasar';
import { createApp } from 'vue';
import router from './router';

const app = createApp(App);

app.use(router);

app.use(Quasar, {
    plugins: {}, 
})

app.mount('#app')