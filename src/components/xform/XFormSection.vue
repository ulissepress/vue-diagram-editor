<template>
    <div v-if="section.fields.length > 0" class="xform-section" :style="{ 'background-color': hideTitle ? 'transparent': '' }">
        <div class="section-title" v-if="!hideTitle">
            {{ formContext.resolveString(section.title) }}
        </div>
        <div class="section-fields-container">
            <XFormField v-for="(field, index) in section.fields" 
                        v-model = "modelValue" 
                        :field  = "field"
                        :style  = "{ width: calculateFieldWidth(field) }"  
                        @update:model-value = "emit('update:modelValue', modelValue)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { FieldWidth, FormField, FormSection } from './types';
import { FormContext } from './XForm.vue';
import XFormField from './XFormField.vue';


export interface FormSectionProps {
    modelValue: Object;
    section: FormSection;
    hideTitle: boolean;
}

export interface FormSectionEvents {
    (e: 'update:modelValue', modelValue: object ): void    
}

// Define Props
const { modelValue, section, hideTitle } = defineProps<FormSectionProps>();

    // Define Events
const emit = defineEmits<FormSectionEvents>();

const formContext = inject<FormContext>('xform-context')!;


function calculateFieldWidth(f: FormField) : string {
    let w = f.width === FieldWidth.SMALL  ? "25%" :
            f.width === FieldWidth.MEDIUM ? "50%" :
            f.width === FieldWidth.LARGE  ? "75%" : "100%";
    
    return `calc(${w} - 6px)`;
}
</script>


<style scoped>
.xform-section {
    background-color: #e2e9f2;
    width: 100%;
    height: auto;
    padding: 0px;
    margin-bottom: 16px;
}

.section-title {
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 1px;
    background-color: #c8d3e1;
    color: #333;
    padding: 4px;
    padding-left: 8px;
    margin-bottom: 8px;
}

.section-fields-container {
    width: calc(100% - 24px);
    background-color: transparent;
    padding: 4px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>
