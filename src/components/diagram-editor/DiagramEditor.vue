<template>
    <div class="editor-container">
        <Guides type="horizontal" ref="hGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :rulerStyle = "{ left: '30px', width: 'calc(100% - 30px)', height: '30px' }" :style = "{ position: 'absolute', top: '0px'}" />
        <Guides type="vertical"   ref="vGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :rulerStyle = "{ top: '30px',  height: 'calc(100% - 30px)', width: '30px' }" :style = "{ position: 'absolute', top: '0px'}" />
        <div style="position: absolute; top: 0px; left: 0px; width: 30px; height: 30px; background-color: #333;"></div>

        <VueInfiniteViewer ref="viewer" class="viewer" :useWheelScroll="true" :zoom="zoomFactor" @wheel="onScroll" @scroll="onScroll">
            <div ref="viewport" class="viewport" @click="selectNone">
                <div v-for="(item, i) in items" :key           = "item.id" 
                                                :data-item-id  = "item.id"
                                                :class         = "{ 'item' : true, 'target': item.id === selectedItem?.id, 'locked': item.locked === true}" 
                                                :style         = "getItemStyle(item)"
                                                @click.stop    = "selectItem(item)" 
                                                @dblclick.stop = "item.locked = item.locked ? false : true"> 

                        <component v-if="item.component" :is="item.component" :item="item" />

                        <div class="decorator decorator-delete" v-if="item === selectedItem" :style="{ zoom: 1 / zoomFactor }" @click.stop="deleteItem(item)" title="delete item">&times;</div>
                        <div class="decorator decorator-locked" v-if="item === selectedItem" :style="{ zoom: 1 / zoomFactor }" v-show="item.locked === true">&#x1F512;</div>
                        <div class="decorator decorator-size"   v-if="item === selectedItem" :style="{ zoom: 1 / zoomFactor }">X: {{ item.x }} &nbsp; Y: {{ item.y }} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h}} &nbsp;{{ item.r !== 0 ? ' R: ' + item.r + '°': '' }}</div>
                </div> <!-- item -->
                
                <Moveable  v-if = "targetDefined"
                        ref     = "moveable"
                        :target = "['.target']"                      
                        :zoom   = "1 / zoomFactor"
                        :origin = "false"  
                        
                        :throttleDrag   = "1"
                        :throttleResize = "1"
                        :throttleRotate = "shiftPressed ? 45 : 1"
                        :keepRatio      = "shiftPressed"

                        :snappable               = "true"
                        :snapGap                 = "false"
                        :snapDirections          = "{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
                        :elementSnapDirections   = "{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
                        :isDisplayInnerSnapDigit = "true"
                        :elementGuidelines       = "elementGuidelines()"
                        
                        :roundable = "selectedItem != null && !selectedItem.locked === true"                        
                        :draggable = "selectedItem != null && !selectedItem.locked === true"
                        :rotatable = "selectedItem != null && !selectedItem.locked === true"
                        :resizable = "selectedItem != null && !selectedItem.locked === true"

                        @drag      = "onDrag"
                        @resize    = "onResize"
                        @rotate    = "onRotate"
                        @round     = "onRound"
                        />
            </div> <!-- viewport -->
        </VueInfiniteViewer>
    </div> <!-- editor-container -->    
    
    <div class="toolbar">
        ZOOM: <button @click="zoomOut">-</button> {{ zoomFactor * 100 }}% <button @click="zoomIn">+</button>&nbsp;&nbsp;<button @click="zoomReset">Reset</button>
        <br/><br/>
        <button @click="emit('add-item')">Add New</button>
        &nbsp;
        <button @click="deleteItem" :disabled="!targetDefined">Delete</button>
        &nbsp;
        <button @click="changeItemColor" :disabled="!targetDefined || selectedItem?.locked === true">Change Color</button>
        <br/><br/>
        <button @click="sendToBack" :disabled="!targetDefined">Send to back</button>
        &nbsp;
        <button @click="bringToFront" :disabled="!targetDefined">Bring to front</button>
        <p>Press SHIFT key to keep aspect ratio while resizing</p>       
        <div v-if="targetDefined">
            <h3>Item Data</h3>
            <pre>{{ selectedItem }}</pre>
        </div> 
    </div>
</template>

<script setup lang="ts">

import { useKeyModifier } from '@vueuse/core';
import { computed, nextTick, onMounted, ref, StyleValue } from "vue";
import Guides from "vue-guides";
import { VueInfiniteViewer } from "vue3-infinite-viewer";
import Moveable from 'vue3-moveable';
import { Item, ItemUtils } from './ItemUtils';


// The component props
export interface DiagramEditorProps {
    items: Item[]
}

// The component events
export interface DiagramEditorEvents {
    (e: 'add-item'): void
    (e: 'delete-item', item: Item): void
}

const { items } = defineProps<DiagramEditorProps>();
const emit      = defineEmits<DiagramEditorEvents>();

onMounted(() => {
    console.log('DiagramEditor mounted')

    //@ts-ignore
    if(hGuides.value) hGuides.value!.resize();
    //@ts-ignore
    if(vGuides.value) vGuides.value!.resize();
});



