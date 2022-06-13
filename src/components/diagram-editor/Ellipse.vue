<template>
   <div class="shape-ellipse" :style="{'backgroundColor': item.background }"></div>
</template>

<style scoped>
.shape-ellipse {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid black;

}
</style>

<script setup lang="ts">import { Item } from './ItemUtils';

const { item } = defineProps<{item: Item}>();

</script>

