<template>
   <div class="shape-ellipse" :style="{ 
            backgroundColor: item.backgroundColor, 
            color:           item.textColor,
            fontSize:        item.fontSize + 'px',
        }">{{ item.title }}</div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();

onMounted(()=> console.log('Ellipse mounted'))
onUpdated(()=> console.log('Ellipse updated'))

</script>

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