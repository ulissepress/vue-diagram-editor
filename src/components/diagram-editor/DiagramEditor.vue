<template>
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
    <br/><br/>
    <h3>Items Data</h3>
    <pre>{{ items }} </pre>

    <vue-infinite-viewer ref="viewer" class="viewer" :useWheelScroll="true" :zoom="zoomFactor" @wheel="onScroll">
        <div class="viewport" @click="selectNone()">
            <div v-for="(item, i) in items" :key="item.id" 
                                            :data-item-id="item.id"
                                            :class="{ 'item' : true, 'target': item.id == currentTarget }" 
                                            :style="getItemStyle(item)" 
                                            @click.stop="selectItem($event, item)">                
                    <component v-if="item.component" :is="item.component" :item="item" />
                    <div v-else>{{ item.title }}</div>

                    <div class="decorator decorator-delete" v-if="item.id == currentTarget" :style="{ zoom: 1/zoomFactor }" @click.stop="deleteItem" title="delete item">&times;</div>
                    <div class="decorator decorator-size"   v-if="item.id == currentTarget" :style="{ zoom: 1/zoomFactor }">X: {{ item.x }} &nbsp; Y: {{ item.y}} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h}}</div>
            </div>
            <Moveable v-if="targetDefined"
                      ref     = "moveable"
                      :target = "['.target']"                      
                      :zoom   = "1 / zoomFactor"
                      :origin = "false"  
                      
                      :throttleRotate = "1"
                      :throttleResize = "1"
                      
                      :roundable = "true"
                      :draggable = "true"
                      :rotatable = "true"
                      :resizable = "true"

                      @drag   = "onDrag"
                      @resize = "onResize"
                      @rotate = "onRotate" />
        </div>
    </vue-infinite-viewer>
</template>

<script setup lang="ts">

import { computed, nextTick, reactive, ref, StyleValue } from "vue";
import { VueInfiniteViewer } from "vue3-infinite-viewer";
import Moveable from 'vue3-moveable';


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

    component?: string;
}

const defaultZoomIndex = 4;     // 100%
const zooms = [10, 25, 50, 75, 100, 125, 150, 200, 300, 400];

let viewer        = ref(null);
let moveable      = ref(null);
let zoom          = ref(4);     // Current zoom index
let currentTarget = ref("");
let targetDefined = computed(() => currentTarget.value !== '');
let zoomFactor    = computed(() => zooms[zoom.value] / 100);


let counter = 0;
let items   = reactive([
    createItem('Item A'),
    createItem('Item B'),
    createItem('Item C', "CustomShape"),    
    createItem('Item D', "Ellipse")
]);


function createItem(title : string, component?: string) : Item {
    return {
        id: "ID" + (++counter),
        title,
        x: Math.floor(Math.random() * 400),
        y: Math.floor(Math.random() * 200),
        z: 0,
        w: 100 + Math.floor(Math.random() * 400),
        h: 50 + Math.floor(Math.random() * 200),
        r: 0,
        background: `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`,
        component
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
    item.x = e.beforeTranslate[0];
    item.y = e.beforeTranslate[1];

    e.target.style.transform = e.transform;    
}

function onResize(e: any) : void {
    const item = findItem(e.target);
    if(!item) return;

    // console.log('onresize', item, e);
    item.w = e.width;
    item.h = e.height;

    e.target.style.width  = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
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

function zoomIn()    { if(zoom.value < zooms.length - 1) zoom.value++; }
function zoomOut()   { if(zoom.value > 0) zoom.value--; }
function zoomReset() { zoom.value = defaultZoomIndex; }

</script>


<style scoped>
.viewer {
  box-sizing: border-box;
  position: absolute;
  top: 70px;
  right: 20px;
  
  border: 1px solid grey;
  width: 80%;
  height: 80%;
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
}

.item .decorator-delete {
    top: 0px;
    right: -32px;
    width: 24px;
    height: 24px;
    font-size: 20px;
    cursor: pointer;
}

.item .decorator-size {
    position: absolute;
    bottom: -30px;
    left: 0px;
    width: auto;
    height: auto;
    font-size: 14px;
    padding: 2px 4px;
    white-space: nowrap;
}
</style>

