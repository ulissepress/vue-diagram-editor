<template>
    <div class="toolbar">
        <div v-for = "t in toolDefinitions" 
            :key   = "t.type" 
            :title = "t.title"
            @click = "t.type !== 'separator' && onToolSelected(t.type, selectedTool)"
            :class = "{
                'tool'     : t.type !== 'separator', 
                'selected' : selectedTool == t.type,
                'separator': t.type === 'separator', 
            }">
                <Icon v-if="t.type !== 'separator'" :icon="t.icon || ''" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import Icon from './Icon.vue';
import { EditorTool, toolDefinitions } from './types';

interface Tool {
    type:  EditorTool | "separator";
    title?: string;
    icon?:  string;
}

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
    selectedTool: EditorTool,
    supportsCustomWidgets: boolean,
}


const { selectedTool, supportsCustomWidgets } = defineProps<ToolbarProps>();

interface ToolbarEvents {
    (e: 'toolSelected', toolType: EditorTool): void    
}

const emit = defineEmits<ToolbarEvents>();

onMounted(()=> console.log('Toolbar mounted', selectedTool))
onUpdated(()=> console.log('Toolbar updated', selectedTool))


// if(supportsCustomWidgets) {
//  tools.push({ type: 'separator' });
//  tools.push({ type: EditorTool.WIDGET, title: 'Widget',  icon: 'grid_view' })
// }
function onToolSelected(toolType: EditorTool, currentSelectedTool: EditorTool) {    
    if(toolType == currentSelectedTool) return;
    
    console.log('Tool selected:', toolType);
    emit('toolSelected', toolType)
}
</script>

<style scoped>
.toolbar {
    position: absolute;
    top: 40px;
    left: 40px;
    width: auto;
    height: auto;
    background-color: #fefefe;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0px;
    user-select: none;
    box-shadow: 2px 2px 5px #ccc;
}

.tool {
    width: auto;
    height: auto;
    padding: 4px;

    color: #888;
    display: flex;
    justify-content: center;
    align-items: center; 
    cursor: pointer;
    user-select: none;
}

.tool:hover {
    background-color: #efefef;
}

.tool.selected {
    background-color: #4af;
    color: white;
}

.separator {
    width: 100%;
    height: 8px;
    user-select: none;
}

</style>
