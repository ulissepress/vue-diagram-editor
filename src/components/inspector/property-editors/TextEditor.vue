<template>
    <input class="editor" type="text" :value="object[property.name]" @input="onChange" />
</template>

<script setup lang="ts">
import { ObjectProperty } from "../types";


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface TextEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface TextEditorEvents {
    (e: 'property-changed', property: ObjectProperty, newValue: any): void
}

// Define props
const { object, property } = defineProps<TextEditorProps>();

// Define events
const emit = defineEmits<TextEditorEvents>();
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