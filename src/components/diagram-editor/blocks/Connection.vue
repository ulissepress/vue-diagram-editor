<template>
    <div v-if="connection.title && connection.title.trim() !== ''" class="connection-container" :style="computedStyle">
        <div class="connection-label" :style="{ color: connection.textColor, zIndex: connection.z, ...cssTextStyle(connection) }">{{ connection.title }}</div>
    </div>
    <RawConnection 
        :x1 = "fromPos.x" :y1 = "fromPos.y" 
        :x2 = "toPos.x"   :y2 = "toPos.y" 
        
        :type        = "connection.type" 
        :lineStyle   = "connection.style" 
        :thick       = "connection.thick" 
        :color       = "connection.backgroundColor" 

        :startHandle = "connection.from.handle"
        :endHandle   = "connection.to.handle"

        :startMarker = "connection.from.marker"
        :endMarker   = "connection.to.marker"
        
        :selected    = "selected" 
        @selected    = "emit('selected')" />
</template>

<script setup lang="ts">

import { computed, CSSProperties } from 'vue';
import { getHandlePosition } from '../helpers';
import { Item, ItemConnection, Position, Rect } from '../types';
import RawConnection from './RawConnection.vue';
import { cssTextStyle } from './utils';

export interface ConnectionEvents {
    (e: 'selected' ): void    
}

const { from, to, connection, selected } = defineProps<{from: Item, to: Item, connection: ItemConnection, selected: boolean }>();
const emit = defineEmits<ConnectionEvents>();

const fromPos = computed<Position>(() => getHandlePosition(from, connection.from.handle));
const toPos   = computed<Position>(() => getHandlePosition(to,   connection.to.handle));
    
const boundingBox = computed<Rect>(() => {
    const x  = Math.min(fromPos.value.x, toPos.value.x);
    const y  = Math.min(fromPos.value.y, toPos.value.y);
    const x2 = Math.max(fromPos.value.x, toPos.value.x);
    const y2 = Math.max(fromPos.value.y, toPos.value.y);

    // Width and height cannot be 0...at least we need the space for the connecion thick
    let w = Math.max(Math.abs(x2 - x), 1);
    let h = Math.max(Math.abs(y2 - y), 1);
    
    return { x, y, w, h };
});    
const computedStyle = computed<CSSProperties>(() => {
    let b = boundingBox.value;

    return {
        "left":   b.x + 'px',
        "top":    b.y + 'px',
        "width":  b.w + 'px',
        "height": b.h + 'px',
    }
});

</script>

<style scoped>
.connection-container {
    position:   absolute;
    box-sizing: border-box;
    margin:  0;
    padding: 0;
    background-color: transparent;
    display: grid;
    place-content: center;
    pointer-events: none;
}

.connection-label {
    display: inline-block;
    background-color: white;
    color: #333;
    font-size: 16px;
    padding: 4px;
    z-index: 1;
}

</style>