<template>
   <svg xmlns="http://www.w3.org/2000/svg"
        fill            = "none" 
        stroke-linecap  = "round" 
        stroke-linejoin = "round"
        style           = "pointer-events: none;"
    

        :viewBox          = "viewBox" 
        :width            = "item.w" 
        :height           = "item.h" 
        :stroke           = "item.backgroundColor" 
        :stroke-width     = "item.componentOptions?.thick || 2" 
        :stroke-dasharray = "dashArray">        
        
        <line x1="0" :y1="item.h / 2" :x2="item.w" :y2="item.h / 2" style= "pointer-events: all;"/>
   </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ConnectionStyle, Item } from '../types';

const { item } = defineProps<{item: Item}>();

const viewBox = computed(() => {    
    return `0 0 ${item.w} ${item.h}`;
});

const dashArray = computed(() => {
    if(item.componentOptions?.style == ConnectionStyle.DASHED) return '8,10';
    if(item.componentOptions?.style == ConnectionStyle.DOTTED) return '2,4';

    return '';  // ConnectionStyle.SOLID
});

</script>

<style scoped>
.shape {
    background-color: transparent;
    width: 100%;
    height: 100%;
    border: 1px solid grey;

    display: flex;
    justify-content: center;
    align-items: center; 
}
</style>
