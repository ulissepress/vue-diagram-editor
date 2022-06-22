<template>
    <div style="width: 100%; height: 95%; padding-top: 16px;">
        <DiagramEditor  :elements    = "elements"
                        @add-item    = "addNewItem" 
                        @delete-item = "deleteItem" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import DeleteCommand from './components/diagram-editor/commands/DeleteCommand';
import HistoryManager from './components/diagram-editor/commands/HistoryManager';
import DiagramEditor from './components/diagram-editor/DiagramEditor.vue';
import { createConnection, createItem } from './components/diagram-editor/helpers';

import { DiagramElement, Item } from './components/diagram-editor/types';


let elements: DiagramElement[] = reactive([
    createItem({ id: 'a1', w: 100, h: 80 }),
    createItem({ id: 'a2', w: 90,  h: 90 }),
    //createItem({ id: 'a3' }),
    
    createConnection('a1', 'a2'),
    //createConnection('a1', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DOTTED }),
    //createConnection('a2', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DASHED, color: "red", thick: 5 }),

    // createItem( { title: 'Item B',            component: "Shape" } ),
    // createItem( { title: 'Item (no resize)',  component: "Shape", supportsResizable: false } ),
    
    // createItem( { title: 'Item D',            component: "CustomShape", w: 300, h: 300, supportsRoundable: false } ),
    //createItem( { title: 'Ellipse 1',         component: "Ellipse",     w: 400, h: 200, supportsRoundable: false } ),
    //createItem( { title: 'Circle',            component: "Ellipse",     w: 200, h: 200, supportsRoundable: false } ),
    
    //createItem( { title: 'My Image',          component: "Image",       w: 250, h: 250, componentOptions: { src : "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" }} ),

]);

function addNewItem() {
    elements.push(createItem());
}

function deleteItem(item: Item, historyManager: HistoryManager) {
    historyManager.execute(new DeleteCommand(elements, item));    


    let idx = elements.findIndex(v => v.id === item.id);
    if(idx !== -1) elements.splice(idx, 1)
}

</script>