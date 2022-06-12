<template>
    <h2 style="text-align: center;">Presentation Mode Prototype</h2>
    <div style="width: 100%; height: 90%;">
        <DiagramEditor :items="items" @add-item="addNewItem"/>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import DiagramEditor from './components/diagram-editor/DiagramEditor.vue';
import { ItemUtils } from './components/diagram-editor/ItemUtils';

let counter = 0;
let items   = reactive([
    ItemUtils.createItem('Item A'),
    ItemUtils.createItem('Item B'),
    ItemUtils.createItem('Item C', "CustomShape"),
    ItemUtils.createItem('Item D', "Ellipse"),
    ItemUtils.createItem('Item E', "Image", { src : "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" } ),
]);


function addNewItem() {
    items.push(ItemUtils.createItem('New Item'));
}

</script>