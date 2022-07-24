<template>
    <div class="text" :style="{
            justifyContent:  item.textHAlign,
            alignItems:      item.textVAlign, 
            backgroundColor: item.backgroundColor, 
            color:           item.textColor, 
            border:          item.border.width + 'px ' + item.border.style + ' ' + item.border.color,
            borderRadius:    item.borderRadius + 'px',
            fontSize:        item.fontSize + 'px',
            opacity:         item.opacity / 100,
            textShadow:       item.shadow ? '3px 3px 5px #ccc' : 'none',
        }">{{ item.title }}</div>
</template>

<script setup lang="ts">
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();

</script>

<style scoped>
.text {
    background-color: transparent;
    width: 100%;
    height: 100%;
    /* border: 1px solid grey; */

    display: flex;
    justify-content: center;
    align-items: center; 
    overflow: hidden;
}
</style>
