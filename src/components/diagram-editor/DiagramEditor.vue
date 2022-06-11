<template>
    <div class="editor-container">
        <Guides type="horizontal" ref="hGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :rulerStyle = "{ left: '30px', width: 'calc(100% - 30px)', height: '30px' }"/>
        <Guides type="vertical"   ref="vGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :style="{ position: 'absolute', top: '0px'}" :rulerStyle = "{ top: '30px',  height: 'calc(100% - 30px)', width: '30px' }"/>
        
        <VueInfiniteViewer ref="viewer" class="viewer" :useWheelScroll="true" :zoom="zoomFactor" @wheel="onScroll" @scroll="onScroll">
            <div id="editor-viewport" class="viewport" @click="selectNone()">
                <div v-for="(item, i) in items" :key="item.id" 
                                                :data-item-id="item.id"
                                                :class="{ 'item' : true, 'target': item.id == currentTarget }" 
                                                :style="getItemStyle(item)" 
                                                @click.stop="selectItem($event, item)">                
                        <component v-if="item.component" :is="item.component" :item="item" />
                        <div v-else>{{ item.title }}</div>

                        <div class="decorator decorator-delete" v-if="item.id == currentTarget" :style="{ zoom: 1 / zoomFactor }" @click.stop="deleteItem" title="delete item">&times;</div>
                        <div class="decorator decorator-size"   v-if="item.id == currentTarget" :style="{ zoom: 1 / zoomFactor }">X: {{ item.x }} &nbsp; Y: {{ item.y}} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h}} &nbsp;{{ item.r !== 0 ? ' R: ' + item.r + '°': '' }}</div>
                </div>
                <Moveable v-if="targetDefined"
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
                        
                        :roundable = "true"
                        :draggable = "true"
                        :rotatable = "true"
                        :resizable = "true"

                        @drag   = "onDrag"
                        @resize = "onResize"
                        @rotate = "onRotate" />
            </div> <!-- viewport -->
        </VueInfiniteViewer>
    </div> <!-- editor-container -->    
    <div class="toolbar">
        ZOOM: <button @click="zoomOut">-</button> {{ zoomFactor * 100 }}% <button @click="zoomIn">+</button>&nbsp;&nbsp;<button @click="zoomReset">Reset</button>
        <br/><br/>
        <button @click="addNewItem">Add New</button>
        &nbsp;
        <button @click="deleteItem" :disabled="!targetDefined">Delete</button>
        &nbsp;
        <button @click="changeItemColor" :disabled="!targetDefined">Change Color</button>
        <br/><br/>
        <button @click="sendToBack" :disabled="!targetDefined">Send to back</button>
        &nbsp;
        <button @click="bringToFront" :disabled="!targetDefined">Bring to front</button>
        <p>Press SHIFT key to keep aspect ratio while resizing</p>       
        <div v-if="targetDefined">
            <h3>Item Data</h3>
            <pre>{{ findCurrentItem() }}</pre>
        </div> 
    </div>

</template>

<script setup lang="ts">

import { useKeyModifier } from '@vueuse/core';
import { computed, nextTick, onMounted, reactive, ref, StyleValue } from "vue";
import Guides from "vue-guides";
import { VueInfiniteViewer } from "vue3-infinite-viewer";
import Moveable from 'vue3-moveable';

onMounted(() => {
    //@ts-ignore
    if(hGuides.value) hGuides.value!.resize();
    //@ts-ignore
    if(vGuides.value) vGuides.value!.resize();
});

interface Item {
    id: string;
    title: string;
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    r: number;

    background: string;

    component?:        string;
    componentOptions?: any;
}

const zooms            = [5, 10, 25, 50, 75, 100, 125, 150, 200, 300, 400, 500];        // must contain the value 100
const defaultZoomIndex = zooms.findIndex(v => v === 100);     
const zoom             = ref(defaultZoomIndex); 
const zoomFactor       = computed(() => zooms[zoom.value] / 100);
const guideUnits       = 50; // computed(() => zoomFactor.value < .5 ? 0 : 50);




