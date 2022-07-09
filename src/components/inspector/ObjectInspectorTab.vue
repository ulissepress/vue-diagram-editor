<template>
    <div :class="{ 'inspector-tab': true, 'tab-selected': selected }">
        {{ tab.title }}
    </div>
</template>


<script setup lang="ts">
import { InspectorTab } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorTabProps {
    object?: any;
    tab: InspectorTab;
    selected: boolean
}

export interface ObjectInspectorTabEvents {
}

// Define props
const { object, tab } = defineProps<ObjectInspectorTabProps>();

// Define events
const emit = defineEmits<ObjectInspectorTabEvents>();
// ------------------------------------------------------------------------------------------------------------------------

</script>


<style  scoped>
.inspector-tab {
    width: 100px;

    background-color: rgb(226, 226, 226);
    color: #333;
    
    
    text-align: center;
    font-size: 12px;
    padding: 4px;
    text-transform: uppercase;
    cursor: pointer;
}

.inspector-tab:hover:not(.tab-selected) {
    background-color: rgb(188, 186, 186);
}

.tab-selected {
    background-color: #4af;
    color: white;
}
</style>