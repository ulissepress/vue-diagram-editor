<template>
    <div class="toolbar">
        <div class="btn" @click="zoomOut" title="Zoom Out"><Icon icon="zoom_out" /></div>
        <div class="zoom-info" title="Current Zoom">{{ zoomFactor * 100 }}%</div>         
        <div class="btn" @click="zoomIn" title="Zoom In"><Icon icon="zoom_in"/></div>
        <div class="btn" @click="zoomReset" title="Zoom Reset"><Icon icon="center_focus_weak"/></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
    zoomFactor: number
}

const { zoomFactor } = defineProps<ToolbarProps>();

interface ToolbarEvents {
    (e: 'zoom-changed', newZoomFactor: number, scrollViewerToCenter?: boolean): void    
}

const emit = defineEmits<ToolbarEvents>();
// ------------------------------------------------------------------------------------------------------------------------


const zooms              = [5, 10, 25, 50, 75, 100, 125, 150, 200, 300, 400, 500];   // must contain the value 100
const defaultZoomIndex   = zooms.findIndex(v => v === 100);     
const zoomIndex          = ref(defaultZoomIndex); 

function zoomReset() 
{ 
    zoomIndex.value = defaultZoomIndex; 
    emit("zoom-changed", 1, true)
}

function zoomIn()    
{ 
    if(zoomIndex.value < zooms.length - 1) {
        zoomIndex.value++; 
        emit("zoom-changed", zooms[zoomIndex.value] / 100, false)
    }
}

function zoomOut() { 
    if(zoomIndex.value > 0) {
        zoomIndex.value--; 
        emit("zoom-changed", zooms[zoomIndex.value] / 100, false)
    }
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

.zoom-info {
    width: 40px;
    font-size: 12px;
    text-align: center;
}


</style>
