<template>
    <div class="object-inspector">
        <div v-if="object === null || object === undefined">
            <i>No selected object</i>
        </div>
        <template v-else>
            <div class="inspector-title">{{ title }}</div>
            <div class="tab-container">
                <ObjectInspectorTab v-for="(tab, index) in schema.tabs" 
                    :key      = "tab.title" 
                    :tab      = "tab" 
                    :object   = "object" 
                    :selected = "index === currentTab"
                    @click    = "currentTab = index" />
            </div>
            
            <ObjectInspectorSection v-for="(section, index) in schema.tabs[currentTab].sections" 
                :key      = "section.name" 
                :section  = "section" 
                :object   = "object"  
                @property-changed = "e => emit('property-changed', e)" />
        
            <br /><hr />
            <pre>{{ object }}</pre>
        </template>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import ObjectInspectorSection from './ObjectInspectorSection.vue';
import ObjectInspectorTab from './ObjectInspectorTab.vue';
import { ObjectInspectorModel, ObjectProperty } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorProps {
    title: string;
    object?: any;
    schema: ObjectInspectorModel;
}

export interface ObjectInspectorEvents {
    (e: 'property-changed', property: ObjectProperty): void
}

// Define props
const { schema } = defineProps<ObjectInspectorProps>();

// Define events
const emit = defineEmits<ObjectInspectorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const currentTab = ref(0)
</script>


<style  scoped>
.object-inspector {
    width: 100%;
    height: 100%;
    min-height: 100px;
    max-height: 100%;

    background-color: #f5f5f5;
    
    overflow-x: hidden;
    overflow-y: auto;
}

.inspector-title {
    background-color: rgb(90, 90, 90);
    color: white;
    padding: 4px;
    text-align: center;
    font-size: 14px;
    line-height: 1;
}
.tab-container {
    display: flex;
    gap: 4px;
    border-bottom: 2px solid #4af;
    margin-bottom: 4px;
}
</style>