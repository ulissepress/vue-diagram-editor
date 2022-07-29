import './assets/app.css';

import { createApp } from 'vue';
import App from './App.vue';
import Connection from "./components/diagram-editor/blocks/Connection.vue";
import Ellipse from "./components/diagram-editor/blocks/Ellipse.vue";
import Icon from "./components/diagram-editor/blocks/Icon.vue";
import Image from "./components/diagram-editor/blocks/Image.vue";
import Line from "./components/diagram-editor/blocks/Line.vue";
import Rectangle from "./components/diagram-editor/blocks/Rectangle.vue";
import Star from "./components/diagram-editor/blocks/Star.vue";
import Text from "./components/diagram-editor/blocks/Text.vue";
import Triangle from "./components/diagram-editor/blocks/Triangle.vue";

const app = createApp(App);

app.component('Text',      Text);
app.component('Line',      Line);
app.component('Rectangle', Rectangle);
app.component('Ellipse',   Ellipse);
app.component('Triangle',  Triangle);
app.component('Star',      Star);
app.component('Image',     Image);
app.component('Icon',      Icon);

app.component('Connection',  Connection);

app.mount('#app')