const viewer        = ref(null);
const moveable      = ref(null);
const hGuides       = ref(null);
const vGuides       = ref(null);
const currentTarget = ref("");
const targetDefined = computed(() => currentTarget.value !== '');

const shiftPressed = useKeyModifier('Shift')

let counter = 0;
let items   = reactive([
    createItem('Item A'),
    createItem('Item B'),
    createItem('Item C', "CustomShape"),
    createItem('Item D', "Ellipse"),
    createItem('Item E', "Image", { src : "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" } ),

]);


function createItem(title : string, component?: string, componentOptions?: any) : Item {
    return {
        id: "ID" + (++counter),
        title,
        x: Math.floor(Math.random() * 400),
        y: Math.floor(Math.random() * 200),
        z: 0,
        w: 100 + Math.floor(Math.random() * 400),
        h: 50  + Math.floor(Math.random() * 200),
        r: 0,
        background: `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`,
        component,
        componentOptions
    }
}

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


function findItem(el: HTMLElement) : Item | undefined {
    const id = el.dataset.itemId;
    return items.find(v => v.id == id);
}


function findCurrentItem() : Item | undefined {
    if(currentTarget.value === '') return undefined;
    return items.find(v => v.id == currentTarget.value);
}


function selectItem(e: any, item: Item)  : void {
    console.log('selecting item', item);
    
    currentTarget.value = '';

    let target = e.target;
    nextTick(() => { currentTarget.value = item.id; })
}

function selectNone() : void
{
    currentTarget.value = ''
}

function onDrag(e: any) : void {
    const item = findItem(e.target);
    if(!item) return;

    //console.log('ondrag', item, e);
    item.x = Math.floor(e.beforeTranslate[0]);
    item.y = Math.floor(e.beforeTranslate[1]);

    e.target.style.transform = e.transform;    
}

function onResize(e: any) : void {
    const item = findItem(e.target);
    if(!item) return;

    // console.log('onresize', item, e);
    item.w = Math.floor(e.width);
    item.h = Math.floor(e.height);

    e.target.style.width  = `${item.w}px`;
    e.target.style.height = `${item.h}px`;
}

function onRotate(e: any) : void {
    const item = findItem(e.target);
    if(!item) return;

    // console.log('onrotate', item, e);
    item.r = e.beforeRotate;
    e.target.style.transform = e.drag.transform;
}


function onScroll(e: any) : void {
    if(e.ctrlKey) e.deltaY < 0 ? zoomIn() : zoomOut();

    //@ts-ignore
    if(hGuides.value) { hGuides.value.scroll(e.scrollLeft); hGuides.value.scrollGuides(e.scrollTop); }
    //@ts-ignore
    if(vGuides.value) { vGuides.value.scroll(e.scrollTop); vGuides.value.scrollGuides(e.scrollLeft); }
}

function findMinZ(): number {
    let min = items[0].z;
    for(let v of items) if(v.z < min) min = v.z;
    return min;
}

function findMaxZ(): number {
    let max = items[0].z;
    for(let v of items) if(v.z > max) max = v.z;
    return max;
}


function sendToBack() : void {
    const item = findCurrentItem();
    if(item) item.z = findMinZ() - 1;
}


function bringToFront() : void {
    const item = findCurrentItem();
    if(item) item.z = findMaxZ() + 1;    
}

function changeItemColor() : void {
    const item = findCurrentItem();
    if(item) item.background = `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`
}

function addNewItem() {
    items.push(createItem('New Item'));
}

function deleteItem() {
    const item = findCurrentItem();
    if(!item) return;
    
    items.splice(items.indexOf(item), 1)
    selectNone();
}

//@ts-ignore
function zoomReset() { zoom.value = defaultZoomIndex; viewer.value!.scrollCenter();}
function zoomIn()    { if(zoom.value < zooms.length - 1) zoom.value++; }
function zoomOut()   { if(zoom.value > 0)                zoom.value--; }

function elementGuidelines() {    
    return Array.prototype.slice.call(document.querySelectorAll("#editor-viewport .item"), 0).filter(n => !n.classList.contains('target'))
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
    /* border: 1px solid #333; */
    font-weight: normal;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center; 
}

.item.target {
    font-weight: bold;
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

