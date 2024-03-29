<template>
    <div class="editor">
        <template v-for="item in property.editorOptions.items" :key="item.name">
            <div class="item" :style="{
                    backgroundColor: getObjectValue(object, property.name) === item.name ? editorContext?.theme.primaryColor  : '#777',
                    color:           getObjectValue(object, property.name) === item.name ? 'white' : '#ddd',
                    width:           item.text ? 'auto' : '20px'                    
                  }" 
                  @click="getObjectValue(object, property.name) !== item.name && onChange(item)">
                    <div v-if="item.text" class="text">{{ item.text }}</div>
                    <Icon v-else class="item" size="16px" :icon="item.icon" :title="item.name" />
            </div>
        </template>        
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import Icon from "../../diagram-editor/components/Icon.vue";
import { EditorContext } from "../../diagram-editor/DiagramEditor.vue";
import { ObjectProperty } from "../types";
import { getObjectValue, setObjectValue } from "./utils";


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface IconListEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface IconListEditorEvents {
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any, emitCommand: boolean): void
}

// Define props
const { object, property } = defineProps<IconListEditorProps>();

// Define events
const emit = defineEmits<IconListEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const editorContext = inject<EditorContext>('diagram-editor-context');

function onChange(item: { name: string, icon: string}) {
    const oldValue = getObjectValue(object, property.name);
    const newValue = item.name;
    
    if(oldValue === newValue) return;

    setObjectValue(object, property.name, newValue);    
    emit('property-changed', property, oldValue, newValue, true)
}
</script>

<style scoped>
.editor {
    display: flex;
    align-items: center;    
    gap: 2px;
    /* border: 1px solid red; */
}

.item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px !important;
    padding: 1px;

    border: 1px solid transparent;
    border-radius: 2px;
    cursor: pointer;
}

.item:hover {
    border: 1px solid var(--diagram-primary-color);
}
.text {
    width: auto;
    height: 18px;
    font-size: 11px;
    text-align: center;
    vertical-align: middle;
    line-height: 1.5;
    padding: 1px 4px;
}

</style>