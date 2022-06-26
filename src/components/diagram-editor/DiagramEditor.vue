<template>
    <div class="editor-container">

        <!-- Rulers -->
        <Guides v-show='guidesVisible' type="horizontal" ref="hGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :rulerStyle = "{ left: '30px', width: 'calc(100% - 30px)', height: '30px' }" :style = "{ position: 'absolute', top: '0px'}" />
        <Guides v-show='guidesVisible' type="vertical"   ref="vGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :rulerStyle = "{ top: '30px',  height: 'calc(100% - 30px)', width: '30px' }" :style = "{ position: 'absolute', top: '0px'}" />
        <div    v-show='guidesVisible' class="rulers-left-top-box" ></div>

        <!-- Editor Canvas -->
        <VueInfiniteViewer ref="viewer" class="viewer" :useWheelScroll="true" :zoom="zoomFactor"  @wheel="onScroll" @scroll="onScroll"  @click="editable && onViewportClick($event)" :style="{ cursor: currentTool == EditorTool.SELECT ? 'auto' : 'crosshair'}" @keypress="onKeyDown">
            <div ref="viewport" class="viewport" >
                <!-- Render Connections -->
                <component v-for="(c, i) in connections" 
                        :is       = "c.component" 
                        :key      = "c.id" 
                        :from     = "getItemById(c.from)" 
                        :to       = "getItemById(c.to)"
                        :style    = "{ zIndex: c.z }"
                        :options  = "c" 
                        :selected = "c.id === selectedItem?.id"
                        @selected = "selectedItem = c"/>
                        
                <!-- Render Items -->
                <div v-for="(item, i) in items" 
                        class          = "item"
                        :key           = "item.id" 
                        :data-item-id  = "item.id"
                        :class         = "{ 'target': item.id === selectedItem?.id, 'locked': item.locked === true }" 
                        :style         = "getItemStyle(item)"
                        @click.stop    = "editable && selectItem(item)" 
                        @dblclick.stop = "editable && lockItem(item)"> 

                        <component :is="item.component" :item="item" />

                        <div class="decorator decorator-delete" v-if="editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }" @click.stop="deleteItem" title="delete item">&times;</div>
                        <div class="decorator decorator-locked" v-if="editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }" v-show="item.locked === true" title="locked">&#x1F512;</div>
                        <div class="decorator decorator-size"   v-if="editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }">X: {{ item.x }} &nbsp; Y: {{ item.y }} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h}} &nbsp;{{ item.r !== 0 ? ' R: ' + item.r + '°': '' }}</div>
                </div> <!-- item -->
                
                <!-- Manage drag / resize / rotate / rounding of selected item -->
                <Moveable v-if = "editable === true && targetDefined && isItem(selectedItem)"
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
                        
                        :roundable = "selectedItemActive && selectedItem?.supportsRoundable === true"
                        :draggable = "selectedItemActive"
                        :rotatable = "selectedItemActive"
                        :resizable = "selectedItemActive && selectedItem?.supportsResizable === true"

                        @dragStart   = "onDragStart"
                        @drag        = "onDrag"
                        @dragEnd     = "onDragEnd"

                        @resizeStart = "onResizeStart"
                        @resize      = "onResize"
                        @resizeEnd   = "onResizeEnd"
                        
                        @rotateStart = "onRotateStart"
                        @rotate      = "onRotate"
                        @rotateEnd   = "onRotateEnd"

                        @roundStart  = "onRoundStart"
                        @round       = "onRound"
                        @roundEnd    = "onRoundEnd" />
            </div> <!-- viewport -->
        </VueInfiniteViewer>

        <!-- Editor Toolbar -->
        <Toolbar v-if='editable' 
                :supportsCustomWidgets="true"
                :selectedTool="currentTool" 
                @toolSelected="selectCurrentTool"/>

        <!-- Editor Info Panel -->
        <div v-if='editable' class="info-panel">
            ZOOM: <button @click="zoomOut">-</button> {{ zoomFactor * 100 }}% 
                <button @click="zoomIn">+</button>&nbsp;&nbsp;
                <button @click="zoomReset">Reset</button>
            <br/><br/>
            <!-- <button @click="emit('add-item')">Add New</button> 
            &nbsp;-->
            <button @click="deleteItem"      :disabled="!selectedItemActive">Delete</button>&nbsp;
            <button @click="changeBackColor" :disabled="!selectedItemActive">Change Color</button><br/><br/>
            <button @click="sendToBack"      :disabled="!selectedItemActive">Send to back</button>&nbsp;
            <button @click="bringToFront"    :disabled="!selectedItemActive">Bring to front</button><br/><br/>
            <button @click="undo"            :disabled="!historyManager.canUndo()">Undo</button>&nbsp;
            <button @click="redo"            :disabled="!historyManager.canRedo()">Redo</button>
            
            <pre>TOOL: {{ getToolDefinition(currentTool) }}</pre>
            
            <div v-if="targetDefined">
                <p>Press SHIFT key to keep aspect ratio while resizing</p>
                <h3>Selected Item</h3>
                <pre>{{ selectedItem }}</pre>            
            </div> 
        </div> <!-- info-panel -->
        
    </div> <!-- editor-container -->    
