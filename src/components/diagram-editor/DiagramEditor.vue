<template>
    <div class="editor-container">

        <!-- Rulers -->
        <Guides v-show='guidesVisible' class="ruler ruler-horizontal" @changeGuides="hGuideValues = $event.guides" type="horizontal" ref="hGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :rulerStyle = "{ left: '30px', width: 'calc(100% - 30px)',  height: '30px' }" :style="{ 'width': 'calc(100% - 30px)', height: '30px' }" />
        <Guides v-show='guidesVisible' class="ruler ruler-vertical"   @changeGuides="vGuideValues = $event.guides" type="vertical"   ref="vGuides" :zoom="zoomFactor" :snapThreshold="5" :units="guideUnits" :rulerStyle = "{ top: '30px',  height: 'calc(100% - 30px)', width:  '30px' }" :style="{ 'height': 'calc(100% - 30px)', width: '30px',top: '-30px' }" />
        <div    v-show='guidesVisible' class="rulers-left-top-box" ></div>

        <!-- Editor Canvas -->
        <VueInfiniteViewer 
            ref             = "viewer" 
            class           = "viewer" 
            :useWheelScroll = "true" 
            :zoom           = "zoomFactor"  
            :style          = "{ cursor: currentTool == EditorTool.SELECT ? 'auto' : 'crosshair'}" 
            @wheel          = "onScroll" 
            @scroll         = "onScroll"              
            @mousemove      = "onMouseMove"
            @click.stop     = "editable && onCanvasClick($event)">
            
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
                        @selected = "selectedItem = c" />
                        
                <!-- Use to render a line during a new connection creation -->
                <RawConnection v-if="creatingConnection && connectionInfo.startItem" 
                                :x1   = "getHandlePosition(connectionInfo.startItem, connectionInfo.startPoint).x" 
                                :y1   = "getHandlePosition(connectionInfo.startItem, connectionInfo.startPoint).y" 
                                :x2   = "mouseCoords.x" 
                                :y2   = "mouseCoords.y"
                                selected />
                            
                <!-- Render Items -->
                <div v-for="(item, i) in items"                 
                    class          = "item"
                    :key           = "item.id" 
                    :data-item-id  = "item.id"
                    :class         = "{ 'target': item.id === selectedItem?.id, 'locked': item.locked === true, 'mouse-hover': item.hover }" 
                    :style         = "getItemStyle(item)"
                    @click.stop    = "editable && selectItem(item)" 
                    @dblclick.stop = "editable && lockItem(item)"
                    
                    @mouseover  = "() => { if(creatingConnection) item.hover = true }"
                    @mouseleave = "() => { delete item.hover }" > 

                        <component :is="item.component" :item="item" />

                        <div class="decorator decorator-delete" v-if="!creatingConnection && editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }" @click.stop="deleteItem" title="delete item">&times;</div>
                        <div class="decorator decorator-locked" v-if="!creatingConnection && editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }" v-show="item.locked === true" title="locked">&#x1F512;</div>
                        <div class="decorator decorator-size"   v-if="!creatingConnection && editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }">X: {{ item.x }} &nbsp; Y: {{ item.y }} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h}} &nbsp;{{ item.r !== 0 ? ' R: ' + item.r + '°': '' }}</div>

                        <!-- Connection Handles - When the item is rotated, only the center handle is active -->
                        <div class="connection-handle connection-handle-left"   v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionPoint.LEFT)"></div>
                        <div class="connection-handle connection-handle-right"  v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionPoint.RIGHT)"></div>
                        <div class="connection-handle connection-handle-top"    v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionPoint.TOP)"></div>
                        <div class="connection-handle connection-handle-bottom" v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionPoint.BOTTOM)"></div>
                        <div class="connection-handle connection-handle-center" v-if="editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionPoint.CENTER)"></div>

                </div> <!-- item -->
                
                <!-- Manage drag / resize / rotate / rounding of selected item -->
                <Moveable v-if = "editable === true && targetDefined && isItem(selectedItem) && !creatingConnection"
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
                        :horizontalGuidelines    = "hGuideValues"
                        :verticalGuidelines      = "vGuideValues"
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
            <button @click="deleteItem"      :disabled="!selectedItemActive">Delete</button>&nbsp;
            <button @click="changeBackColor" :disabled="!selectedItemActive">Change Color</button><br/><br/>
            <button @click="sendToBack"      :disabled="!selectedItemActive">Send to back</button>&nbsp;
            <button @click="bringToFront"    :disabled="!selectedItemActive">Bring to front</button><br/><br/>
            <button @click="undo"            :disabled="!historyManager.canUndo()">Undo</button>&nbsp;
            <button @click="redo"            :disabled="!historyManager.canRedo()">Redo</button>
            
            <pre>TOOL: {{ getToolDefinition(currentTool) }}</pre>
            <pre>MOUSE: {{ mouseCoords }} </pre>
            
            <div v-if="targetDefined">
                <p>Press SHIFT key to keep aspect ratio while resizing</p>
                <h3>Selected Item</h3>
                <pre>{{ selectedItem }}</pre>            
            </div> 
        </div> <!-- info-panel -->
        
    </div> <!-- editor-container -->    
