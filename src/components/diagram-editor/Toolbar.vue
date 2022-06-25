<template>
    <div class="toolbar">
        <div v-for = "t in tools" 
            :key="t.type" 
            :class="{'tool' : t.type !== 'separator', 'separator': t.type === 'separator', 'selected': selectedTool == t.type }"
            :title="t.title"
            @click="t.type !== 'separator' && onToolSelected(t.type, selectedTool)">  
            
            <Icon v-if="t.type !== 'separator'" :icon="t.icon" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import Icon from './Icon.vue';
import { EditorTools } from './types';

interface Tool {
    type:  EditorTools | "separator";
    title: string;
    icon:  string;
}

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
    selectedTool: EditorTools,
    supportsCustomWidgets: boolean,
}


const { selectedTool, supportsCustomWidgets } = defineProps<ToolbarProps>();

interface ToolbarEvents {
    (e: 'toolSelected', toolType: EditorTools): void    
}

const emit = defineEmits<ToolbarEvents>();

onMounted(()=> console.log('Toolbar mounted', selectedTool))
onUpdated(()=> console.log('Toolbar updated', selectedTool))


const tools: Tool[] = [
    { type: EditorTools.SELECT,     title: 'Select',    icon: 'ads_click'   },    
    { type: 'separator', title: '', icon: '' },    
    { type: EditorTools.TEXT,       title: 'Text',      icon: 'text_fields' },
    { type: EditorTools.IMAGE,      title: 'Image',     icon: 'image'       },
    { type: EditorTools.CONNECTION, title: 'Link',      icon: 'share'       },    
    { type: 'separator', title: '', icon: '' },    
    { type: EditorTools.LINE,       title: 'Line',      icon: 'horizontal_rule'    },
    { type: EditorTools.RECTANGLE,  title: 'Rectangle', icon: 'rectangle'    },
    { type: EditorTools.TRIANGLE,   title: 'Triangle',  icon: 'change_history' },
    { type: EditorTools.ELLIPSE,    title: 'Ellipse',   icon: 'circle'      },
    { type: EditorTools.STAR,       title: 'Shape',     icon: 'grade'       },
];

if(supportsCustomWidgets) {
 tools.push({ type: 'separator', title: '', icon: '' });
 tools.push({ type: EditorTools.WIDGET, title: 'Widget',  icon: 'grid_view' })
}
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
    height: auto;

    background-color: #fefefe;
    border: 1px solid #ccc;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    gap: 0px;
    user-select: none;
}

.tool {
    width: 100%;
    height: auto;
    padding: 4px 2px;

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
