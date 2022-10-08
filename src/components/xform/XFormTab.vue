<template>
    <div class="xform-tab" :class="{'xform-tab-selected' : selected }" >
        {{ formContext.resolveString(schema.title) }}
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { FormTab } from './types';
import { FormContext } from './XForm.vue';

export interface FormTabProps {
    schema: FormTab
    selected: boolean
}

// Define Props
const { schema, selected } = defineProps<FormTabProps>();

const formContext = inject<FormContext>('xform-context')!;
</script>


<style scoped>
.xform-tab {
    background-color: #dbdbdb;
    width:  auto;
    height: auto;
    padding: 4px;
    margin-bottom: 4px;
    display: inline-block;
    margin-right: 8px;
    cursor: pointer;
    padding: 2px 12px;
    font-size: 0.9em;
}

.xform-tab-selected {
    background-color: #4af;
    color: white;
}

</style>
