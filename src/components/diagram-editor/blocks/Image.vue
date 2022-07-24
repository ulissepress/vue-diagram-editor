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
            boxShadow:       item.shadow ? '3px 3px 5px #aaa' : 'none', 
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

import { onMounted, onUpdated } from 'vue';
import imagePlaceholder from '../image-placeholder.png';
import { ImageItem } from '../types';

const { item } = defineProps<{item: ImageItem}>();


onMounted(()=> console.log('Image mounted'))
onUpdated(()=> console.log('Image updated'))

</script>

