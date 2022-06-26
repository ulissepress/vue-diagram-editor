import './assets/app.css';

import App from './App.vue';
import Connection from "./components/diagram-editor/blocks/Connection.vue";
import CustomShape from "./components/diagram-editor/blocks/CustomShape.vue";
import Ellipse from "./components/diagram-editor/blocks/Ellipse.vue";
import Image from "./components/diagram-editor/blocks/Image.vue";
import Line from "./components/diagram-editor/blocks/Line.vue";
import Rectangle from "./components/diagram-editor/blocks/Rectangle.vue";
import Star from "./components/diagram-editor/blocks/Star.vue";
import Triangle from "./components/diagram-editor/blocks/Triangle.vue";
import { createApp } from 'vue';

const app = createApp(App);

app.component('Line',      Line);
app.component('Rectangle', Rectangle);
app.component('Ellipse',   Ellipse);
app.component('Triangle',  Triangle);
app.component('Star',      Star);
app.component('Image',     Image);

app.component('CustomShape', CustomShape);
app.component('Connection',  Connection);

app.mount('#app')