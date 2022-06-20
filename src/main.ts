import './assets/app.css';

import App from './App.vue';
import Connection from "./components/diagram-editor/blocks/Connection.vue";
import CustomShape from "./components/diagram-editor/blocks/CustomShape.vue";
import Ellipse from "./components/diagram-editor/blocks/Ellipse.vue";
import Image from "./components/diagram-editor/blocks/Image.vue";
import Shape from "./components/diagram-editor/blocks/Shape.vue";
import { createApp } from 'vue';

const app = createApp(App);

app.component('Connection',  Connection);
app.component('Shape',       Shape);
app.component('CustomShape', CustomShape);
app.component('Ellipse',     Ellipse);
app.component('Image',       Image);

app.mount('#app')