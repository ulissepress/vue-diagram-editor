<template>
    <svg class      = "svg-editor" 
         @mousemove = "mouseMove" 
         @mousedown = "mouseDown" 
         @mouseup   = "mouseUp">
        
        <!-- Editable modelValue -->
        <circle v-if="editable" v-for="(p, index) in modelValue" :key="index"
                :cx         = "p.x" 
                :cy         = "p.y" 
                :r          = "5" 
                class       = "svg-point"
                @mouseenter = "hoverPoint   = p"
                @mouseleave = "hoverPoint   = null"
                @mousedown  = "draggedPoint = p"
                @mouseup    = "draggedPoint = null " />

        <slot name="ui" :points="modelValue" :editable="editable" />
    </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Point } from './types';


export interface SvgEditorProps {
    modelValue: Point[],
    editable?: boolean,
}

export interface SvgEditorEvents {
    (e: 'update:modelValue', modelValue: Point[] ): void    
}

const emit  = defineEmits<SvgEditorEvents>();
const { modelValue, editable } = defineProps<SvgEditorProps>();

const mousePressed = ref(false)
const hoverPoint   = ref<Point | null>(null);
const draggedPoint = ref<Point | null>(null);

// onUpdated(() => console.log('$$$$$ SvgEditor updated'))

// function computedPath() {
//     let path = '';
//     for(let i = 0; i < modelValue.length; i++) {
//         if(i === 0) path = `M ${modelValue[0].x} ${modelValue[0].y} `;
//         else path += `L ${modelValue[i].x} ${modelValue[i].y} `;
//     }

//     return path;
// }

function mouseMove(e: MouseEvent) {
    if(! (mousePressed.value && draggedPoint.value) ) return;
     
    const p = modelValue.find(p => p.id === draggedPoint.value?.id)
    if(!p) return;

    p.x = e.offsetX;
    p.y = e.offsetY;
    emit('update:modelValue', modelValue);
}

function mouseDown(e: MouseEvent) {
    mousePressed.value = true;
}

function mouseUp(e: MouseEvent) {
    mousePressed.value = false;
}


</script>


<style scoped>
.svg-editor {
    position: relative;
    border: 1px solid gray;
    width:  100%;
    height: 100%;
}

.svg-point {
    fill: rgb(155, 247, 155);
    stroke: #555;
    stroke-width: 1;
    z-index: 10;
}

</style>
