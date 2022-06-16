import './assets/app.css';

import App from './App.vue';
import CustomShape from "./components/diagram-editor/CustomShape.vue";
import Ellipse from "./components/diagram-editor/Ellipse.vue";
import Image from "./components/diagram-editor/Image.vue";
import Line from "./components/diagram-editor/Line.vue";
import Shape from "./components/diagram-editor/Shape.vue";
import { createApp } from 'vue';

const app = createApp(App);

app.component('Line',        Line);
app.component('Shape',       Shape);
app.component('CustomShape', CustomShape);
app.component('Ellipse',     Ellipse);
app.component('Image',       Image);

app.mount('#app')