<template>
    <div style="width: 100%; height: 90%; padding-top: 16px; margin: 0 auto;">
        <DiagramEditor :elements      = "elements"
                       :editable      = "true" 
                       :customWidgets = "true" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import DiagramEditor from './components/diagram-editor/DiagramEditor.vue';
import { createConnection, createItem } from './components/diagram-editor/helpers';
import { ConnectionStyle, ConnectionType, DiagramElement } from './components/diagram-editor/types';

let elements: DiagramElement[] = reactive([
    createItem({ id: 'a1', title: 'Angelo', x: 100, y: 150, w: 100, h: 80, backgroundColor: '#ff0000', textColor: '#ffffff' }),
    createItem({ id: 'a2', title: 'Mario',  x: 600, y: 130, w: 90,  h: 90, backgroundColor: '#00ff00', textColor: '#2c2c2c' }),
    createItem({ id: 'a3', title: 'Luca',   x: 300, y: 400, w: 200, h: 70, backgroundColor: '#0000ff', textColor: '#f7ff2d' }),
    
    createConnection('a1', 'a2'),
    createConnection('a1', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DOTTED }),
    createConnection('a2', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DASHED, backgroundColor: "#ff0000", thick: 5 }),
]);

</script>

