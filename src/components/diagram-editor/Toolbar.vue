<template>
    <div class="toolbar">
        <div v-for = "t in tools" :key="t.type" class="tool" @click="onToolSelected(t.type, selectedTool)"  :class="{ 'selected': selectedTool == t.type }">
            {{ t.title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { EditorTools } from './types';

interface Tool {
    type:  EditorTools;
    title: string;
    icon:  string;
}

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
    selectedTool: EditorTools
}


const { selectedTool } = defineProps<ToolbarProps>();

interface ToolbarEvents {
    (e: 'toolSelected', toolType: EditorTools): void    
}

const emit = defineEmits<ToolbarEvents>();

onMounted(()=> console.log('Toolbar mounted', selectedTool))
onUpdated(()=> console.log('Toolbar updated', selectedTool))


const tools: Tool[] = [
    { type: EditorTools.SELECT,     title: 'Select',  icon: 'select'    },    
    { type: EditorTools.CONNECTION, title: 'Link',    icon: 'link'      },    
    { type: EditorTools.TEXT,       title: 'Text',    icon: 'text'      },
    { type: EditorTools.IMAGE,      title: 'Image',   icon: 'image'     },
    { type: EditorTools.SHAPE,      title: 'Shape',   icon: 'rectangle' },
    { type: EditorTools.WIDGET,     title: 'Widget',  icon: 'component' }
]

function onToolSelected(toolType: EditorTools, currentSelectedTool: EditorTools) {    
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
    height: 200px;

    background-color: #fefefe;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    gap: 4px;
    user-select: none;
}

.tool {
    width: 100%;
    height: 50px;
    padding: 4px;

    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center; 
    cursor: pointer;
    user-select: none;
}

.tool:hover {
    border: 1px solid navy;
}

.tool.selected {
    background-color: rgb(88, 88, 218);
    color: white;
    border: 1px solid navy;
}

</style>
