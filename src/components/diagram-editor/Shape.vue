<template>
    <div class="shape" :style="{ backgroundColor: item.background, borderRadius: item.borderRadius + 'px' }">{{ item.title }}</div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { Item } from './ItemUtils';

const { item } = defineProps<{item: Item}>();

onMounted(()=> console.log('Shape mounted'))
onUpdated(()=> console.log('Shape updated'))
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
