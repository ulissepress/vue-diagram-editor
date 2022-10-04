<template>
    <iframe width       = "100%" 
            height      = "100%" 
            title       = "YouTube video player"
            frameborder = "0"
            allow       = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            :src        = "'https://www.youtube.com/embed/' + item.video_id"></iframe>
</template>

<script setup lang="ts">
import { WidgetItem } from '../diagram-editor/types';

export interface YoutubeWidgetItem extends WidgetItem {
    video_id: string;
}

const { item } = defineProps<{item: YoutubeWidgetItem}>();
</script>

<style scoped>
</style>
