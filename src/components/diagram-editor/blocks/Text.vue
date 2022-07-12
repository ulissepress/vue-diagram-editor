<template>
    <div class="text" :style="{  
            color:           item.textColor, 
            borderRadius:    item.borderRadius + 'px',
            fontSize:        item.fontSize + 'px',
        }">{{ item.title }}</div>
</template>

<script setup lang="ts">
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();

</script>

<style scoped>
.text {
    background-color: transparent;
    width: auto;
    height: auto;
    /* border: 1px solid grey; */

    display: flex;
    justify-content: center;
    align-items: center; 
    overflow: hidden;
}
</style>
