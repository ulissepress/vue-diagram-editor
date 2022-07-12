<template>
    <input class="editor" type="number" 
           :value="object[property.name]"
           @change="onChange" />
</template>

<script setup lang="ts">
import { ObjectProperty } from "../types";


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface NumberEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface NumberEditorEvents {
    (e: 'property-changed', property: ObjectProperty, newValue: any): void
}

// Define props
const { object, property } = defineProps<NumberEditorProps>();

// Define events
const emit = defineEmits<NumberEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function onChange(e: any) {
    let v = parseInt(e.target.value);
    if(isNaN(v)) v = 0;

    object[property.name] = v;
    emit('property-changed', property, v)
}


</script>

<style scoped>
.editor {
    width: 100%;
}
</style>