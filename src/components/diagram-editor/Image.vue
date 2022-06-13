<template>
   <img class="image" :src="item.componentOptions.src" />
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

import { onUpdated } from 'vue';
import { Item } from './ItemUtils';

const { item } = defineProps<{item: Item}>();


onUpdated(()=> console.log('Image updated'))


</script>

