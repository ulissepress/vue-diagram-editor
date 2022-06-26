<template>
   <svg xmlns="http://www.w3.org/2000/svg"
        viewBox         = "0 0 16 16" 
        stroke          = "transparent" 
        stroke-width    = "0"  
        stroke-linecap  = "round" 
        stroke-linejoin = "round"

        :fill   = "item.backgroundColor" 
        :width  = "item.w" 
        :height = "item.h" >
        <path d="M16 6.216l-6.095-.02L7.98.38 6.095 6.196 0 6.215h.02l4.912 3.57-1.904 5.834h.02l4.972-3.59 4.932 3.59-1.904-5.815L16 6.215 z" />
   </svg>
</template>

<script setup lang="ts">
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();


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
