<template>
    <div style="width: 100%; height: 95%;">
        <DiagramEditor  :elements    = "elements"
                        @add-item    = "addNewItem" 
                        @delete-item = "deleteItem" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import DiagramEditor from './components/diagram-editor/DiagramEditor.vue';
import ItemUtils from './components/diagram-editor/ItemUtils';
import { ConnectionStyle, ConnectionType, DiagramElement, Item } from './components/diagram-editor/types';

const a1 = ItemUtils.createItem({ id: 'a1' });
const a2 = ItemUtils.createItem({ id: 'a2' });
const a3 = ItemUtils.createItem({ id: 'a3' });

let elements: DiagramElement[] = reactive([
    a1, a2, a3,
    ItemUtils.createItem( { title: 'Item B',            component: "Shape" } ),
    ItemUtils.createItem( { title: 'Item (no resize)',  component: "Shape", supportsResizable: false } ),
    
    ItemUtils.createItem( { title: 'Item D',            component: "CustomShape", w: 300, h: 300, supportsRoundable: false } ),
    ItemUtils.createItem( { title: 'Ellipse 1',         component: "Ellipse",     w: 400, h: 200, supportsRoundable: false } ),
    ItemUtils.createItem( { title: 'Circle',            component: "Ellipse",     w: 200, h: 200, supportsRoundable: false } ),
    
    ItemUtils.createItem( { title: 'My Image',          component: "Image",       w: 250, h: 250, componentOptions: { src : "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" }} ),

    ItemUtils.createConnection('a1', 'a2'),
    ItemUtils.createConnection('a1', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DOTTED }),
    ItemUtils.createConnection('a2', 'a3', { type: ConnectionType.CURVE, color: "red", thick: 4, style: ConnectionStyle.DASHED }),

]);

function addNewItem() {
    items.push(ItemUtils.createItem());
}

function deleteItem(item: Item) {
    let idx = items.findIndex(v => v.id === item.id);
    if(idx !== -1) items.splice(idx, 1)
}

</script>