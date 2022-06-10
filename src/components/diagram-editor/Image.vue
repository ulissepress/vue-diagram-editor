<template>
   <img class="image" :src="props.item.componentOptions.src" />
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

import Item from './DiagramEditor.vue';

const props = defineProps({
  item: Item
})

</script>

