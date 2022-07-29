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
    console.log('ObjectInspectorTab: onUpdated');
});

</script>


<style  scoped>
.inspector-tab {
    width: auto;
    
    color: #aaa;    
    
    text-align: center;
    font-size: 12px;
    padding: 4px;
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;

}

.inspector-tab:hover:not(.tab-selected) {
    color: #4af;    
}

.tab-selected {
    color: #4af;
    font-weight: bold;
    
}
</style>