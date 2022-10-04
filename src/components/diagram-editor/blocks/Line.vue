<template>
   <svg xmlns="http://www.w3.org/2000/svg"
        fill              = "none" 
        stroke-linecap    = "square"
        stroke-linejoin   = "round"
        style             = "pointer-events: none; overflow: visible;"

        :viewBox          = "viewBox" 
        :width            = "item.w" 
        :height           = "item.h" 
        :stroke           = "item.backgroundColor" 
        :stroke-width     = "item.thick || 1" 
        :stroke-dasharray = "dashArray">

        <marker v-if="item.startMarker !== ConnectionMarker.NONE" :id="item.id + '_marker_start'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" markerUnits="strokeWidth">
            <circle v-if="item.startMarker === ConnectionMarker.CIRCLE" cx="5" cy="5" r="5"               :fill="item.backgroundColor" stroke="none" />
            <path   v-if="item.startMarker === ConnectionMarker.SQUARE" d="M 0 0 L 10 0 L 10 10 L 0 10 z" :fill="item.backgroundColor" stroke="none" />
            <path   v-if="item.startMarker === ConnectionMarker.ARROW"  d="M 0 0 L 10 5 L 0 10 z"         :fill="item.backgroundColor" stroke="none" />
        </marker>        
        
        <marker v-if="item.endMarker != ConnectionMarker.NONE" :id="item.id + '_marker_end'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" markerUnits="strokeWidth">
            <circle v-if="item.endMarker === ConnectionMarker.CIRCLE" cx="5" cy="5" r="5"               :fill="item.backgroundColor" stroke="none" />
            <path   v-if="item.endMarker === ConnectionMarker.SQUARE" d="M 0 0 L 10 0 L 10 10 L 0 10 z" :fill="item.backgroundColor" stroke="none" />
            <path   v-if="item.endMarker === ConnectionMarker.ARROW"  d="M 0 0 L 10 5 L 0 10 z"         :fill="item.backgroundColor" stroke="none" />
        </marker>

        <path :d="`M 0 ${item.h} L ${item.w} ${0}`" :marker-start="`url(#${item.id}_marker_start)`"  :marker-end="`url(#${item.id}_marker_end)`" />
   </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ConnectionMarker, ConnectionStyle, LineItem } from '../types';

const { item } = defineProps<{item: LineItem}>();

const viewBox = computed(() => {    
    return `0 0 ${item.w} ${item.h}`;
});

const dashArray = computed(() => {
    let w = 10 + item.thick;
    if(item.style == ConnectionStyle.DASHED) return `${10 + item.thick}`;
    if(item.style == ConnectionStyle.DOTTED) return `${2},${3 + item.thick*2}`;

    return '0';  // ConnectionStyle.SOLID
});

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
