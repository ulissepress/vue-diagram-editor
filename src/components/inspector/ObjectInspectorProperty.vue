<template>
    <div class="property-container">
        <div class="property-title">
            {{ property.label }}:
            <input type="number" size="5"
                :value="object[property.name]"
                @change="e => { 
                    object[property.name] = parseInt(e.target.value); 
                    emit('property-changed', property);
                }"
   />
        </div>
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
    (e: 'property-changed', property: ObjectProperty): void
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
    user-select: none;

}

.property-title {
    user-select: none;

    text-align: left;
    font-size: 12px;
    padding: 4px;
    color: #111;
}

</style>