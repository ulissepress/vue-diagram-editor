import App from './App.vue';
import CustomShape from "./components/CustomShape.vue";
import Ellipse from "./components/Ellipse.vue";
import { createApp } from 'vue';

const app = createApp(App);

app.component('CustomShape', CustomShape);
app.component('Ellipse', Ellipse);

app.mount('#app')
