<template>
    <div class="shape" :style="{ 
            backgroundColor: item.backgroundColor, 
            color:           item.textColor, 
            borderRadius:    item.borderRadius + 'px',
            fontSize:        item.fontSize + 'px',
            opacity:         item.opacity / 100,
        }">{{ item.title }}</div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { Item } from '../types';

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
    overflow: hidden;
}
</style>
