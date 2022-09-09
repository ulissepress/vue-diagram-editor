<template>
    &nbsp;<ColorPicker :color="getObjectValue(object, property.name)" @color-changed="onChange" :show-color-value="false" />    
</template>

<script setup lang="ts">
import { ObjectProperty } from "../types";

import ColorPicker from './ColorPicker.vue';

import { getObjectValue, setObjectValue } from "./utils";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ColorEditorProps {
    object?: any;
    property: ObjectProperty;
}

export interface ColorEditorEvents {
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any, emitCommand: boolean): void
}

// Define props
const { object, property } = defineProps<ColorEditorProps>();

// Define events
const emit = defineEmits<ColorEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function onChange(newColor: string) {
    const oldValue = getObjectValue(object, property.name);
    if(newColor === oldValue) return;

    setObjectValue(object, property.name, newColor);
    emit('property-changed', property, oldValue, newColor, true)
}
</script>

<style scoped>
input[type="color"] {
    appearance: none;
	-webkit-appearance: none;    
	border: none;
	width: 14px;
	height: 14px;
    border-radius: 50%;
    padding: 0px;
    padding-top: 2px;
    position: relative;
}


input[type="color"]::-webkit-color-swatch-wrapper {
    position: absolute;
	padding: 0;
    border-radius: 50%;
    
    width: 14px;
    height: 14px;
    top: 0px;
    left: 0px;
}
input[type="color"]::-webkit-color-swatch {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 14px;
    height: 14px;
    border: 1px solid #aaaaaa88; 
    border-radius: 50%;
    outline: 0px;
}

.color-text {
    width: 50px;
    text-align: center;
}
</style>