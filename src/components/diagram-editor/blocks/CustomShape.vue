<template>
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="50" cy="50" r="40"/>
        <path d="M50 25V50 H75" /> 
   </svg>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();

onMounted(()=> console.log('CustomShape mounted'))
onUpdated(()=> console.log('CustomShape updated'))
</script>

