<template>
    <select class="editor" :value="object[property.name]" @change="onChange">
        <option v-for="option in property.editorOptions.items">{{ option }}</option>
    </select>
</template>

<script setup lang="ts">
import { ObjectProperty } from "../types";


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface SelectEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface SelectEditorEvents {
    (e: 'property-changed', property: ObjectProperty, newValue: any): void
}

// Define props
const { object, property } = defineProps<SelectEditorProps>();

// Define events
const emit = defineEmits<SelectEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function onChange(e: any) {
    object[property.name] = e.target.value;
    emit('property-changed', property, e.target.value)
}
</script>

<style scoped>
.editor {
    width: calc(100% - 10px);
}
</style>