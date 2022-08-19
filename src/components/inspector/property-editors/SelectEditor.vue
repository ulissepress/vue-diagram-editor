<template>
    <select class="editor" :value="getObjectValue(object, property.name)" @change="onChange">
        <option v-for="option in property.editorOptions.items">{{ option }}</option>
    </select>
</template>

<script setup lang="ts">
import { ObjectProperty } from "../types";
import { getObjectValue, setObjectValue } from "./utils";


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface SelectEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface SelectEditorEvents {
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any): void
}

// Define props
const { object, property } = defineProps<SelectEditorProps>();

// Define events
const emit = defineEmits<SelectEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function onChange(e: any) {
    const oldValue = getObjectValue(object, property.name);
    setObjectValue(object, property.name, e.target.value);    
    emit('property-changed', property, oldValue, e.target.value)
}
</script>

<style scoped>
.editor {
    width: 100%;
}
</style>