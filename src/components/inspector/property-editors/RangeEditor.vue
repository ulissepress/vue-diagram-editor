<template>
    <input class  = "editor-slider" 
           type   = "range"  
           :value = "getObjectValue(object, property.name)" 
           :min   = "property.editorOptions?.min || 0"
           :max   = "property.editorOptions?.max || 100" 
           @input = "onChange" />

    <NumberEditor :object="object" :property="property" />
</template>

<script setup lang="ts">
import { ObjectProperty } from "../types";
import NumberEditor from './NumberEditor.vue';
import { getObjectValue, setObjectValue } from "./utils";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface RangeEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface RangeEditorEvents {
    (e: 'property-changed', property: ObjectProperty, newValue: any): void
}

// Define props
const { object, property } = defineProps<RangeEditorProps>();

// Define events
const emit = defineEmits<RangeEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function convertValue(value: string): number {
    let v = parseFloat(value);
    return isNaN(v) ? 0 : v;
}

function onChange(e: any) {
    let v = convertValue(e.target.value);

    setObjectValue(object, property.name, v);
    emit('property-changed', property, v)
}

</script>

<style scoped>
.editor-slider {
    width: calc(100% - 60px);
}

</style>