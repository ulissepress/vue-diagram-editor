<template>
    <input type   = "text" 
           style  = "width: 100%;"
           :value = "modelValue" 
           @input = "$emit('update:modelValue', ($event as any).target.value)" />
</template>

<script setup lang="ts">
export interface FormFieldProps {
    modelValue: any;
}

export interface FormFieldEvents {
    (e: 'update:modelValue', modelValue: object ): void    
}

// Define Props
const { modelValue } = defineProps<FormFieldProps>();

</script>