</template>

<script setup lang="ts">

import { useKeyModifier, useMouse } from '@vueuse/core';
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
import { createConnection, findMaxZ, findMinZ, getHandlePosition, getItemBlueprint, getUniqueId, randomInt, registerDefaultItemTypes } from './helpers';

import RawConnection from './blocks/RawConnection.vue';
import AddItemCommand from './commands/AddItemCommand';
import Toolbar from './Toolbar.vue';
import { ConnectionPoint, DiagramElement, EditorTool, Frame, getToolDefinition, isConnection, isItem, Item as _Item, ItemConnection, Position } from './types';

export type Item = _Item & { hover?: boolean }

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface DiagramEditorProps {
    elements: DiagramElement[],
    editable?: boolean,
}

export interface DiagramEditorEvents {
    (e: 'add-item',    item: Item, historyManager: HistoryManager): void
    (e: 'delete-item', item: Item, historyManager: HistoryManager): void
    
    (e: 'add-connection',    connection: ItemConnection, historyManager: HistoryManager): void
    (e: 'delete-connection', connection: ItemConnection, historyManager: HistoryManager): void
}

// Define props
const { elements, editable } = withDefaults(defineProps<DiagramEditorProps>(), {
    editable: true,
});

// Define events
const emit = defineEmits<DiagramEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

