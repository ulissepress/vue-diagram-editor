<template>
    <input  class        = "editor" 
            type         = "text" 
            :value       = "getObjectValue(object, property.name)" 
            @keyup.enter = "onChange" 
            @blur        = "onChange" 
            @change      = "onChange" />
</template>

<script setup lang="ts">
import { onUpdated } from "vue";
import { ObjectProperty } from "../types";
import { getObjectValue, setObjectValue } from "./utils";


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface TextEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface TextEditorEvents {
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any): void
}

// Define props
const { object, property } = defineProps<TextEditorProps>();

// Define events
const emit = defineEmits<TextEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------
onUpdated(() => {
    console.log('TextEditor: onUpdated');
});

function onChange(e: any) {
    const oldValue = getObjectValue(object, property.name);
    setObjectValue(object, property.name, e.target.value);
    emit('property-changed', property, oldValue, e.target.value)
}
</script>

<style scoped>
.editor {
    width: calc(100% - 8px);
}
</style>