<template>
    <div class="shape" :style="{
        justifyContent:  item.textHAlign,
        alignItems:      item.textVAlign,
        backgroundColor: item.backgroundColor, 
        color:           item.textColor, 
        borderRadius:    item.borderRadius + 'px',
        opacity:         item.opacity / 100,
        border:          cssBorder(item),
        boxShadow:       cssShadow(item),
        ...cssTextStyle(item) }">
        <div>
            <div class="diagram-item-inline-edit" v-html="item.title" :style="{ alignItems: item.textHAlign }" />
        </div> 
    </div>
</template>

<script setup lang="ts">
import { Item } from '../types';
import { cssBorder, cssShadow, cssTextStyle } from './utils';

const { item } = defineProps<{item: Item}>();

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