const zooms            = [5, 10, 25, 50, 75, 100, 125, 150, 200, 300, 400, 500];        // must contain the value 100
const defaultZoomIndex = zooms.findIndex(v => v === 100);     
const zoom             = ref(defaultZoomIndex); 
const zoomFactor       = computed(() => zooms[zoom.value] / 100);
const guideUnits       = 50; // computed(() => zoomFactor.value < .5 ? 0 : 50);

const viewer         = ref();
const viewport       = ref()
const moveable       = ref();
const hGuides        = ref();
const vGuides        = ref();
const selectedItem   = ref<Item | null>(null);
const targetDefined  = computed(() => selectedItem.value !== null)

const shiftPressed = useKeyModifier('Shift')


function getItemStyle(item: Item) : StyleValue {
    let t = `translate(${item.x}px, ${item.y}px)`;
    if(item.r != 0) t += ` rotate(${item.r})`

    return {
        "width":            item.w + 'px',
        "height":           item.h + 'px',
        "zIndex":           item.z,
        "backgroundColor":  item.component ? "transparent" : item.background,
        "transform":        t        
    }
}

function selectItem(item: Item)  : void {
    // Item already selected
    if(item === selectedItem.value) return;
    
    console.log('selecting item', item);
    
    selectNone();
    nextTick(() => { selectedItem.value = item; })
}

function selectNone() : void {
    selectedItem.value = null;
}

function onDrag(e: any) : void {
    if(!selectedItem.value) return;

    //console.log('ondrag', item, e);
    selectedItem.value.x = Math.floor(e.beforeTranslate[0]);
    selectedItem.value.y = Math.floor(e.beforeTranslate[1]);

    e.target.style.transform = e.transform;    
}


function onResize(e: any) : void {
    if(!selectedItem.value) return;

    // console.log('onresize', item, e);
    selectedItem.value.w = Math.floor(e.width);
    selectedItem.value.h = Math.floor(e.height);

    e.target.style.width  = `${selectedItem.value.w}px`;
    e.target.style.height = `${selectedItem.value.h}px`;
}


function onRotate(e: any) : void {
    if(!selectedItem.value) return;

    // console.log('onrotate', item, e);    
    selectedItem.value.r = e.beforeRotate % 360;
    e.target.style.transform = e.drag.transform;
}

function onRound(e: any) : void {
    if(!selectedItem.value) return;

    //console.log('onRound', e);
    selectedItem.value.borderRadius = parseInt(e.borderRadius) || 0;
    e.target.style.borderRadius = e.borderRadius;
}


function onScroll(e: any) : void {
    if(e.ctrlKey) e.deltaY < 0 ? zoomIn() : zoomOut();

    //@ts-ignore
    if(hGuides.value) { hGuides.value.scroll(e.scrollLeft); hGuides.value.scrollGuides(e.scrollTop); }
    //@ts-ignore
    if(vGuides.value) { vGuides.value.scroll(e.scrollTop); vGuides.value.scrollGuides(e.scrollLeft); }
}


function sendToBack() : void {
    if(selectedItem.value) selectedItem.value.z = ItemUtils.findMinZ(items) - 1;
}

function bringToFront() : void {
    if(selectedItem.value) selectedItem.value.z = ItemUtils.findMaxZ(items) + 1;    
}

function changeItemColor() : void {
    if(selectedItem.value) selectedItem.value.background = `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`
}

function deleteItem(item: Item) {
    emit('delete-item', item);
    selectNone();
}

//@ts-ignore
function zoomReset() { zoom.value = defaultZoomIndex; viewer.value!.scrollCenter(); }
function zoomIn()    { if(zoom.value < zooms.length - 1) zoom.value++; }
function zoomOut()   { if(zoom.value > 0)                zoom.value--; }

function elementGuidelines() {   
    if(!viewport.value) return [];

    return Array.prototype.slice.call(viewport.value!.querySelectorAll(".item"), 0).filter(n => !n.classList.contains('target'))
}
</script>


<style scoped>


.editor-container {
    position: relative;
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;    
}

.toolbar {
    position: absolute;
    right: 20px;
    top: 110px;
    width: 260px;
    height: auto;
    border: 1px solid;
    padding: 8px;
    background-color: lightyellow;
    overflow: hidden;
}
.viewer {
    box-sizing: border-box;
    position: absolute;
    top: 30px;
    left: 30px;
    width: calc(100% - 30px);
    height: calc(100% - 30px);
    background-color: white;
    user-select: none;
}

.viewport {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
}


.item {
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    left: 0px;
    text-align: center;
    font-weight: normal;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center; 
    border-radius: 1px;
    user-select: none;
}

.item.target {
    font-weight: bold;
}

.item.locked {
    
}


.item .decorator {
    position: absolute;
    border: 1px solid #4af;
    border-radius: 4px;
    background-color: #4af;
    color: white;
    text-align: center;
    font-weight: normal;
    line-height: 1;
}

.item .decorator-delete {
    top: 0px;
    right: -32px;
    width: 24px;
    height: 24px;
    font-size: 24px;
    cursor: pointer;
}

.item .decorator-locked {
    top: 32px;
    right: -30px;
    width: auto;
    height: auto;
    font-size: 16px;
    background: transparent;
    border: 0px;
    border-radius: 0px;
}

.item .decorator-size {
    position: absolute;
    bottom: -30px;
    left: 0px;
    width: auto;
    height: auto;
    font-size: 14px;
    padding: 4px 8px;
    white-space: nowrap;
}
</style>

