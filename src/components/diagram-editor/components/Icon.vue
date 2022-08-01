<template>
    <span :class="{'material-icons': icon.endsWith(':filled'), 'material-icons-outlined': !icon.endsWith(':filled')}" 
          :style="{ 'font-size': size + ' !important', 'color': color }">{{ icon.split(':')[0] }}</span>
</template>

<script setup lang="ts">

// https://fonts.google.com/icons?icon.set=Material+Icons

// JSON Medata: https://fonts.google.com/metadata/icons
// https://www.npmjs.com/package/material-design-icon-list

const { icon, size, color } =  withDefaults(defineProps<{ icon: string, size?: string, color?: string }>(), {
    icon: '',
    size: '24px',
    color: '',
});






</script>
