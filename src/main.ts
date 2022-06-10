import './assets/app.css';

import App from './App.vue';
import CustomShape from "./components/diagram-editor/CustomShape.vue";
import Ellipse from "./components/diagram-editor/Ellipse.vue";
import Image from "./components/diagram-editor/Image.vue";
import { createApp } from 'vue';

const app = createApp(App);

app.component('CustomShape', CustomShape);
app.component('Ellipse',     Ellipse);
app.component('Image',       Image);

app.mount('#app')
