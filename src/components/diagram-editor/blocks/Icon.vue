<template>
    <span class="material-symbols-outlined" :style="{
            color:           item.textColor,            
            fontSize:        item.h + 'px',
            borderRadius:    item.borderRadius + 'px',
            opacity:         item.opacity / 100,
            textShadow:      item.shadow ? '3px 3px 5px #aaa' : 'none',
            }" >{{ item.title }}</span>
</template>

<script setup lang="ts">
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();

</script>

<style scoped>
.shape {
    box-sizing: border-box;
    display: flex;     
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 8px;
}
.shape div.diagram-item-inline-edit {
    display: flex;     
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    padding: 0px;
}

</style>
