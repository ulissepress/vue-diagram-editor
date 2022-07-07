<template>
    <span class="material-symbols-outlined" style="font-size: 24px;">{{ icon }}</span>
</template>

<script setup lang="ts">
// https://fonts.google.com/icons?icon.set=Material+Icons
const { icon } = defineProps<{ icon: string }>();
</script>
