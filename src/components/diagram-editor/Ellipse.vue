<template>
   <div class="shape-ellipse" :style="{'backgroundColor': props.item.background }"></div>
</template>

<style scoped>
.shape-ellipse {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid black;

}
</style>

<script setup lang="ts">

const props = defineProps({
  item: Object
})

</script>