</template>

<script setup lang="ts">

import { useKeyModifier } from '@vueuse/core';
import { computed, nextTick, onMounted, onUpdated, ref, StyleValue } from "vue";
import Guides from "vue-guides";
import { VueInfiniteViewer } from "vue3-infinite-viewer";
import Moveable from 'vue3-moveable';
import ChangeBackgroundColorCommand from './commands/ChangeBackgroundColorCommand';
import ChangeZOrderCommand from './commands/ChangeZOrderCommand';
import HistoryManager from './commands/HistoryManager';
import { LockCommand, UnlockCommand } from './commands/LockCommand';
import MoveCommand from './commands/MoveCommand';
import ResizeCommand from './commands/ResizeCommand';
import RotateCommand from './commands/RotateCommand';
import RoundCommand from './commands/RoundCommand';
import { createItem, findMaxZ, findMinZ } from './helpers';

import Toolbar from './Toolbar.vue';
import { DiagramElement, EditorTool, getToolDefinition, isConnection, isItem, Item, ItemConnection } from './types';

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface DiagramEditorProps {
    elements: DiagramElement[],
    editable?: boolean,
}

export interface DiagramEditorEvents {
    (e: 'add-item', item: Item): void
    (e: 'delete-item', item: Item, historyManager: HistoryManager): void
    
    (e: 'add-connection',    connection: ItemConnection): void
    (e: 'delete-connection', connection: ItemConnection): void
}

// Define props
const { elements, editable } = withDefaults(defineProps<DiagramEditorProps>(), {
    editable: true,
});

// Define events
const emit = defineEmits<DiagramEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

onMounted(() => {
    console.log('DiagramEditor mounted')

    //@ts-ignore
    if(hGuides.value) hGuides.value.resize();
    //@ts-ignore
    if(vGuides.value) vGuides.value.resize();
});

onUpdated(() => {
    //console.log('DiagramEditor updated')
})


// The component state
// ------------------------------------------------------------------------------------------------------------------------
const zooms              = [5, 10, 25, 50, 75, 100, 125, 150, 200, 300, 400, 500];        // must contain the value 100
const defaultZoomIndex   = zooms.findIndex(v => v === 100);     
const zoom               = ref(defaultZoomIndex); 
const zoomFactor         = computed(() => zooms[zoom.value] / 100);
const guideUnits         = 50; // computed(() => zoomFactor.value < .5 ? 0 : 50);

const viewer             = ref();
const viewport           = ref()
const canvas             = ref<SVGElement>()
const moveable           = ref();

const hGuides            = ref();
const vGuides            = ref();
const guidesVisible      = computed(() => editable && zoomFactor.value >= 0.5);

const selectedItem       = ref<DiagramElement | null>(null);
const targetDefined      = computed(() => selectedItem.value !== null)

const selectedItemActive = computed(() => {
    if(!selectedItem.value) return false;

    // An item is 'active' if not locked, a connection is always 'active'
    return isItem(selectedItem.value) ? (!selectedItem.value.locked === true) : true;
})

const shiftPressed       = useKeyModifier('Shift')
const historyManager     = ref(new HistoryManager());
const currentTool        = ref(EditorTool.SELECT);


const items       = computed(() => elements.filter(e => isItem(e)) as Item[]);
const connections = computed(() => elements.filter(e => isConnection(e)) as ItemConnection[]);

