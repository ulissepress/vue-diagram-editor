<template>
    <div style="width: 100%; height: 90%; padding-top: 16px; margin: 0 auto; ">
        <!-- <pre>{{ elements.map(e => { return e.id + ' / ' + e.x + ' / '+ e.y + ' / '+ e.w + ' / '+ e.h }  ) }}</pre> -->
        <DiagramEditor :elements             = "elements"
                       :readonly             = "false" 
                       :customWidgets        = "true"
                       :customWidgetsCatalog = "widgets" />
        <!-- 
        <SvgEditor v-model="points" :editable="editable">
            <template #ui="{ points, editable }">
                <path v-if="editable" stroke="#aaa" stroke-width="1" fill="none" :d="`M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} M ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y}`" />
                <path stroke="red"  stroke-width="2" fill="none" :d="`M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y} `" />
                <path stroke="blue" stroke-width="2" fill="none" :d="polygonPath" />
            </template>
        </SvgEditor>
        <button @click="editable = !editable">EDIT MODE {{ editable }}</button> 
        -->

    </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import DiagramEditor from './components/diagram-editor/DiagramEditor.vue';
import { createConnection, createItem, registerWidgetType } from './components/diagram-editor/helpers';
import { ConnectionStyle, ConnectionType, DiagramElement, WidgetDefinition } from './components/diagram-editor/types';

import YouTubeWidget, { YoutubeWidgetItem } from './components/custom-widgets/YouTubeWidget.vue';
import { PropertyType } from './components/inspector/types';

const editable = ref(true);

// const points = reactive([
//     { id: 'a', x: 100, y: 50  },
//     { id: 'b', x: 150, y: 100 },
//     { id: 'c', x: 250, y: 20  },
//     { id: 'd', x: 300, y: 100 }
// ]);


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

const polygonPath = computed( () => {
    let path = '';
    for(let i = 0; i < points.length; i++) {
        if(i === 0) path = `M ${points[0].x} ${points[0].y} `;
        else path += `L ${points[i].x} ${points[i].y} `;
    }

    return path;
})

</script>

