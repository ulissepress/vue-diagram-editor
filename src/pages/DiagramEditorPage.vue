<template>
    <DiagramEditor
                :elements             = "elements"
                :readonly             = "false" 
                :customWidgets        = "true"
                :customWidgetsCatalog = "widgets" /> 
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive } from 'vue';
import DiagramEditor from '../components/diagram-editor/DiagramEditor.vue';
import { createConnection, createItem, registerWidgetType } from '../components/diagram-editor/helpers';
import { ConnectionStyle, ConnectionType, DiagramElement, WidgetDefinition } from '../components/diagram-editor/types';

import YouTubeWidget, { YoutubeWidgetItem } from '../components/custom-widgets/YouTubeWidget.vue';
import { PropertyType } from '../components/inspector/types';


const vueApp = getCurrentInstance()!.appContext.app;

// Register YouTubeWidget and related props
vueApp.component('YouTubeWidget', YouTubeWidget)
registerWidgetType<YoutubeWidgetItem>('YouTubeWidget', 
    { 
        video_id: 'FT3ODSg1GFE',
        w: 560,
        h: 315,
    } as YoutubeWidgetItem, 
    [ { name: "video_id",   label: "Video ID",   type: PropertyType.TEXT,  editorFullsize: true } ]
);

const widgets: WidgetDefinition[] = [
    { title: 'YouTube Video',        icon: "smart_display",    component: "YouTubeWidget", canBeResized: true },
    { title: 'Google Map',           icon: "location_on",      component: "" },
    { title: 'Event Classification', icon: "description",      component: "" },    
    { title: 'Event Action',         icon: "description",      component: "" },    
    { title: 'Event Attachment',     icon: "description",      component: "" },    
    { title: '8D Action',            icon: "description",      component: "" },    
    { title: '8D Root Cause',        icon: "description",      component: "" },    
];

let elements: DiagramElement[] = reactive([
    createItem({ id: 'a1', title: 'Angelo', x: 100, y: 150, w: 100, h: 80, backgroundColor: '#ff0000', textColor: '#ffffff' }),
    createItem({ id: 'a2', title: 'Mario',  x: 600, y: 130, w: 90,  h: 90, backgroundColor: '#00ff00', textColor: '#2c2c2c' }),
    createItem({ id: 'a3', title: 'Luca',   x: 300, y: 400, w: 200, h: 70, backgroundColor: '#0000ff', textColor: '#f7ff2d' }),
    
    createConnection('a1', 'a2'),
    createConnection('a1', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DOTTED }),
    createConnection('a2', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DASHED, backgroundColor: "#ff0000", thick: 5 }),
]);

</script>

