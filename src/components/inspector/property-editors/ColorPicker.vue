<template>
    <div class="color-picker">
        <div class="color-preview" @click="open = true" :style="{ width: (previewSize || 16) + 'px', height: (previewSize || 16) + 'px', backgroundColor: currentColor }"></div> 
        <div v-if="showColorValue" class="color-value">{{ currentColor }}</div>
    </div>
    <Sketch style="position: absolute;" ref="picker" v-if="open" :modelValue="currentColor" @update:modelValue="currentColor=$event.hex8; $emit('color-changed', $event.hex8)" />
</template>

<script setup lang="ts">
//@ts-ignore
import { Sketch } from '@ckpack/vue-color';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ColorPickerProps {
    color: string,
    previewSize?: number,
    showColorValue?: boolean
}

export interface ColorPickerEvents {
    (e: 'color-changed', color: string): void
}

// Define props
const { color } = defineProps<ColorPickerProps>();

// Define events
const emit = defineEmits<ColorPickerEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const open = ref(false);
const currentColor = ref(color);
const picker = ref(null)
onClickOutside(picker, () => open.value = false)

</script>

<style scoped>
.color-picker {
    display: flex;
    justify-items: flex-start;
    align-items: center;
    gap: 4px;
}

.color-preview {
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid #eeeeee55
}

.color-value {
    font-size: 11px;
    text-transform: uppercase;
}
</style>