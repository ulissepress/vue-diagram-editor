<template>
    <input type="color" :value="object[property.name]" @input="onChange" />&nbsp;
    <input type="text"  :value="object[property.name]" @input="onChange" class="color-text" />
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
input[type="color"] {
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
    border: 1px solid #aaa;
    border-radius: 50%;
}

.color-text {
    width: 45px;
    text-align: center;
}
</style>