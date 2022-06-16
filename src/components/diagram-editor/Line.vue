<template>
    <path :d="svgPath()" />    
</template>

<script setup lang="ts">
import { Item } from './ItemUtils';

const { from, to } = defineProps<{from: Item, to: Item}>();


let tension = 0.8;
const svgPath = () => {

    let path = '';
    let x1 = from.x + from.w / 2, y1 = from.y + from.h / 2;
    let x2 = to.x + to.w / 2, y2 = to.y + to.h / 2;    

    if (tension<0) {
        let delta = (y2-y1)*tension;
        let hx1 = x1;
        let hy1 = y1 - delta;
        let hx2 = x2;
        let hy2 = y2 + delta;
        path = "M " + x1 + " " + y1 + " C " + hx1 + " " + hy1 + " " + hx2 + " " + hy2 + " " + x2 + " " + y2;
    } else {
        let delta = (x2-x1)*tension;
        let hx1 = x1 + delta;
        let hy1 = y1;
        let hx2 = x2 - delta;
        let hy2 = y2;
        path = "M " + x1 + " " + y1 + " C " + hx1 + " " + hy1 + " " + hx2 + " " + hy2 + " " + x2 + " " + y2;
    }

    return path;
}

</script>

