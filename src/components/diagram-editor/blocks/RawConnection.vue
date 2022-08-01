<template>
    <svg class="raw-connection"
         :style            = "computedStyle" 
         :viewBox          = "viewBox" 
         :stroke-dasharray = "dashArray"
         :stroke           = "props.color" 
         :stroke-width     = "props.thick">

        <marker v-if="startMarker && startMarker !== ConnectionMarker.NONE" :id="cid + '_marker_start'" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="1.2" markerHeight="1.2" orient="auto-start-reverse" markerUnits="strokeWidth">
            <circle v-if="startMarker === ConnectionMarker.CIRCLE" cx="5" cy="5" r="5"               :fill="props.color" stroke="none" />
            <path   v-if="startMarker === ConnectionMarker.SQUARE" d="M 0 0 L 10 0 L 10 10 L 0 10 z" :fill="props.color" stroke="none" />
            <path   v-if="startMarker === ConnectionMarker.ARROW"  d="M 0 0 L 10 5 L 0 10 z"         :fill="props.color" stroke="none" />
        </marker>        
        <marker v-if="endMarker && endMarker != ConnectionMarker.NONE" :id="cid + '_marker_end'" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="1.2" markerHeight="1.2" orient="auto-start-reverse" markerUnits="strokeWidth">
            <circle v-if="endMarker === ConnectionMarker.CIRCLE" cx="5" cy="5" r="5"               :fill="props.color" stroke="none" />
            <path   v-if="endMarker === ConnectionMarker.SQUARE" d="M 0 0 L 10 0 L 10 10 L 0 10 z" :fill="props.color" stroke="none" />
            <path   v-if="endMarker === ConnectionMarker.ARROW"  d="M 0 0 L 10 5 L 0 10 z"         :fill="props.color" stroke="none" />
        </marker>

        <!-- Real connection -->
        <path :d            = "linePath[0]" 
              class         = "realpath" 
              :marker-start = "linePath[1] ? `url(#${cid}_marker_end)`   : `url(#${cid}_marker_start)`"  
              :marker-end   = "linePath[1] ? `url(#${cid}_marker_start)` : `url(#${cid}_marker_end)`" />

        <!-- Ticker (invisible) connection for catching user clicks -->
        <path :d              = "linePath[0]"
              class           = "ghostpath"     
              :marker-start   = "linePath[1] ? `url(#${cid}_marker_end)`   : `url(#${cid}_marker_start)`"  
              :marker-end     = "linePath[1] ? `url(#${cid}_marker_start)` : `url(#${cid}_marker_end)`"                       
              :stroke-width   = "selected ? 10 + props.thick : 10" 
              :stroke-opacity = "selected ? 0.2 : 0"
              @click.stop     = "emit('selected')" />
    </svg>
</template>

<script setup lang="ts">
import { computed, CSSProperties, ref } from 'vue';
import { getUniqueId } from '../helpers';
import { ConnectionMarker, ConnectionStyle, ConnectionType, Rect } from '../types';

export interface RawConnectionProps {
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number,

    type?:      ConnectionType,         // line, curve, ...
    lineStyle?: ConnectionStyle,        // solid, dashed, ...

    startMarker?: ConnectionMarker,     // none, circle, square, arrow, ...
    endMarker?:   ConnectionMarker,

    thick?: number,
    color?: string,

    selected?: boolean,
}

export interface RawConnectionEvents {
    (e: 'selected' ): void    
}

const emit  = defineEmits<RawConnectionEvents>();
const props = withDefaults(defineProps<RawConnectionProps>(), {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,

    type:        ConnectionType.LINE,
    style:       ConnectionStyle.SOLID,

    startMarker: ConnectionMarker.NONE, 
    endMarker:   ConnectionMarker.NONE,
    
    thick:       1,
    color:       '#000',
    selected:    false
});

const cid = ref(getUniqueId())



const boundingBox = computed<Rect>(() => {
    const x  = Math.min(props.x1, props.x2);
    const y  = Math.min(props.y1, props.y2);
    const x2 = Math.max(props.x1, props.x2);
    const y2 = Math.max(props.y1, props.y2);

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

const dashArray = computed(() => {
    let w = 10 + props.thick;
    if(props.lineStyle == ConnectionStyle.DASHED) return `${10 + props.thick}`;
    if(props.lineStyle == ConnectionStyle.DOTTED) return `${2},${3 + props.thick*2}`;;

    return '0';  // ConnectionStyle.SOLID
});


const viewBox = computed(() => {
    let b = boundingBox.value;
    return `0 0 ${b.w} ${b.h}`;
})

const linePath = computed<[string, boolean]>( () => {
    const b = boundingBox.value;

    let inverse = false;
    
    let x1 = 0,   y1 = 0;
    let x2 = b.w, y2 = b.h;

    const m1x = props.x1;
    const m1y = props.y1;

    const m2x = props.x2;
    const m2y = props.y2;

    if(m2y > m1y)              { x1 = 0; y1 = b.h; x2 = b.w; y2 = 0;   inverse = true;  }
    if(m1x < m2x)              { x1 = 0; y1 = b.h; x2 = b.w; y2 = 0;   inverse = true;  }
    if(m1x < m2x && m2y > m1y) { x1 = 0; y1 = 0;   x2 = b.w; y2 = b.h; inverse = false; }

    if(m2y <= m1y) { inverse = true; }
    if(m2x >= m1x && m2y <= m1y) { inverse = false; }

     // Straight line
    if(props.type === ConnectionType.LINE) return [`M ${x1} ${y1} L ${x2} ${y2}`, inverse];
    
    // Curve line
    const d = (x2 - x1) * 0.7;      // Curve tension: 0=direct line, 1=full curved. PS: 0.7 seems a good value
    return [`M ${x1} ${y1} C ${x1 + d} ${y1} ${x2 - d} ${y2} ${x2} ${y2}`, inverse]
})
</script>


<style scoped>
.raw-connection {
    position: absolute;
    fill: none;
    stroke-linecap: round; 
    stroke-linejoin: round;
    pointer-events: none;

    overflow: visible;

    /* border: 1px dashed red;   */
    /* background-color: lightyellow; */
}

.realpath {
    pointer-events: none;
}
.ghostpath {
    pointer-events: all;
    cursor: pointer; 
    stroke: #4af;
}

</style>
