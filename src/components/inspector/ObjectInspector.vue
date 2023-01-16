<template>
    <div class="object-inspector">
        <div class="inspector-title">
            <div class="inspector-title-drag-handle">{{ title || 'Inspector' }}</div>
            <div style="flex-grow: 1; pointer-events: none; "></div>
            <div @click="expanded = !expanded" style="cursor: pointer;">
                <Icon v-show="expanded"  size='16px' icon="keyboard_arrow_down" color="white" /> 
                <Icon v-show="!expanded" size='16px' icon="keyboard_arrow_right" color="white" /> 
            </div>
        </div>
        <div v-if="expanded && (object === null || object === undefined)">
            <div style="color: #aaa; font-size: 11px; text-align: center; margin-bottom: 8px; font-style: italic;">No / multiple selected object(s)</div>
        </div>
        <template v-else>
            <div v-if="schema !== null && schema.tabs.length > 1" v-show="expanded" class="tab-container">
                <ObjectInspectorTab v-for="(tab, index) in schema.tabs" 
                    :key      = "tab.title" 
                    :tab      = "tab" 
                    :object   = "object" 
                    :selected = "currentTab > (schema.tabs.length - 1) ? index === 0 : index === currentTab"
                    @click    = "currentTab = index" />
            </div>
            
            <ObjectInspectorSection v-if="schema !== null" v-show="expanded" v-for="(section, index) in schema.tabs[currentTab > schema.tabs.length - 1 ? 0 : currentTab].sections" 
                :key              = "section.name" 
                :section          = "section" 
                :object           = "object"
                @property-changed = "(changedProperty, oldValue, newValue, emitCommand) => emit('property-changed', changedProperty, oldValue, newValue, emitCommand)" />
        </template>
    </div>
</template>


<script setup lang="ts">
import { onBeforeMount, onUpdated, provide, ref } from 'vue';
import Icon from "../diagram-editor/components/Icon.vue";
import { registerPredefinedEditors } from './helpers';
import ObjectInspectorSection from './ObjectInspectorSection.vue';
import ObjectInspectorTab from './ObjectInspectorTab.vue';
import { ObjectInspectorModel, ObjectProperty } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorProps {
    title?: string;
    object?: any;
    schema: ObjectInspectorModel | null;
}

export interface ObjectInspectorEvents {
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any, emitCommand: boolean): void
}

// Define props
const { schema } = defineProps<ObjectInspectorProps>();

// Define events
const emit = defineEmits<ObjectInspectorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

onBeforeMount(() => {
    console.log('ObjectInspector.vue: onBeforeMount');
    registerPredefinedEditors();
});

onUpdated(() => {
    console.log('$$$$$  ObjectInspector updated');
});

provide('object-inspector-schema', schema);
   
const expanded   = ref(true);
const currentTab = ref(0)

function getTabSections() {
    console.log('ObjectInspector.vue: getTabSections', schema, currentTab.value);
    
    if(!schema) return [];
    if(currentTab.value > schema.tabs.length - 1) currentTab.value = 0;
    return schema.tabs[currentTab.value].sections;
}
</script>

<style  scoped>
.object-inspector {
    width: 100%;
    height: auto;
    max-height: 100%;

    background-color: #2c2c2c;
    
    overflow-x: hidden;
    overflow-y: auto;
}

.object-inspector::-webkit-scrollbar {
    width: 12px;               /* width of the entire scrollbar */
}
.object-inspector::-webkit-scrollbar-track {
    background: #333;
}
.object-inspector::-webkit-scrollbar-thumb {
    background-color: #777; 
    border-radius: 20px;    
    border: 3px solid #333;
}

.inspector-title {
    display: flex;
    color: #ddd;
    padding: 8px 8px 2px 8px;
    text-align: center;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.tab-container {
    letter-spacing: 2px;
    display: flex;
    gap: 4px;    
    margin-left: 8px;
}
</style>