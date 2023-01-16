<template>
    <div :id="schema.name" class="xform" :key="forceUpdate">
        <div v-if="schema.title" class="form-title">
            {{ formContext.resolveString(schema.title) }}
        </div>
        <div v-if="schema.tabs.length > 1" class="tab-container">
            <XFormTab v-for="(tab, index) in schema.tabs"  
                      :schema   = "tab" 
                      :selected = "index === currentTab" 
                      @click    = "currentTab = index" />
        </div>
        <div v-if="schema.tabs.length > 0" class="section-container">
            <XFormSection v-for="(section, index) in schema.tabs[currentTab].sections" :key="index"
                          v-model    = "modelValue" 
                          :section   = "section" 
                          :hideTitle = "schema.tabs[currentTab].sections.length === 1" 
                          @update:model-value = "emit('update:modelValue', modelValue); forceUpdate++" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, provide, ref } from 'vue';
import { resolveBooleanValue, resolveNumberValue, resolveStringValue } from './helpers';
import { registerBuiltinEditors } from './registry';
import { BooleanValue, FormSchema, NumberValue, StringValue } from './types';
import XFormSection from './XFormSection.vue';
import XFormTab from './XFormTab.vue';


export interface FormProps {
    modelValue: object,
    schema: FormSchema
}

export interface FormEvents {
    (e: 'update:modelValue', modelValue: object ): void    
}

export interface FormContext {
    model: any;
    
    resolveString (v: StringValue)  : string;
    resolveNumber (v: NumberValue)  : number;
    resolveBoolean(v: BooleanValue) : boolean;
}

// Define Props
const { modelValue, schema } = defineProps<FormProps>();

    // Define Events
const emit = defineEmits<FormEvents>();

// Register builtin editors for the variout field types
registerBuiltinEditors();

onMounted(() => {
    console.log('### XForm mounted')
})
    
onUpdated(() => {
    console.log('### XForm updated')
})

const forceUpdate = ref(0);
const currentTab  = ref(0);

// Create a form context to be exposed to all children component (via Vue provide() API)
const formContext: FormContext = {
    model: modelValue,

    resolveString (v: StringValue)  : string  { return resolveStringValue (v, formContext); },
    resolveNumber (v: NumberValue)  : number  { return resolveNumberValue (v, formContext); },
    resolveBoolean(v: BooleanValue) : boolean { return resolveBooleanValue(v, formContext); },
}
provide('xform-context', formContext);

</script>

<style>
.xform, 
.xform * {
    box-sizing: border-box;
    --xform-debug: 0px;
}
</style>

<style scoped>
.xform {
    /* Base font size for the form. All other elements should use 
    font size expressed in 'em' units */
    font-size: 16px;  

    background-color: transparent;
    width:  100%;
    height: 100%;
    max-height: 100%;
    max-width: 100%;

    padding: 0px;
    overflow: auto;
    display: flex;
    flex-direction: column;

    border: var(--xform-debug) dashed gray;

}


.form-title {
    flex-grow: 0;
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 1em;
}

.tab-container {
    width: 100%;
    height: auto;
    padding: 0px;
    margin-bottom: 4px;

    border: var(--xform-debug) dashed blue;
}

.section-container {
    flex-grow: 1;
    overflow: auto;
    width: 100%;
    padding: 0px;

    border: var(--xform-debug) dashed blue;

}
</style>
