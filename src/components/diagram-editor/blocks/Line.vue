<template>
   <svg xmlns="http://www.w3.org/2000/svg"
        fill              = "none" 
        stroke-linecap    = "square"
        stroke-linejoin   = "round"
        style             = "pointer-events: none;"    

        :viewBox          = "viewBox" 
        :width            = "item.w" 
        :height           = "item.h" 
        :stroke           = "item.backgroundColor" 
        :stroke-width     = "item.thick || 1" 
        :stroke-dasharray = "dashArray">        
        
        :style="{ 'filter': item.shadow ? 'drop-shadow(2px 2px 5px #aaa)' : '' }"
        
        <line x1="0" :y1="item.h / 2" :x2="item.w" :y2="item.h / 2" />
   </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ConnectionStyle, LineItem } from '../types';

const { item } = defineProps<{item: LineItem}>();

const viewBox = computed(() => {    
    return `0 0 ${item.w} ${item.h}`;
});

const dashArray = computed(() => {
    let w = 10 + item.thick;
    if(item.style == ConnectionStyle.DASHED) return `${10 + item.thick}`;
    if(item.style == ConnectionStyle.DOTTED) return `${2},${3 + item.thick*2}`;;

    return '0';  // ConnectionStyle.SOLID
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
