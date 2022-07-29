<template>
    <div v-if="property.name === ''" class="separator"></div>
    <div v-else class="property-container" :style="{ width: property.editorFullsize ? '98%' : '49%' }">
        <div class="property-label">{{ property.label }}</div>
        <div class="property-editor" :style="{ justifyContent: property.editorRightAlign === true ? 'flex-end' : 'flex-start' }">
            <component v-if = "!property.readonly" 
                       :is               = "editor" 
                       :object           = "object" 
                       :property         = "property" 
                       v-bind            = "property.editorOptions"
                       @property-changed = "(p: any, v: any) => emit('property-changed', p, v)"  />
            <div v-else class="readonly-value" v-html="readonlyValue" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { computed, onUpdated } from "vue";
import { getObjectValue } from "../inspector/property-editors/utils";
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


onUpdated(() => {
    console.log('ObjectInspectorProperty: onUpdated');
});

const editor = computed(() => getEditorForProperty(property.type || PropertyType.TEXT))


const readonlyValue = computed(() => {
   const f = property.formatValue;
   console.log('formatting readonly value 0', f, property);

   if(!f) return getObjectValue(object, property.name);

   console.log('formatting readonly value obj', object)
   console.log('formatting readonly value prop', property)
   console.log('formatting readonly value value', getObjectValue(object, property.name))
   return f(object, property, getObjectValue(object, property.name));
})

</script>

<style>
.property-container input,
.property-container select
{
    border: 0px;
    background-color: transparent;
    font-size: 12px;
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
    font-size: 12px;
    line-height: 1;
    padding: 4px;
    width:     var(--label-width);
    min-width: var(--label-width);
    max-width: var(--label-width);
    /* background-color: lightyellow; */
    color: #aaa;
    vertical-align: top;
}

.property-editor {
    display: inline-flex;
    width: calc(100% - var(--label-width) - 10px);
    color: #aaa;
    font-size: 12px;
    line-height: 1;
    vertical-align: middle;
}

.readonly-value {
    color: #aaa;
}

.separator {
    height: 12px;
    padding: 0px;
}
</style>