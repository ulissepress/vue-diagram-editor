<template>
    <div class="star-container" :style="{ 
            opacity: item.opacity / 100,
        }">
        <svg xmlns="http://www.w3.org/2000/svg"
            class             = "star"
            viewBox           = "0 0 16 16" 
            
            :stroke           = "item.border.color" 
            :stroke-width     = "item.border.width / 10" 
            :stroke-dasharray = "dashArray"            
            stroke-linecap    = "round" 
            stroke-linejoin   = "round"

            :style="{ 'filter': item.shadow ? 'drop-shadow(2px 2px 5px #aaa)' : '' }"

            :fill             = "item.backgroundColor"             
            :width            = "item.w" 
            :height           = "item.h" >
            <path d="M16 6.216l-6.095-.02L7.98.38 6.095 6.196 0 6.215h.02l4.912 3.57-1.904 5.834h.02l4.972-3.59 4.932 3.59-1.904-5.815L16 6.215 z" />
        </svg>
        <div class="star-text diagram-item-inline-edit" :style="{ 
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
.star-container {
    position: relative;
    width: 100%;
    height: 100%;
}
.star {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    overflow: visible;
}

.star-text {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;     
}
</style>
