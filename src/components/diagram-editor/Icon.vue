<template>
    <span class="material-symbols-outlined" style="font-size: 24px;">{{ icon }}</span>
</template>

<script setup lang="ts">

const { icon } = defineProps<{ icon: string }>();
</script>
