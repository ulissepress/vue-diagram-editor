<template>
    <RawConnection :x1="fromPos.x" :y1="fromPos.y" 
                   :x2="toPos.x"   :y2="toPos.y" 
                   
                   :type     = "options.type" 
                   :style    = "options.style" 
                   :thick    = "options.thick" 
                   :color    = "options.color" 
                   :selected = "selected" 
                   @selected = "emit('selected')" />
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { getHandlePosition } from '../helpers';
import { Item, ItemConnection, Position } from '../types';
import RawConnection from './RawConnection.vue';

export interface ConnectionEvents {
    (e: 'selected' ): void    
}

const { from, to, options, selected } = defineProps<{from: Item, to: Item, options: ItemConnection, selected: boolean }>();
const emit = defineEmits<ConnectionEvents>();

const fromPos = computed<Position>(() => getHandlePosition(from, options.fromPoint));
const toPos   = computed<Position>(() => getHandlePosition(to,   options.toPoint));
    



</script>
