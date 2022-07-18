<template>
    <div class="object-inspector">
        <div class="inspector-title" @click="expanded = !expanded">
            <div>Inspector</div>
            <div style="flex-grow: 1"></div>
            <div>
                <Icon v-show="expanded"  size='16px' icon="keyboard_arrow_down" color="white" /> 
                <Icon v-show="!expanded" size='16px' icon="keyboard_arrow_right" color="white" /> 
            </div>
        </div>
        <div v-if="expanded && (object === null || object === undefined)">
            <div style="color: #aaa; font-size: 12px; text-align: center; margin-bottom: 8px; font-style: italic;">No selected object</div>
        </div>
        <template v-else>
            <div v-if="schema !== null" v-show="expanded" class="tab-container">
                <ObjectInspectorTab v-for="(tab, index) in schema.tabs" 
                    :key      = "tab.title" 
                    :tab      = "tab" 
                    :object   = "object" 
                    :selected = "index === currentTab"
                    @click    = "currentTab = index" />
            </div>
            
            <ObjectInspectorSection v-if="schema !== null" v-show="expanded" v-for="(section, index) in schema.tabs[currentTab].sections" 
                :key      = "section.name" 
                :section  = "section" 
                :object   = "object"
                @property-changed = "(changedProperty, newValue) => emit('property-changed', changedProperty, newValue)" />

            <!-- Debug -->
            <div v-show="expanded">
                <hr />
                <pre style="color: #ddd;">{{ object }}</pre>
            </div>
        </template>
    </div>
</template>


<script setup lang="ts">
import { onBeforeMount, onUpdated, ref } from 'vue';
import Icon from "../diagram-editor/components/Icon.vue";
import { registerPredefinedEditors } from './helpers';
import ObjectInspectorSection from './ObjectInspectorSection.vue';
import ObjectInspectorTab from './ObjectInspectorTab.vue';
import { ObjectInspectorModel, ObjectProperty } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorProps {
    object?: any;
    schema: ObjectInspectorModel | null;
}

export interface ObjectInspectorEvents {
    (e: 'property-changed', property: ObjectProperty, newValue: any): void
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
    console.log('ObjectInspector.vue: onUpdated');
});


const currentTab = ref(0)
const expanded   = ref(true);
</script>


<style  scoped>
.object-inspector {
    width: 100%;
    height: auto;
    max-height: 100%;

    background-color: #333;
    
    overflow-x: hidden;
    overflow-y: auto;
}

.object-inspector::-webkit-scrollbar {
  width: 12px;               /* width of the entire scrollbar */
}

.object-inspector::-webkit-scrollbar-track {
  background: orange;        /* color of the tracking area */
}

.object-inspector::-webkit-scrollbar-thumb {
  background-color: blue;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 3px solid orange;  /* creates padding around scroll thumb */
}

.inspector-title {
    display: flex;   
    color: white;
    padding: 8px;
    text-align: center;
    font-size: 11px;
    line-height: 1;
    cursor: pointer;
}
.tab-container {
    letter-spacing: 2px;
    display: flex;
    gap: 4px;    
    margin-left: 8px;
}
</style>