<template>
    <div class="triangle-container" :style="{ 
            opacity: item.opacity / 100,
        }">
        <svg xmlns="http://www.w3.org/2000/svg"
            class="triangle"
            stroke          = "transparent" 
            stroke-width    = "0" 
            stroke-linecap  = "round" 
            stroke-linejoin = "round"

            :fill           = "item.backgroundColor" 
            :viewBox        = "`0 0 ${item.w} ${item.h}`" 
            :width          = "item.w" 
            :height         = "item.h" >
            <path :d="`M ${item.w / 2} 0 L ${item.w} ${item.h} L 0 ${item.h} z`" />
        </svg>
        <div class="triangle-text" :style="{ 
            justifyContent: item.textHAlign,
            alignItems:     item.textVAlign,
            color:          item.textColor,
            fontSize:       item.fontSize + 'px', 
        }">{{ item.title }}</div>
    </div>
</template>

<script setup lang="ts">
import { Item } from '../types';

const { item } = defineProps<{item: Item}>();

</script>

<style scoped>
.triangle-container {
    position: relative;
    width: 100%;
    height: 100%;
}
.triangle {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}

.triangle-text {
    position: absolute;
    top: calc(clamp(10%, 20px, 20%));
    left: 0px;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;     
}
</style>
