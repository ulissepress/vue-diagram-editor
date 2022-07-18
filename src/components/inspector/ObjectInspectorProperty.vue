<template>
    <div class="property-container" :style="{ width: property.editorFullsize ? '99%' : '49%' }">
        <div class="property-label">{{ property.label }}</div>
        <div class="property-editor">
            <component v-if="!property.readonly" :is="editor" 
                       :object="object" 
                       :property="property" 
                       v-bind="property.editorOptions"
                       @property-changed="(p: any, v: any) => emit('property-changed', p, v)"  />
            <div v-else class="readonly-value">{{ property.formatValue ? property.formatValue(property, object) : object[property.name] }}</div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { getEditorForProperty } from "./helpers";

//@ts-ignore
import { ObjectProperty, PropertyType } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorPropertyProps {
    object?: any;
    property: ObjectProperty;
}

export interface ObjectInspectorPropertyEvents {
    (e: 'property-changed', property: ObjectProperty, newValue: any): void
}

// Define props
const { object, property } = defineProps<ObjectInspectorPropertyProps>();

// Define events
const emit = defineEmits<ObjectInspectorPropertyEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const editor = computed(() => getEditorForProperty(property.type || PropertyType.TEXT))

</script>

<style>
.property-container input {
    border: 0px;
    background-color: #626262;
    font-size: 11px;
    color: white;
    padding: 2px 4px;
}
.property-container input:focus,
.property-container input:focus-visible
{
    border: 0px !important;
    outline: 0px !important;    
}

</style>

<style scoped>
.property-container {
    display: inline-block;
    width: 100%;
    height: auto;
    user-select: none;
    overflow: hidden;
    vertical-align: middle;
    line-height: 1;
    margin-bottom: 2px;


    --label-width: 60px;

}

.property-label {
    display: inline-block;
    user-select: none;

    text-align: right;
    font-size: 11px;
    line-height: 1;
    padding: 4px;
    width:     var(--label-width);
    min-width: var(--label-width);
    max-width: var(--label-width);
    /* background-color: lightyellow; */
    color: #aaa;
    vertical-align: middle;

}

.property-editor {
    display: inline-block;
    width: calc(100% - var(--label-width) - 10px);
    color: #aaa;
    font-size: 11px;
    line-height: 1;
    vertical-align: middle;
    /* background-color: #f2f2c9; */
}

.readonly-value {
    color: #aaa;
}

</style>