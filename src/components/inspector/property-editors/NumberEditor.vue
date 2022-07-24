<template>
    <input class="editor" type="text" 
           :value="getObjectValue(object, property.name)"
           @keypress    = "onKeyPress"
           @keyup.enter = "onChange"
           @change="onChange" />
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

function onChange(e: any) {
    let v = parseFloat(e.target.value);
    if(isNaN(v)) v = 0;

    setObjectValue(object, property.name, v);    
    emit('property-changed', property, v)
}

function onKeyPress(e: any) {
    if(!e.key.match(/[0-9\-\.]/)) e.preventDefault();        
}

</script>

<style scoped>
.editor {
    max-width: 100%;
    width: 40px;    
}
</style>