<template>
    <input class="editor" type="text" 
           :value="getObjectValue(object, property.name)"
           @keydown     = "onKeyDown"
           @keyup.enter = "onChange"
           @change      = "onChange" />
</template>

<script setup lang="ts">
import { ObjectProperty } from "../types";
import { getObjectValue, setObjectValue } from "./utils";

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

function convertValue(value: string): number {
    let v = parseFloat(value);
    if(isNaN(v)) v = 0;
    return v;
}

function onChange(e: any) {
    let v = convertValue(e.target.value);

    setObjectValue(object, property.name, v);    
    emit('property-changed', property, v)
}

function toMinMax(v: number): number {
    if(!property.editorOptions) return v;

    const min = property.editorOptions.min; 
    const max = property.editorOptions.max; 

    if(min !== undefined && v < min) v = min;
    if(max !== undefined && v > max) v = max;
    
    return v;
}

function onKeyDown(e: any) {
    let v = convertValue(e.target.value);

    const delta = e.shiftKey ? 10 : 1;

    if(e.key === 'ArrowDown') { v = toMinMax(v - delta); e.preventDefault(); }
    if(e.key === 'ArrowUp')   { v = toMinMax(v + delta); e.preventDefault(); }

    e.target.value = v;
    onChange(e);
}

</script>

<style scoped>
.editor {
    max-width: 100%;
    width: 40px;    
}
</style>