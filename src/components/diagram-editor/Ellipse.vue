<template>
   <div class="shape-ellipse" :style="{'backgroundColor': item.background }">{{ item.title }}</div>
</template>

<style scoped>
.shape-ellipse {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid black;

    display: flex;
    justify-content: center;
    align-items: center; 

}
</style>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { Item } from './ItemUtils';

const { item } = defineProps<{item: Item}>();

onMounted(()=> console.log('Ellipse mounted'))
onUpdated(()=> console.log('Ellipse updated'))

</script>

