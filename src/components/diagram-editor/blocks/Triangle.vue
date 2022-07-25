<template>
    <div class="triangle-container" :style="{ 
            opacity: item.opacity / 100,
        }">
        <svg xmlns="http://www.w3.org/2000/svg"
            class="triangle"

            :stroke           = "item.border.color" 
            :stroke-width     = "item.border.width" 
            :stroke-dasharray = "dashArray"
            
            stroke-linecap  = "round" 
            stroke-linejoin = "round"
            
            :style="{ 'filter': item.shadow ? 'drop-shadow(2px 2px 5px #aaa)' : '' }"

            :fill           = "item.backgroundColor" 
            :viewBox        = "`0 0 ${item.w} ${item.h}`" 
            :width          = "item.w" 
            :height         = "item.h" >
            <path :d="`M ${item.w / 2} 0 L ${item.w} ${item.h} L 0 ${item.h} z`" />
        </svg>
        <div class="triangle-text diagram-item-inline-edit" :style="{ 
            justifyContent: item.textHAlign,
            alignItems:     item.textVAlign,
            color:          item.textColor,
            fontSize:       item.fontSize + 'px', 
        }">{{ item.title }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ConnectionStyle, Item } from '../types';

const { item } = defineProps<{item: Item}>();

const dashArray = computed(() => {
    if(item.border.style == ConnectionStyle.DASHED) return `${10 + item.border.width}`;
    if(item.border.style == ConnectionStyle.DOTTED) return `${2},${3 + item.border.width*2}`;;

    return '0';  // ConnectionStyle.SOLID
});

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

    overflow: visible;
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
