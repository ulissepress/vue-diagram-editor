<template>
    <div v-if="formContext.resolveBoolean(field.visible)" class="xform-field">
        <div class="field-label">
            {{ formContext.resolveString(field.label || field.name) }}
        </div>
        <div class="field-editor" style="width: calc(100% - 8px)">
            <TextEditor :object   = "modelValue" 
                        :property = "{ name: field.name }" 
                        @property-changed="emit('update:modelValue', modelValue)" />
        </div>
        <div v-if="!isEmpty(field.helpText)" class="field-help">
            {{ formContext.resolveString(field.helpText || '') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import TextEditor from '../inspector/property-editors/TextEditor.vue';
import { isEmpty } from './helpers';
import { FormField } from './types';
import { FormContext } from './XForm.vue';

export interface FormFieldProps {
    modelValue: Object;
    field: FormField
}

export interface FormFieldEvents {
    (e: 'update:modelValue', modelValue: object ): void    
}

// Define Props
const { modelValue, field } = defineProps<FormFieldProps>();

    // Define Events
const emit = defineEmits<FormFieldEvents>();

const formContext = inject<FormContext>('xform-context')!;

</script>


<style scoped>
.xform-field {
    display: flex;
    flex-direction: column;
    width:  100%;
    height: auto;
    padding: 0px;
    margin-bottom: 8px;
}

.field-label {
    font-size: 0.8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 2px;
}

.field-editor {
    font-size: 1em;
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
