<template>
    <input class  = "editor-slider" 
           type   = "range"  
           :value = "object[property.name]" 
           :min   = "property.editorOptions?.min || 0"
           :max   = "property.editorOptions?.max || 100" 
           @input = "onChange" />

    <input class        = "editor-input"  
           type         = "text" 
           maxlength    = "6"
           :value       = "object[property.name]"
           @keypress    = "onKeyPress"
           @keyup.enter = "onChange"
           @change      = "onChange" />

</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>

<script setup lang="ts">
import { ObjectProperty } from "../types";


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

function onChange(e: any) {
    let v = parseInt(e.target.value);
    if(isNaN(v)) v = 0;

    object[property.name] = v;
    emit('property-changed', property, v)
}

function onKeyPress(e: any) {
    if(!e.key.match(/[0-9\-]/)) e.preventDefault();        
}
</script>

<style scoped>
.editor-slider {
    width: calc(100% - 50px);

}

.editor-input {
    width: 30px;
    vertical-align: super;
}



</style>