<template>
    <svg class="connection"
         :style            = "style" 
         :viewBox          = "viewBox" 
         :stroke-dasharray = "dashArray"
         :stroke           = "selected ? '#4af' : options.color" 
         :stroke-width     = "selected ? '3'    : options.thick">
         
        <!-- Real connection -->
        <path :d="linePath" class="realpath" />

        <!-- Ticker (invisible) connection for catching user clicks -->
        <path :d="linePath" class="ghostpath" :stroke-opacity='selected ? 0.2 : 0' @click.stop="emit('selected')" />
    </svg>
</template>

<script setup lang="ts">
import { computed, CSSProperties } from 'vue';
import { ConnectionStyle, ConnectionType, Item, ItemConnection } from '../types';

export interface ConnectionEvents {
    (e: 'selected' ): void    
}

const { from, to, options, selected } = defineProps<{from: Item, to: Item, options: ItemConnection, selected: boolean }>();
const emit = defineEmits<ConnectionEvents>();


//onMounted(()=> console.log('Connection mounted'))
//onUpdated(()=> console.log('Connection updated'))

const style = computed<CSSProperties>(() => {
    let b = boundingBox.value;

    return {
        "left":   b.x + 'px',
        "top":    b.y + 'px',
        "width":  b.w + 'px',
        "height": b.h + 'px',
    }
});

const dashArray = computed(() => {
    if(options.style == ConnectionStyle.DASHED) return '8,10';
    if(options.style == ConnectionStyle.DOTTED) return '2,4';

    return '';  // ConnectionStyle.SOLID
});


const boundingBox = computed(() => {
    const x1 = Math.min(from.x + from.w / 2, to.x + to.w / 2);
    const y1 = Math.min(from.y + from.h / 2, to.y + to.h / 2);
    const x2 = Math.max(from.x + from.w / 2, to.x + to.w / 2);
    const y2 = Math.max(from.y + from.h / 2, to.y + to.h / 2);   
    
    return { x: x1, y: y1, w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) };
});

const viewBox = computed(() => {
    let b = boundingBox.value;
    return `0 0 ${b.w} ${b.h}`;
})

const linePath = computed( () => {
    const b = boundingBox.value;
    
    let x1 = 0,   y1 = 0;
    let x2 = b.w, y2 = b.h;

    const m1x = from.x + from.w/2;
    const m1y = from.y + from.h/2;

    const m2x = to.x + to.w/2;
    const m2y = to.y + to.h/2;

    if(m2y > m1y)              { x1 = 0; y1 = b.h; x2 = b.w; y2 = 0;   }
    if(m1x < m2x)              { x1 = 0; y1 = b.h; x2 = b.w; y2 = 0;   }
    if(m1x < m2x && m2y > m1y) { x1 = 0; y1 = 0;   x2 = b.w; y2 = b.h; }

     // Straight line
    if(options.type === ConnectionType.LINE) return `M ${x1} ${y1} L ${x2} ${y2}`;
    
    // Curve line
    const d = (x2 - x1) * 0.8;
    return `M ${x1} ${y1} C ${x1 + d} ${y1} ${x2 - d} ${y2} ${x2} ${y2}`;
})
</script>


<style scoped>
.connection {
    position: absolute;
    fill: none;
    /* stroke-linecap: round; */
    /* stroke-linejoin: round; */
    pointer-events: none;
    border:   1px dashed red; 
}

.realpath {
    pointer-events: none;
}
.ghostpath {
    pointer-events: all;
    cursor: pointer; 
    stroke: #4af;
    stroke-width: 10;
}

</style>
