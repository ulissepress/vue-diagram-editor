<template>
    <div v-if="formContext.resolveBoolean(field.visible)" class="xform-field">
        <div class="field-label">
            {{ formContext.resolveString(field.label || field.name) }}
        </div>
        <div class="field-editor">
            <!-- The component use 'localValue' as v-model, then intercepts the update:modelValue event to set the new value in the modelValue object path-->
            <component :is                 = "getEditorForFieldType(field.type)[0]" 
                        v-bind             = "getEditorForFieldType(field.type)[1]" 
                        v-model            = "localValue"
                        @update:modelValue = "updateModel" /> 
        </div>
        <div v-if="!isEmpty(field.helpText)" class="field-help">
            {{ formContext.resolveString(field.helpText || '') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { getObjectValue, setObjectValue } from '../inspector/property-editors/utils';
import { isEmpty } from './helpers';
import { getEditorForFieldType } from './registry';
import { FormField } from './types';
import { FormContext } from './XForm.vue';

export interface FormFieldProps {
    modelValue: Object;
    field: FormField
}

// Define Props
const { modelValue, field } = defineProps<FormFieldProps>();

const formContext = inject<FormContext>('xform-context')!;

// The local value is initialized reading the field.name path from the object model
const localValue = ref<any>(getObjectValue(modelValue, field.name));

function updateModel(value: any) {
    localValue.value = value;  
    setObjectValue(modelValue, field.name, value);
}
</script>


<style scoped>
.xform-field {
    display: flex;
    flex-direction: column;
    width:  100%;
    height: auto;
    padding: 0px;
    margin-bottom: 16px;
    margin-right: 8px;

    border: var(--xform-debug) dashed blue;

}

.field-label {
    font-size: 0.8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 2px;
}

.field-editor {
    width: 100%;
    font-size: 1em;
    border: var(--xform-debug) dashed blue;    
}

.field-help {
    margin-top: 4px;
    font-size: 0.8em;
    font-style: italic;
}

.field-editor input {
    font-size: 0.9em;
    border: 0px !important;
    border-radius: 2px;
    padding: 4px 6px;
}

.field-editor input:focus {
    outline: 1px solid #4af;
}


</style>
