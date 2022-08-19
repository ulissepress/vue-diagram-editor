<template>
    <div v-if="property.name === ''" class="separator"></div>
    <div v-else class="property-container" :style="{ width: property.editorFullsize || singleColumn ? '98%' : '49%' }">
        <div class="property-label"  :style="{ width: singleColumn ? '100px' : '60px' }">{{ property.label }}</div>
        <div class="property-editor" :style="{ width: singleColumn ? 'calc(100% - 100px - 10px)' : 'calc(100% - 60px - 10px)',  justifyContent: property.editorRightAlign === true && !singleColumn ? 'flex-end' : 'flex-start' }">
            <component v-if = "!property.readonly" 
                       :is               = "editor" 
                       :object           = "object" 
                       :property         = "property" 
                       @property-changed = "(p: any, oldValue: any, newValue: any) => emit('property-changed', p, oldValue, newValue)"  />
            <div v-else class="readonly-value" v-html="readonlyValue" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { computed, inject, onUpdated } from "vue";
import { getObjectValue } from "../inspector/property-editors/utils";
import { getEditorForProperty } from "./helpers";

//@ts-ignore
import { ObjectInspectorModel, ObjectProperty, PropertyType } from "./types";

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorPropertyProps {
    object?: any;
    property: ObjectProperty;
}

export interface ObjectInspectorPropertyEvents {
    (e: 'property-changed', property: ObjectProperty, oldValue: any, newValue: any): void
}

// Define props
const { object, property } = defineProps<ObjectInspectorPropertyProps>();

// Define events
const emit = defineEmits<ObjectInspectorPropertyEvents>();
// ------------------------------------------------------------------------------------------------------------------------


onUpdated(() => {
    console.log('ObjectInspectorProperty: onUpdated');
});

const editor = computed(() => getEditorForProperty(property.type || PropertyType.TEXT))

const schema       = inject<ObjectInspectorModel>('object-inspector-schema')
const singleColumn = computed(() => schema?.singleColumn === true);


const readonlyValue = computed(() => {
   const fmtFunc = property.formatValue;

   return fmtFunc ? fmtFunc(object, property, getObjectValue(object, property.name)) : getObjectValue(object, property.name);
})

</script>

<style>
.property-container input,
.property-container select
{
    border: 0px;
    background-color: transparent;
    font-size: 11px;
    color: #ddd;
    border: 1px solid transparent !important;
    padding: 2px 4px;
    border-radius: 2px;
}

.property-container input:focus,  .property-container input:focus-visible,
.property-container select:focus, .property-container select:focus-visible
{
    background-color: #626262;
    color: #f5f5f5;
    border: 1px solid #4af !important;
    outline: 0px !important;    
}

.property-container input:hover,
.property-container select:hover
{
    border: 1px solid #4af !important;
}

</style>

<style scoped>
.property-container {
    display: inline-block;    
    height: auto;
    user-select: none;
    overflow: hidden;
    vertical-align: middle;
    line-height: 1;
    margin-bottom: 4px;

    --label-width: 60px;
}

.property-label {
    display: inline-block;
    user-select: none;

    text-align: right;
    font-size: 11px;
    line-height: 1;
    padding: 4px;
    color: #aaa;
    vertical-align: middle;

    width:     var(--label-width);
    
}

.property-editor {
    display: inline-flex;
    width: calc(100% - var(--label-width) - 10px);
    color: #aaa;
    font-size: 11px;
    line-height: 1;
    vertical-align: middle;
}

.readonly-value {
    color: #aaa;
}

.separator {
    height: 8px;
    padding: 0px;
}
</style>