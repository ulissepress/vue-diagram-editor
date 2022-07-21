<template>
    <div class="toolbar">
        <div class="btn" @click="zoomOut" title="Zoom Out"><Icon icon="zoom_out" /></div>
        <div class="zoom-info" title="Current Zoom">{{ zoomManager.getZoomFactor() * 100 }}%</div>         
        <div class="btn" @click="zoomIn" title="Zoom In"><Icon icon="zoom_in"/></div>
        <div class="btn" @click="zoomReset" title="Zoom Reset"><Icon icon="center_focus_weak"/></div>
    </div>
</template>

<script setup lang="ts">
import { IZoomManager } from '../ZoomManager';
import Icon from './Icon.vue';


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
    zoomManager: IZoomManager
}

const { zoomManager } = defineProps<ToolbarProps>();

interface ToolbarEvents {
    (e: 'zoom-changed', newZoomFactor: number, scrollViewerToCenter?: boolean): void    
}

const emit = defineEmits<ToolbarEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function zoomReset() 
{ 
    const oldZoom = zoomManager.getZoomFactor();
    const newZoom = zoomManager.zoomReset();
    if(oldZoom !== newZoom) emit("zoom-changed", newZoom, true)
}

function zoomIn()    
{ 
    const oldZoom = zoomManager.getZoomFactor();
    const newZoom = zoomManager.zoomIn();
    if(oldZoom !== newZoom) emit("zoom-changed", newZoom, false)    
}

function zoomOut() { 
    const oldZoom = zoomManager.getZoomFactor();
    const newZoom = zoomManager.zoomOut();
    if(oldZoom !== newZoom) emit("zoom-changed", newZoom, false)    
}

</script>

<style scoped>
.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
 
    width: auto;
    height: auto;
    background-color: #fefefe;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 5px #ccc;
    gap: 0px;
    user-select: none;
}

.btn {
    display: flex;
    justify-content: center;
    align-items: center; 
    cursor: pointer;
    width: 32px;
    height: 32px;
    text-align: center;
}


.btn:hover {
    background-color: #efefef;
}
.zoom-info {
    width: 40px;
    font-size: 12px;
    text-align: center;
}


</style>
