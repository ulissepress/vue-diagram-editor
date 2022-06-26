<template>
   <svg xmlns="http://www.w3.org/2000/svg"
        :fill="item.backgroundColor" stroke="transparent" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"
        :viewBox="viewBox" 
        :width="item.w" 
        :height="item.h" >
        <path :d="`M ${item.w / 2} 0 L ${item.w} ${item.h} L 0 ${item.h} z`" />
   </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();

const viewBox = computed(() => {    
    return `0 0 ${item.w} ${item.h}`;
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