onMounted(() => {
    console.log('DiagramEditor onMounted')
    
    registerDefaultItemTypes();

    // Initialize rulers and infinite viewer
    hGuides.value.resize();    
    vGuides.value.resize();
    
    viewer.value.scrollCenter();
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
const moveable           = ref();

const hGuides            = ref();
const vGuides            = ref();
const guidesVisible      = computed(() => editable && zoomFactor.value >= 0.5);
const hGuideValues       = ref<number[]>([]);       // Horizontal guides added by the user
const vGuideValues       = ref<number[]>([]);       // Vertical guides added by the user

const selectedItem       = ref<DiagramElement | null>(null);
const targetDefined      = computed(() => selectedItem.value !== null)

const selectedItemActive = computed(() => {
    if(!selectedItem.value) return false;

    // An item is 'active' if not locked, a connection is always 'active'
    return isItem(selectedItem.value) ? (!selectedItem.value.locked === true) : true;
})

const mouseXY = useMouse();

const shiftPressed       = useKeyModifier('Shift')
const historyManager     = ref(new HistoryManager());
const currentTool        = ref(EditorTool.SELECT);

const creatingConnection = computed<boolean>(() => currentTool.value === EditorTool.CONNECTION);

const items       = computed(() => elements.filter(e => isItem(e)) as Item[]);
const connections = computed(() => elements.filter(e => isConnection(e)) as ItemConnection[]);

// Temporary variables
// ------------------------------------------------------------------------------------------------------------------------
const origin: Frame = { x: 0, y: 0, w: 0, h: 0, z: 0, r: 0, borderRadius: 0};

const mouseCoords = ref<Position>({ x: 0, y: 0 });
function onMouseMove(e: any) { 
     if(!viewport.value) return;
    
    //console.log('onMouseMove', e.srcElement, e.offsetX, e.offsetY, e);

    const rect = viewport.value.getBoundingClientRect();

    // Mouse position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseCoords.value.x = Math.floor(x / zoomFactor.value);
    mouseCoords.value.y = Math.floor(y / zoomFactor.value);
}

let connectionInfo : { 
    startItem:  Item | null, 
    endItem:    Item | null,
    startPoint: ConnectionPoint,
    endPoint:   ConnectionPoint,
}= {
    startItem:  null, 
    endItem:    null,
    startPoint: ConnectionPoint.CENTER,
    endPoint:   ConnectionPoint.CENTER,
}


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
            
    selectNone();
    nextTick(() => { 
        console.log('Selecting item', item)
        selectedItem.value = item; 
    })
}

function selectNone() : void {
    selectedItem.value = null;
}


// ---------------------------------------------------------------------------------------------------------------------
// Drag item
// ---------------------------------------------------------------------------------------------------------------------
function onDragStart(e: any) : void {
    if(!isItem(selectedItem.value)) return;
    
    origin.x = selectedItem.value.x;
    origin.y = selectedItem.value.y;    
}

function onDrag(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    // console.log('ondrag', e);
    selectedItem.value.x = Math.floor(e.beforeTranslate[0]);
    selectedItem.value.y = Math.floor(e.beforeTranslate[1]);
    e.target.style.transform = e.transform;  
}

function onDragEnd(e: any) : void {
    if(isItem(selectedItem.value)) {
        // Item just cliked, no move ?
        if(origin.x === selectedItem.value.x && origin.y === selectedItem.value.y) return;
        
        historyManager.value.execute(new MoveCommand(selectedItem.value, [origin.x, origin.y], [selectedItem.value.x, selectedItem.value.y]));
    }
}


// ---------------------------------------------------------------------------------------------------------------------
// Resize item
// ---------------------------------------------------------------------------------------------------------------------
function onResizeStart(e: any) : void {
    if(!isItem(selectedItem.value)) return;
    
    origin.w = selectedItem.value.w;
    origin.h = selectedItem.value.h;
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
    if(isItem(selectedItem.value)) historyManager.value.execute(new ResizeCommand(selectedItem.value, [origin.w, origin.h], [selectedItem.value.w, selectedItem.value.h]));
}


// ---------------------------------------------------------------------------------------------------------------------
// Rotate item
// ---------------------------------------------------------------------------------------------------------------------
function onRotateStart(e: any) : void {
    if(isItem(selectedItem.value)) origin.r = selectedItem.value.r;
}

function onRotate(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    // console.log('onrotate', item, e);    
    selectedItem.value.r = e.beforeRotate % 360;
    e.target.style.transform = e.drag.transform;
}

function onRotateEnd(e: any) : void {
    if(isItem(selectedItem.value)) historyManager.value.execute(new RotateCommand(selectedItem.value, origin.r, selectedItem.value.r));
}


// ---------------------------------------------------------------------------------------------------------------------
// Round item
// ---------------------------------------------------------------------------------------------------------------------
function onRoundStart(e: any) : void {
    if(isItem(selectedItem.value)) origin.borderRadius = selectedItem.value.borderRadius;
}

function onRound(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    //console.log('onRound', e);
    selectedItem.value.borderRadius = parseInt(e.borderRadius) || 0;
    e.target.style.borderRadius = e.borderRadius;
}

function onRoundEnd(e: any) : void {
    if(isItem(selectedItem.value)) historyManager.value.execute(new RoundCommand(selectedItem.value, origin.borderRadius, selectedItem.value.borderRadius));        
}




// ---------------------------------------------------------------------------------------------------------------------
// Scrolling
// ---------------------------------------------------------------------------------------------------------------------
function onScroll(e: any) : void {
    if(e.ctrlKey) e.deltaY < 0 ? zoomIn() : zoomOut();

    if(hGuides.value) { hGuides.value.scroll(e.scrollLeft); hGuides.value.scrollGuides(e.scrollTop);  }
    if(vGuides.value) { vGuides.value.scroll(e.scrollTop);  vGuides.value.scrollGuides(e.scrollLeft); }
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
        const newColor = `hsl(${randomInt(0, 500)}, 90%, 50%)`;
        historyManager.value.execute(new ChangeBackgroundColorCommand(selectedItem.value, oldColor, newColor));
    }
    else if(isConnection(selectedItem.value)) {
        const oldColor = selectedItem.value.color;
        const newColor = `hsl(${randomInt(0, 500) }, 90%, 50%)`;
        historyManager.value.execute(new ChangeBackgroundColorCommand(selectedItem.value, oldColor, newColor));
    }
}

