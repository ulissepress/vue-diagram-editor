<template>
    <input class  = "editor-slider" 
           type   = "range"  
           :value = "getObjectValue(object, property.name)" 
           :min   = "property.editorOptions?.min || 0"
           :max   = "property.editorOptions?.max || 100" 
           @input = "onChange" />

    <NumberEditor :object="object" :property="property" @property-changed="onNumericValueChanged" />
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
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any): void
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
    const oldValue = getObjectValue(object, property.name);

    let newValue = convertValue(e.target.value);

    setObjectValue(object, property.name, newValue);
    emit('property-changed', property, oldValue, newValue)
}

function onNumericValueChanged(property: ObjectProperty, oldValue: any, newValue: any) {
   emit('property-changed', property, oldValue, newValue)
}

</script>

<style scoped>
.editor-slider {
    width: calc(100% - 60px);
}

</style>