// Temporary variables
// ------------------------------------------------------------------------------------------------------------------------
let originPos:   [number, number] = [0, 0];
let originSize:  [number, number] = [0, 0];
let originAngle: number = 0;
let originRound: number = 0;

const mouseCoords = ref<[number, number]>([0, 0]);


function getItemStyle(item: Item) : StyleValue {
    let t = `translate(${item.x}px, ${item.y}px)`;
    if(item.r !== 0) t += ` rotate(${item.r}deg)`

    const style: StyleValue = {
        "width":            item.w + 'px',
        "height":           item.h + 'px',
        "zIndex":           item.z,
        "backgroundColor":  item.component ? "transparent" : item.backgroundColor,
        "transform":        t        
    }

    if(item.supportsRoundable === true) style.borderRadius = Math.max(1, item.borderRadius) + 'px';

    return style;
}

function selectItem(item: Item)  : void {
    // Item already selected
    if(item === selectedItem.value) return;
    
    console.log('selecting item', item);
    
    selectNone();
    nextTick(() => { selectedItem.value = item; })
}

function selectNone() : void {
    console.log('selectNone()');
    selectedItem.value = null;
}


// ---------------------------------------------------------------------------------------------------------------------
// Drag item
// ---------------------------------------------------------------------------------------------------------------------
function onDragStart(e: any) : void {
    if(isItem(selectedItem.value)) originPos = [selectedItem.value.x, selectedItem.value.y];
}

function onDrag(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    // console.log('ondrag', e);
    selectedItem.value.x = Math.floor(e.beforeTranslate[0]);
    selectedItem.value.y = Math.floor(e.beforeTranslate[1]);
    e.target.style.transform = e.transform;  
}

function onDragEnd(e: any) : void {
    if(isItem(selectedItem.value)) historyManager.value.execute(new MoveCommand(selectedItem.value, originPos, [selectedItem.value.x, selectedItem.value.y]));
}


// ---------------------------------------------------------------------------------------------------------------------
// Resize item
// ---------------------------------------------------------------------------------------------------------------------
function onResizeStart(e: any) : void {
    if(isItem(selectedItem.value)) originSize = [selectedItem.value.w, selectedItem.value.h];
}

function onResize(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    // console.log('onresize', e);
    selectedItem.value.w = Math.floor(e.width);
    selectedItem.value.h = Math.floor(e.height);

    e.target.style.width  = `${Math.floor(e.width)}px`;
    e.target.style.height = `${Math.floor(e.height)}px`;
}

function onResizeEnd(e: any) : void {
    if(isItem(selectedItem.value)) historyManager.value.execute(new ResizeCommand(selectedItem.value, originSize, [selectedItem.value.w, selectedItem.value.h]));
}


// ---------------------------------------------------------------------------------------------------------------------
// Rotate item
// ---------------------------------------------------------------------------------------------------------------------
function onRotateStart(e: any) : void {
    if(isItem(selectedItem.value)) originAngle = selectedItem.value.r;
}

function onRotate(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    // console.log('onrotate', item, e);    
    selectedItem.value.r = e.beforeRotate % 360;
    e.target.style.transform = e.drag.transform;
}

function onRotateEnd(e: any) : void {
    if(isItem(selectedItem.value)) historyManager.value.execute(new RotateCommand(selectedItem.value, originAngle, selectedItem.value.r));
}


// ---------------------------------------------------------------------------------------------------------------------
// Round item
// ---------------------------------------------------------------------------------------------------------------------
function onRoundStart(e: any) : void {
    if(isItem(selectedItem.value)) originRound = selectedItem.value.borderRadius;
}

function onRound(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    //console.log('onRound', e);
    selectedItem.value.borderRadius = parseInt(e.borderRadius) || 0;
    e.target.style.borderRadius = e.borderRadius;
}

function onRoundEnd(e: any) : void {
    if(isItem(selectedItem.value)) historyManager.value.execute(new RoundCommand(selectedItem.value, originRound, selectedItem.value.borderRadius));        
}




