<template>
   <img class  = "image" 
        :src   = "item.url === '' ? imagePlaceholder : item.url"
        :style = "{ 
            color:        item.textColor, 
            border:       item.border.width + 'px ' + item.border.style + ' ' + item.border.color,
            borderRadius: item.borderRadius + 'px',
            fontSize:     item.fontSize + 'px',
            opacity:      item.opacity / 100,   
            objectFit:    item.fit,
            boxShadow:    item.shadow ? '3px 3px 5px #aaa' : 'none', 
            filter:       cssFilter,
            transform:    cssTransform,
        }"/>
</template>

<style scoped>
.image {
    width: 100%;
    height: 100%;
    max-width: 100%;
}
</style>

<script setup lang="ts">

import { computed } from 'vue';
import imagePlaceholder from '../image-placeholder.png';
import { ImageItem } from '../types';

const { item } = defineProps<{item: ImageItem}>();

const cssFilter = computed(() => {
    if(!item.filtersEnabled || !item.filters) return '';
    /*
        blur:       0px-10px,    default = 0,    step 1
        grayscale:  0% to 100%,  default = 0%,   step 1
        brightness: 0% to 200%,  default = 100%, step 1
        contrast:   0% to 200%,  default = 100%, step 1
        hue:        0  to 359,   default = 0,    step 1
        invert:     0% to 100%,  default = 0%,   step 1
        saturate:   0% to 200%,  default = 100%, step 1
        sepia:      0% to 100%,  default = 0%,   step 1
    */

    let f = '';
    if(item.filters.blur > 0)           f += ` blur(${item.filters.blur}px)`;
    if(item.filters.grayscale > 0)      f += ` grayscale(${item.filters.grayscale}%)`;
    if(item.filters.brightness !== 100) f += ` brightness(${item.filters.brightness}%)`;
    if(item.filters.contrast !== 100)   f += ` contrast(${item.filters.contrast}%)`;
    if(item.filters.hue > 0)            f += ` hue-rotate(${item.filters.hue}deg)`;
    if(item.filters.invert > 0)         f += ` invert(${item.filters.invert}%)`;
    if(item.filters.saturate != 100)    f += ` saturate(${item.filters.saturate}%)`;
    if(item.filters.sepia > 0)          f += ` sepia(${item.filters.sepia}%)`;

    return f
});

const cssTransform = computed(() => {
    if(item.flip === 'horizontal') return "scaleX(-1)";
    if(item.flip === 'vertical')   return "scaleY(-1)";
    if(item.flip === 'both')       return "scale(-1, -1)";

    return '';
});


</script>

