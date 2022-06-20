<template>
    <svg class="connection" fill="none" stroke-linecap="round" stroke-linejoin="round"
            :style="style" 
            :viewBox="viewBox" 
            :stroke-dasharray="dashArray"
            :stroke="selected ? '#4af' : options.color" 
            :stroke-width="selected ? '3' : options.thick">
        <path :d="linePath" style="pointer-events: none;" />
        <path :d="linePath" stroke-width="10" stroke="red" stroke-opacity='0' @click.stop="emit('selected')" style="cursor: pointer; pointer-events: all;" />
    </svg>
</template>

<script setup lang="ts">
import { computed, CSSProperties } from 'vue';
import { ConnectionStyle, ConnectionType, Item, ItemConnection } from '../ItemUtils';

export interface ConnectionEvents {
    (e: 'selected' ): void    
}

const { from, to, options, selected } = defineProps<{from: Item, to: Item, options: ItemConnection, selected: boolean }>();
const emit = defineEmits<ConnectionEvents>();

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
    const x1 = from.x + from.w / 2; 
    const y1 = from.y + from.h / 2;
    const x2 = to.x + to.w / 2;
    const y2 = to.y + to.h / 2;

    const _x1 = Math.min(x1, x2);
    const _y1 = Math.min(y1, y2);
    const _x2 = Math.max(x1, x2);
    const _y2 = Math.max(y1, y2);   
    
    return { x: _x1, y: _y1, w: Math.abs(_x2 - _x1), h: Math.abs(_y2 - _y1) };
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

    if(m2y > m1y)              { x1 = 0; y1 = b.h; x2 = b.w; y2 = 0; }
    if(m1x < m2x)              { x1 = 0; y1 = b.h; x2 = b.w; y2 = 0; }
    if(m1x < m2x && m2y > m1y) { x1 = 0; y1 = 0; x2 = b.w; y2 = b.h; }

    let tension = 0;
    if(options.type === ConnectionType.CURVE) tension = -0.8;

    if (tension === 0) {
        return "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
    }
    else if (tension < 0) {
        let delta = (y2 - y1) * tension;
        let hx1 = x1;
        let hy1 = y1 - delta;
        let hx2 = x2;
        let hy2 = y2 + delta;
        return "M " + x1 + " " + y1 + " C " + hx1 + " " + hy1 + " " + hx2 + " " + hy2 + " " + x2 + " " + y2;
    } else {
        let delta = (x2 - x1) * tension;
        let hx1 = x1 + delta;
        let hy1 = y1;
        let hx2 = x2 - delta;
        let hy2 = y2;
        return "M " + x1 + " " + y1 + " C " + hx1 + " " + hy1 + " " + hx2 + " " + hy2 + " " + x2 + " " + y2;
    }
})
</script>


<style scoped>
.connection {
     position: absolute;
     z-index:  -100000;
     /* border:   1px dashed red; */
}
</style>
