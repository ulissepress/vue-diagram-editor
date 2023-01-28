<template>
    <input class   = "editor-slider" 
           type    = "range"  
           :value  = "getObjectValue(object, property.name)" 
           :min    = "property.editorOptions?.min  || 0"
           :max    = "property.editorOptions?.max  || 100" 
           :step   = "property.editorOptions?.step || 1" 
           @input  = "onChange($event, false)" 
           @change = "onChange($event, true)" /> 

    <NumberEditor :object="object" :property="property" @property-changed="onNumericValueChanged" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
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
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any, emitCommand: boolean): void
}

// Define props
const { object, property } = defineProps<RangeEditorProps>();

// Define events
const emit = defineEmits<RangeEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const originalValue = ref(0);
onMounted(() => {
    originalValue.value = getObjectValue(object, property.name)
})


function convertValue(value: string): number {
    let v = parseFloat(value);
    return isNaN(v) ? 0 : v;
}

function onChange(e: any, emitCommand: boolean) {
    let newValue = convertValue(e.target.value);
    
    setObjectValue(object, property.name, newValue);
    emit('property-changed', property, originalValue.value, newValue, emitCommand)

    // Update the value baseline if a command is emitted
    if(emitCommand) originalValue.value = getObjectValue(object, property.name);
}

function onNumericValueChanged(property: ObjectProperty, oldValue: any, newValue: any) {
    if(oldValue === newValue) return;
        
    emit('property-changed', property, oldValue, newValue, true)
    // Update the value baseline (as a command has been emitted)
    originalValue.value = newValue;                 
}

</script>

<style scoped>
.editor-slider {
    width: calc(100% - 60px);
}

</style>