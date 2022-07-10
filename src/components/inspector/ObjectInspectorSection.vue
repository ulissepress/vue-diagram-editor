<template>
    <div class="section-container">
        <div class="section-title" @click="expanded = !expanded">{{ section.title }}</div>
        <ObjectInspectorProperty v-if="expanded" v-for="p in section.properties" 
            :key      = "p.name" 
            :property = "p"
            :object   = "object" 
            @property-changed = "e => emit('property-changed', e)" />
    </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import ObjectInspectorProperty from "./ObjectInspectorProperty.vue";
import { InspectorSection, ObjectProperty } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorSectionProps {
    object?: any;
    section: InspectorSection;
}

export interface ObjectInspectorSectionvents {
    (e: 'property-changed', property: ObjectProperty): void
}

// Define props
const { object, section } = defineProps<ObjectInspectorSectionProps>();

// Define events
const emit = defineEmits<ObjectInspectorSectionvents>();
// ------------------------------------------------------------------------------------------------------------------------

const expanded = ref(true);

</script>


<style  scoped>
.section-container {
    width: 100%;
    height: auto;
    margin-bottom: 8px;
    user-select: none;
}

.section-title {
    user-select: none;
    background-color: rgb(216, 216, 216);
    color: #333;
    text-align: left;
    font-size: 12px;
    padding: 4px;
    color: #111;
    cursor: pointer;
}

.tab-selected {
    background-color: #4af;
    color: white;
}
</style>