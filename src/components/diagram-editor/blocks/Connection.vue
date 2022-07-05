<template>
    <RawConnection :x1 = "fromPos.x" :y1 = "fromPos.y" 
                   :x2 = "toPos.x"   :y2 = "toPos.y" 
                   
                   :type      = "connection.type" 
                   :lineStyle = "connection.style" 
                   :thick     = "connection.thick" 
                   :color     = "connection.backgroundColor" 
                   :selected  = "selected" 
                   @selected  = "emit('selected')" />
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { getHandlePosition } from '../helpers';
import { Item, ItemConnection, Position } from '../types';
import RawConnection from './RawConnection.vue';

export interface ConnectionEvents {
    (e: 'selected' ): void    
}

const { from, to, connection, selected } = defineProps<{from: Item, to: Item, connection: ItemConnection, selected: boolean }>();
const emit = defineEmits<ConnectionEvents>();

const fromPos = computed<Position>(() => getHandlePosition(from, connection.from.handle));
const toPos   = computed<Position>(() => getHandlePosition(to,   connection.to.handle));
    
</script>
