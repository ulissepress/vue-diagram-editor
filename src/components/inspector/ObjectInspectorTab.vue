<template>
    <div :class="{ 'inspector-tab': true, 'tab-selected': selected }">
        {{ tab.title }}
    </div>
</template>


<script setup lang="ts">
import { onUpdated } from "vue";
import { InspectorTab } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorTabProps {
    object?:    any;
    tab:        InspectorTab;
    selected:   boolean
}

// Define props
const { object, tab } = defineProps<ObjectInspectorTabProps>();


onUpdated(() => {
    console.log('$$$$$ ObjectInspectorTab updated');
});

</script>


<style  scoped>
.inspector-tab {
    width: auto;
    
    color: #aaa;    
    
    text-align: center;
    font-size: 11px;
    padding: 4px;
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;

}

.inspector-tab:hover:not(.tab-selected) {
    color: var(--diagram-primary-color);
}

.tab-selected {
    color: var(--diagram-primary-color);
    font-weight: bold;
    
}
</style>