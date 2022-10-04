<template>
    <div class="widget-wrapper" :style="{
        opacity:       item.opacity / 100,
        boxShadow:     cssShadow(item),
        pointerEvents: editorContext.isEditable() ? 'none' : 'all' 
        }">
        <component :is="item.widget.component" :item="item" />
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { WidgetItem } from '../types';
import { cssShadow } from './utils';

const { item } = defineProps<{item: WidgetItem}>();

const editorContext: any = inject('diagram-editor-context');

onMounted(() => {
    console.log('onMounted() ----- Custom Widget Editor context',  editorContext)
    console.log('onMounted() ----- Custom Widget', item.widget)
})

</script>

<style scoped>
.widget-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
