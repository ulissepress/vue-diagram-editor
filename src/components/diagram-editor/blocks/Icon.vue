<template>
    <span :class="{'material-icons': item.filled, 'material-icons-outlined': !item.filled}" :style="{
            color:           item.textColor,            
            fontSize:        item.h + 'px',
            borderRadius:    item.borderRadius + 'px',
            opacity:         item.opacity / 100,
            textShadow:      cssShadow(item),
            }" >{{ item.title }}</span>
</template>

<script setup lang="ts">
import { IconItem } from '../types';
import { cssShadow } from './utils';

const { item } = defineProps<{item: IconItem}>();

</script>

<style scoped>
.shape {
    box-sizing: border-box;
    display: flex;     
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 8px;
}
.shape div.diagram-item-inline-edit {
    display: flex;     
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    padding: 0px;
}

</style>
