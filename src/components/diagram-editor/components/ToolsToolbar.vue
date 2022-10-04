<template>
    <div class="toolbar">
        <div v-for = "t in toolDefinitions" v-tooltip.bottom="t.title"
            :key   = "t.type" 
            
            @click = "t.type !== 'separator' && onToolSelected(t.type, selectedTool)"
            :class = "{
                'tool'     : t.type !== 'separator', 
                'selected' : selectedTool == t.type,
                'separator': t.type === 'separator', 
            }">
                <Icon v-if="t.type !== 'separator'" :icon="t.icon || ''" size="20px"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { EditorTool, toolDefinitions } from '../types';
import Icon from './Icon.vue';

interface Tool {
    type:  EditorTool | "separator";
    title?: string;
    icon?:  string;
}

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
    selectedTool: EditorTool
}


const { selectedTool } = defineProps<ToolbarProps>();

interface ToolbarEvents {
    (e: 'toolSelected', toolType: EditorTool): void    
}

const emit = defineEmits<ToolbarEvents>();

onMounted(()=> console.log('Toolbar mounted', selectedTool))
onUpdated(()=> console.log('$$$$$ Toolbar updated', selectedTool))


function onToolSelected(toolType: EditorTool, currentSelectedTool: EditorTool) {    
    if(toolType == currentSelectedTool) return;
    
    console.log('Tool selected:', toolType);
    emit('toolSelected', toolType)
}
</script>

<style scoped>
.toolbar {
    background-color: #2c2c2c;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0px;
    user-select: none;
    margin-left: 8px;
}

.tool {
    width: 18px;
    height: auto;
    padding: 4px;

    color: #fafafa; 
    display: flex;
    justify-content: center;
    align-items: center; 
    cursor: pointer;
    user-select: none;
}

.tool:hover {
    background-color: #efefef;
    color: var(--diagram-primary-color);
}

.tool.selected {
    background-color: var(--diagram-primary-color);
    color: white;
}

.separator {
    width: 8px;
    height: 100%;
    user-select: none;
}

</style>
