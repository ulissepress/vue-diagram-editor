<template>
    <div class="color-picker">
        <div class="color-preview" @click="openPicker" :style="{ width: (previewSize || 16) + 'px', height: (previewSize || 16) + 'px', backgroundColor: currentColor }"></div> 
        <div v-if="showColorValue" class="color-value">{{ currentColor }}</div>
    </div>
    <Teleport to="body">
        <Sketch v-if = "open"
                ref                = "picker"
                :style             = "getPickerStyle()" 
                :modelValue        = "currentColor" 
                @update:modelValue = "onChange($event, false)" />
    </Teleport>
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
    (e: 'color-changed', color: string, emitCommand: boolean): void
}

// Define props
const { color } = defineProps<ColorPickerProps>();

// Define events
const emit = defineEmits<ColorPickerEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const open           = ref(false);
const currentColor   = ref(color);
const pickerPosition = ref({ x: 0, y: 0 })

// Close the picker when clicking oujtside of it
const picker = ref(null)
onClickOutside(picker, () => {
    open.value = false
})


function openPicker(e: MouseEvent) {
    // Save the mouse position, so the picker can be opened 'close' to the mouse click coordinates    
    pickerPosition.value = { x: e.clientX, y: e.clientY }   
    
    // Open the picker
    open.value = true;
}

function getPickerStyle() {
    let top  = (pickerPosition.value.y + 20);
    let left = (pickerPosition.value.x - 20);
    
    if(top  > document.body.clientHeight - 350) top  = document.body.clientHeight - 350;
    if(left > document.body.clientWidth  - 250) left = document.body.clientWidth  - 250;

    top  = Math.max(0, top);
    left = Math.max(0, left);
    
    return {
        position: 'absolute',
        top: top + 'px',
        left: left + 'px',
        zOrder: 10000
    }
}

function onChange(e: any, emitCommand: boolean) {
    console.log('%%%%%%%%%%%%%%%% colorPicker.onChange', e, emitCommand);
    if(!e.hex8) return;
    currentColor.value = e.hex8; 
    emit('color-changed', e.hex8, emitCommand);
}

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