function deleteItem() {
    if(isItem(selectedItem.value)) {
        emit('delete-item', selectedItem.value, historyManager.value as HistoryManager);
        selectNone();
    }

    if(isConnection(selectedItem.value)) {
        emit('delete-connection', selectedItem.value, historyManager.value as HistoryManager);
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

    if(tool == EditorTool.CONNECTION) {
        console.log('Creating connection');
        nextTick( () => {
            connectionInfo.startItem = null;
            connectionInfo.endItem   = null;
        })

        return;
    }

}

function onCanvasClick(e: any): void {
    console.log('onCanvasClick', e);

    // Was just clicking the scrollbar for scrolling?
    if(e.target?.classList?.contains('infinite-viewer-scroll-thumb')) return;

    
    if(currentTool.value === EditorTool.SELECT) {
        console.log('Unselecting all');
        selectNone();
        return;
    }

    // Clicking in the canvas resets the current connection creation
    if(currentTool.value === EditorTool.CONNECTION) {
        connectionInfo.startItem = null;
        connectionInfo.endItem   = null;
        return;
    }
    
    const toolDef  = getToolDefinition(currentTool.value);
    const itemType = toolDef.itemType;
    if(itemType) {
        const newItem = {
            ...getItemBlueprint(itemType),
            id: getUniqueId(),
            x: mouseCoords.value.x,
            y: mouseCoords.value.y
        }
        
        console.log('creating new item', toolDef, itemType, newItem)
        historyManager.value.execute(new AddItemCommand(elements, newItem));    

        //emit('add-item', newItem, historyManager.value as HistoryManager);
    }
}

function onGuidesChanged(e: any) {
    console.log('onGuidesChanged', e);

}

function onKeyDown(e: any) {
    console.log('onKeyDown', e);
}


function connectionHandleClick(item: Item   , point: ConnectionPoint) {
    console.log('connectionHandleClick', item, point);
    
    // Shorter alias
    const ci = connectionInfo;

    // We are clicking the starting item/point
    if(ci.startItem == null) {
        
        ci.startItem  = item;
        ci.startPoint = point;
        return;
    }
    
    // We are clicking the ending item/point
    ci.endItem  = item;
    ci.endPoint = point;

    const newConnection = createConnection(ci.startItem.id, ci.endItem.id, { fromPoint: ci.startPoint, toPoint: ci.endPoint });
    
    ci.startItem = null;
    ci.endItem   = null;

    emit('add-connection', newConnection, historyManager.value as HistoryManager);

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

.ruler {    
    position: absolute !important;
    top: 0px;
    left: 0px;
    transform: translateZ(1px);
}


.ruler.ruler-horizontal {
    left: 30px !important;
    width: calc(100% - 30px) !important;
    height: 30px !important;
}

.ruler.ruler-vertical {
    top: 30px !important;
    height: calc(100% - 30px) !important;
    width: 30px !important;
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

.item.mouse-hover {
    border: 2px solid #4af;
}

.item  {
    --handle-width:  10px;
    --handle-size:    7px;
    --handle-offset: -7px;
}
.item .connection-handle {
    position: absolute;
    border: 2px solid white;
    border-radius: 50%;
    width:  var(--handle-width);
    height: var(--handle-width);
    background-color: red;
    color: white;
    text-align: center;
    font-weight: normal;
    line-height: 1;
} 

.item .connection-handle:hover {
    background-color: #4af;
} 



.item .connection-handle-left   { left:   var(--handle-offset); top:  calc(50% - var(--handle-size)); }
.item .connection-handle-right  { right:  var(--handle-offset); top:  calc(50% - var(--handle-size)); }
.item .connection-handle-top    { top:    var(--handle-offset); left: calc(50% - var(--handle-size)); }
.item .connection-handle-bottom { bottom: var(--handle-offset); left: calc(50% - var(--handle-size)); }
.item .connection-handle-center { top: calc(50% - var(--handle-size)); left: calc(50% - var(--handle-size)); }
</style>

