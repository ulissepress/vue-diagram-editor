<template>
   <img class="image" :src="item.componentOptions.src" :style="{ borderRadius: item.borderRadius + 'px' }"/>
</template>

<style scoped>
.image {
    width: 100%;
    height: 100%;
    max-width: 100%;
    object-fit: cover;
}
</style>

<script setup lang="ts">

import { onMounted, onUpdated } from 'vue';
import { Item } from './ItemUtils';

const { item } = defineProps<{item: Item}>();


onMounted(()=> console.log('Image mounted'))
onUpdated(()=> console.log('Image updated'))

</script>

