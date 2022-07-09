<template>
    <div class="property-container">
        <div class="property-title">{{ property.label }}: {{ object[property.name] }}</div>
    </div>
</template>


<script setup lang="ts">
import { ObjectProperty } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorPropertyProps {
    object?: any;
    property: ObjectProperty;
}

export interface ObjectInspectorPropertyEvents {
}

// Define props
const { object, property } = defineProps<ObjectInspectorPropertyProps>();

// Define events
const emit = defineEmits<ObjectInspectorPropertyEvents>();
// ------------------------------------------------------------------------------------------------------------------------

</script>


<style  scoped>
.property-container {
    width: 100%;
    height: auto;
}

.property-title {
    text-align: left;
    font-size: 12px;
    padding: 4px;
    color: #111;
}

</style>