// ---------------------------------------------------------------------------------------------------------------------
// Scrolling
// ---------------------------------------------------------------------------------------------------------------------
function onScroll(e: any) : void {
    if(e.ctrlKey) e.deltaY < 0 ? zoomIn() : zoomOut();

    //@ts-ignore
    if(hGuides.value) { hGuides.value.scroll(e.scrollLeft); hGuides.value.scrollGuides(e.scrollTop); }
    //@ts-ignore
    if(vGuides.value) { vGuides.value.scroll(e.scrollTop); vGuides.value.scrollGuides(e.scrollLeft); }


    if(!canvas.value) return;
    console.log('onscroll', e);
    canvas.value.style.transform = `translate(${e.scrollLeft}px, ${e.scrollTop}px)`;
    //canvas.value.scrollTo(e.scrollLeft, e.scrollTop);

}


function sendToBack() : void {
    if(selectedItem.value) historyManager.value.execute(new ChangeZOrderCommand(selectedItem.value, selectedItem.value.z, findMinZ(items.value as Item[]) - 1));    
}

function bringToFront() : void {
    if(selectedItem.value) historyManager.value.execute(new ChangeZOrderCommand(selectedItem.value, selectedItem.value.z, findMaxZ(items.value as Item[]) + 1));    
}

function changeBackColor() : void {
    if(isItem(selectedItem.value)) {
        const oldColor = selectedItem.value.backgroundColor;
        const newColor = `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`;
        historyManager.value.execute(new ChangeBackgroundColorCommand(selectedItem.value, oldColor, newColor));
    }
    else if(isConnection(selectedItem.value)) {
        const oldColor = selectedItem.value.color;
        const newColor = `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`;
        historyManager.value.execute(new ChangeBackgroundColorCommand(selectedItem.value, oldColor, newColor));
    }
}

function deleteItem() {
    if(isItem(selectedItem.value)) {
        emit('delete-item', selectedItem.value, historyManager.value as HistoryManager);
        selectNone();
    }

    if(isConnection(selectedItem.value)) {
        emit('delete-connection', selectedItem.value);
        selectNone();
    }
}

function lockItem(item: Item) {
    historyManager.value.execute(item.locked === true ? new UnlockCommand(item) : new LockCommand(item));
}

//@ts-ignore
function zoomReset() { zoom.value = defaultZoomIndex; viewer.value!.scrollCenter(); }
function zoomIn()    { if(zoom.value < zooms.length - 1) zoom.value++; }
function zoomOut()   { if(zoom.value > 0)                zoom.value--; }

function elementGuidelines() {   
    if(!viewport.value) return [];

    return Array.prototype.slice.call(viewport.value!.querySelectorAll(".item"), 0).filter(n => !n.classList.contains('target'))
}

function getItemById(id: string) : Item | undefined {
    return (items.value as Item[]).find(n => n.id == id);
}

function undo() {  
    historyManager.value?.undo(); 
    nextTick(() => moveable.value?.updateTarget());
}

function redo() {  
    historyManager.value?.redo(); 
    nextTick(() => moveable.value?.updateTarget());
}


function selectCurrentTool(tool: EditorTool) : void {
    console.log('selectCurrentTool', tool);
    
    currentTool.value = tool;
    selectNone();
}

function onViewportClick(e: any): void {
    console.log('onViewportClick', e);
    
    if(currentTool.value == EditorTool.SELECT) {
        selectNone();
        return;
    }

    // Clicking the viewport in NON-selection mode ==> Add a new element
    if(currentTool.value == EditorTool.RECTANGLE) {
        const x = viewer.value!.getScrollLeft();
        const y = viewer.value!.getScrollTop();


        console.log('onViewportClick', x, y, viewer.value);
        
        
        const item = createItem({
            x,
            y,
            w: 200,
            h: 100,
            component: "Shape",
            backgroundColor: "yellow",
        });
        console.log('creating item', item);

        emit('add-item', item);        
    }
}


function onKeyDown(e: any) {
    console.log('onKeyDown', e);
}
</script>


<style scoped>


.editor-container {
    position: relative;
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;    
    background-color: white;

}

.info-panel {
    position: absolute;
    top: 40px;
    right: 20px;
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

.rulers-left-top-box {
    position: absolute; 
    top: 0px; 
    left: 0px; 
    width: 30px; 
    height: 30px; 
    background-color: #333;
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
    border-radius: 0px;
    user-select: none;
    cursor: pointer;
}

.item.target {
    cursor: pointer;
}

.item.target.locked {
    border: 3px dotted red;
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

