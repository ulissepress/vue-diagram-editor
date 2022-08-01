<template>
    <div class="text" :style="{
            justifyContent:  item.textHAlign,
            alignItems:      item.textVAlign,
            backgroundColor: item.backgroundColor, 
            color:           item.textColor, 
            borderRadius:    item.borderRadius + 'px',
            fontSize:        item.fontSize + 'px',
            opacity:         item.opacity / 100,
            border:          cssBorder(item),
            textShadow:      cssShadow(item),
        }" ><div><div class="diagram-item-inline-edit" v-html="item.title" :style="{ alignItems: item.textHAlign }"/></div> 
    </div>
</template>

<script setup lang="ts">
import { Item } from '../types';
import { cssBorder, cssShadow } from './utils';

const { item } = defineProps<{item: Item}>();

</script>

<style scoped>
.text {
    box-sizing: border-box;
    display: flex;     
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 8px;
}
.text div.diagram-item-inline-edit {
    display: flex;     
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    padding: 0px;
}

</style>
