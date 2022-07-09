<template>
    <div class="section-container">
        <div class="section-title">{{ section.title }}</div>
        <ObjectInspectorProperty v-for="p in section.properties" 
            :key      = "p.name" 
            :property = "p"
            :object   = "object" />
    </div>
</template>


<script setup lang="ts">
import ObjectInspectorProperty from "./ObjectInspectorProperty.vue";
import { InspectorSection } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorSectionProps {
    object?: any;
    section: InspectorSection;
}

export interface ObjectInspectorSectionvents {
}

// Define props
const { object, section } = defineProps<ObjectInspectorSectionProps>();

// Define events
const emit = defineEmits<ObjectInspectorSectionvents>();
// ------------------------------------------------------------------------------------------------------------------------

</script>


<style  scoped>
.section-container {
    width: 100%;
    height: auto;
    min-height: 50px;
}

.section-title {
    background-color: rgb(216, 216, 216);
    color: #333;
    text-align: left;
    font-size: 12px;
    padding: 4px;
    color: #111;
}

.tab-selected {
    background-color: #4af;
    color: white;
}
</style>