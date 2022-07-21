<template>
    <div class="editor-container">
    
        <!-- Rulers -->
        <Guides v-show='guidesVisible' class="ruler ruler-horizontal" :showGuides="showGuides" @changeGuides="hGuideValues = $event.guides" type="horizontal" ref="hGuides" :zoom="zoomFactor" :snapThreshold="5" :units="50" :rulerStyle = "{ left: '30px', width: 'calc(100% - 30px)',  height: '30px' }" :style="{ 'width' : '100%', height: '30px' }" />
        <Guides v-show='guidesVisible' class="ruler ruler-vertical"   :showGuides="showGuides" @changeGuides="vGuideValues = $event.guides" type="vertical"   ref="vGuides" :zoom="zoomFactor" :snapThreshold="5" :units="50" :rulerStyle = "{ top: '30px',  height: 'calc(100% - 30px)', width:  '30px' }" :style="{ 'height': '100%', width:  '30px', top: '-30px' }" />
        <div    v-show='guidesVisible' class="rulers-left-top-box"></div>

        <!-- Editor Canvas -->
        <VueInfiniteViewer 
            ref             = "viewer" 
            class           = "viewer" 
            :useWheelScroll = "true" 
            :zoom           = "zoomFactor"  
            :zoomOffsetX    = "mouseCoords.x"
            :zoomOffsetY    = "mouseCoords.y"
            :style          = "{ cursor: currentTool == EditorTool.SELECT ? 'auto' : 'crosshair'}" 
            @wheel          = "onScroll" 
            @scroll         = "onScroll"              
            @mousemove      = "onMouseMove"
            @click.stop     = "editable && onCanvasClick($event)">
            
            <div ref="viewport" class="viewport" >
                
                <!-- Render Connections (default component='Connection') -->
                <component v-for = "(c, i) in connections"
                    :is          = "c.component"
                    :key         = "c.id"
                    :from        = "getItemById(c.from.item)!"
                    :to          = "getItemById(c.to.item)!"
                    :connection  = "c"
                    :style       = "{ zIndex: c.z }"
                    :selected    = "c.id === selectedItem?.id"
                    @selected    = "selectedItem = c" />
                        
                <!-- Use to render a connection line during a new connection creation -->
                <RawConnection v-if="creatingConnection && connectionInfo.startItem" 
                                :x1    = "getHandlePosition(connectionInfo.startItem, connectionInfo.startPoint).x" 
                                :y1    = "getHandlePosition(connectionInfo.startItem, connectionInfo.startPoint).y" 
                                :x2    = "mouseCoords.x" 
                                :y2    = "mouseCoords.y"
                                :type  = "ConnectionType.LINE"                                
                                style  = "z-index: -100000;"
                                selected />
                            
                <!-- Render Items -->
                <div v-for="(item, i) in items"                 
                    class          = "item"
                    :key           = "item.id" 
                    :data-item-id  = "item.id"
                    :class         = "{ 'target': item.id === selectedItem?.id, 'locked': item.locked === true, 'mouse-hover': item.hover }" 
                    :style         = "getItemStyle(item)"
                   
                    @click.stop     = "!creatingConnection && editable && selectItem(item)" 
                    @dblclick.stop  = "!creatingConnection && editable && lockItem(item)"
                    
                    @mousedown       = "!creatingConnection && editable && selectItem(item, $event)" 
                    @mouseover.stop  = "creatingConnection && onMouseOver(item, $event)"
                    @mouseleave.self = "creatingConnection && onMouseLeave(item, $event)" > 

                        <component :is="item.component" :item="item" />

                        <!-- Item decorators (delete, locked, size info) -->
                        <div class="decorator decorator-delete" v-if="!creatingConnection && editable && item.id === selectedItem?.id && (selectedItem as Item)?.locked !== true" :style="{ zoom: 1 / zoomFactor }" @click.stop="deleteItem" title="delete item">&times;</div>
                        <div class="decorator decorator-locked" v-if="!creatingConnection && editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }" v-show="item.locked === true" title="locked">&#x1F512;</div>
                        <div class="decorator decorator-size"   v-if="!creatingConnection && editable && item.id === selectedItem?.id" :style="{ zoom: 1 / zoomFactor }">X: {{ item.x }} &nbsp; Y: {{ item.y }} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h}} &nbsp;{{ item.r !== 0 ? ' R: ' + item.r + '°': '' }}</div>

                        <!-- Connection Handles - When the item is rotated, only the center handle is active -->
                        <div class="connection-handle connection-handle-left"   v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.LEFT)"></div>
                        <div class="connection-handle connection-handle-right"  v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.RIGHT)"></div>
                        <div class="connection-handle connection-handle-top"    v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.TOP)"></div>
                        <div class="connection-handle connection-handle-bottom" v-if="item.r === 0 && editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.BOTTOM)"></div>
                        <div class="connection-handle connection-handle-center" v-if="editable && creatingConnection && item.hover === true" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.CENTER)"></div>
                </div> <!-- item -->
                
                <!-- Manage drag / resize / rotate / rounding of selected item -->
                <Moveable 
                    ref     = "moveable"
                    :target = "isItem(selectedItem) ? [`[data-item-id='${selectedItem.id}']`] : []"
                    :zoom   = "1 / zoomFactor"
                    :origin = "false"  
                    
                    :throttleDrag   = "1"
                    :throttleResize = "1"
                    :throttleRotate = "shiftPressed ? 45 : 1"
                    :keepRatio      = "shiftPressed"

                    :snappable               = "showGuides"
                    :snapGap                 = "true"
                    :snapDirections          = "{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
                    :elementSnapDirections   = "{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
                    :isDisplayInnerSnapDigit = "true"
                    :horizontalGuidelines    = "showGuides ? hGuideValues : []"
                    :verticalGuidelines      = "showGuides ? vGuideValues : []"
                    :elementGuidelines       = "showGuides ? elementGuidelines() : []"
                    
                    
                    :roundable = "selectedItemActive && (selectedItem as Item)?.supportsRoundable === true"
                    :draggable = "selectedItemActive"
                    :rotatable = "selectedItemActive"
                    :resizable = "selectedItemActive && (selectedItem as Item)?.supportsResizable === true"

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

        <div class="toolbars-container">
            <!-- Editor Toolbar -->
            <ToolsToolbar v-if='editable'  :customWidgets = "customWidgets" :selectedTool  = "currentTool"  @toolSelected  = "selectCurrentTool" />
            <div class='toolbar-separator'></div>
            <ZoomToolbar :zoomManager="zoomManager" @zoomChanged="onZoomChanged" />
            <div class='toolbar-separator'></div>
            <div class="toolbar">
                <button class='toolbar-item' @click="undo"            :disabled="!historyManager.canUndo()" title="Undo"><Icon icon="undo"/></button>
                <button class='toolbar-item' @click="redo"            :disabled="!historyManager.canRedo()" title="Redo"><Icon icon="redo"/></button>
                <div class='toolbar-item-separator'></div>
                <button class='toolbar-item' @click="deleteItem"      :disabled="!selectedItemActive" title="Delete"><Icon icon="delete"/></button>
                <div class='toolbar-item-separator'></div>
                <button class='toolbar-item' @click="sendToBack"      :disabled="!selectedItemActive" title="Send to back">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" style="transform: scale(1.5);">
                        <path d="M469.333333 128a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333h213.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v213.333333h85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v298.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-298.666666a42.666667 42.666667 0 0 1-42.666667-42.666667v-85.333333H298.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-213.333333H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h298.666666z m213.333334 213.333333h-170.666667v128a42.666667 42.666667 0 0 1-42.666667 42.666667H341.333333v170.666667h170.666667v-128a42.666667 42.666667 0 0 1 42.666667-42.666667h128V341.333333z"  />
                    </svg>
                </button>
                <button class='toolbar-item' @click="bringToFront"    :disabled="!selectedItemActive" title="Bring to front">
                    <svg xmlns="http://www.w3.org/2000/svg" style="transform: scale(1.5);" viewBox="0 0 24 24">
                        <g><path fill="none" d="M0 0H24V24H0z"/> <path d="M11 3c.552 0 1 .448 1 1v2h5c.552 0 1 .448 1 1v5h2c.552 0 1 .448 1 1v7c0 .552-.448 1-1 1h-7c-.552 0-1-.448-1-1v-2H7c-.552 0-1-.448-1-1v-5H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h7zm5 5H8v8h8V8z"/> </g> 
                    </svg>
                </button>
                <div class='toolbar-item-separator'></div>
                <button class='toolbar-item' @click="showGuides    = !showGuides"    title="Show / Hide guidelines" :style="{ backgroundColor: showGuides    ? '#4af': '' }"><Icon icon="border_style" /></button>
                <button class='toolbar-item' @click="showInspector = !showInspector" title="Show / Hide inspector"  :style="{ backgroundColor: showInspector ? '#4af': '' }"><Icon icon="brush" /></button>
            </div>
        </div>

        <!-- Object Inspector -->
        <div v-if='editable && showInspector' class="object-inspector-container">
                <ObjectInspector                    
                    :schema = "selectedItem ? selectedItem.inspectorModel : null"
                    :object = "selectedItem"
                    @property-changed="onPropertyChange" />                                
        </div> 
        
    </div> <!-- editor-container -->    
</template>

<script setup lang="ts">
import { onKeyStroke, useKeyModifier } from '@vueuse/core';
import { computed, nextTick, onMounted, onUpdated, ref, StyleValue } from "vue";
import Guides from "vue3-guides";
import { VueInfiniteViewer } from "vue3-infinite-viewer";
import Moveable from 'vue3-moveable';
import ChangeZOrderCommand from './commands/ChangeZOrderCommand';
import HistoryManager from './commands/HistoryManager';
import { LockCommand, UnlockCommand } from './commands/LockCommand';
import MoveCommand from './commands/MoveCommand';
import ResizeCommand from './commands/ResizeCommand';
import RotateCommand from './commands/RotateCommand';
import RoundCommand from './commands/RoundCommand';
import { createConnection, findMaxZ, findMinZ, getHandlePosition, getItemBlueprint, getUniqueId, registerDefaultItemTypes } from './helpers';

import RawConnection from './blocks/RawConnection.vue';
import AddItemCommand from './commands/AddItemCommand';
import ToolsToolbar from './components/ToolsToolbar.vue';
import ZoomToolbar from './components/ZoomToolbar.vue';
import { ConnectionHandle, ConnectionType, DiagramElement, EditorTool, Frame, getToolDefinition, isConnection, isItem, Item as _Item, ItemConnection, Position } from './types';

import ObjectInspector from '../inspector/ObjectInspector.vue';
import { ObjectProperty } from '../inspector/types';
import AddConnectionCommand from './commands/AddConnectionCommand';
import DeleteCommand from './commands/DeleteCommand';
import Icon from './components/Icon.vue';
import { DefaultZoomManager, IZoomManager } from './ZoomManager';

export type Item = _Item & { hover?: boolean }

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface DiagramEditorProps {
    elements:       DiagramElement[],
    editable?:      boolean,    
    customWidgets?: boolean,    
}

export interface DiagramEditorEvents {
    (e: 'add-item',    item: Item): void
    (e: 'delete-item', item: Item): void
    
    (e: 'add-connection',    connection: ItemConnection): void
    (e: 'delete-connection', connection: ItemConnection): void
}

// Define props
const { elements, editable } = withDefaults(defineProps<DiagramEditorProps>(), {
    editable:      true,
    customWidgets: false,
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

// Set the handlers to manage keyboard shortcuts
setupKeyboardHandlers();


// The component state
// ------------------------------------------------------------------------------------------------------------------------
const zoomManager   = ref<IZoomManager>(new DefaultZoomManager());
const zoomFactor    = ref(1);

const viewer        = ref();
const viewport      = ref<HTMLDivElement>();
const moveable      = ref();

const hGuides       = ref();
const vGuides       = ref();
const guidesVisible = computed(() => editable && zoomFactor.value >= 0.5);
const hGuideValues  = ref<number[]>([]);       // Horizontal guides added by the user
const vGuideValues  = ref<number[]>([]);       // Vertical guides added by the user
const showGuides    = ref(true);               // Show or hide all the guides
const showInspector = ref(true);               // Show or hide all the guides

const selectedItem  = ref<DiagramElement | null>(null);

const selectedItemActive = computed(() => {
    if(!selectedItem.value) return false;

    // An item is 'active' if not locked, a connection is always 'active'
    return isItem(selectedItem.value) ? (!selectedItem.value.locked === true) : true;
})

const shiftPressed   = useKeyModifier('Shift')
const historyManager = ref(new HistoryManager());
const currentTool    = ref(EditorTool.SELECT);

const creatingConnection = computed<boolean>(() => currentTool.value === EditorTool.CONNECTION);

const items       = computed(() => elements.filter(e => isItem(e)) as Item[]);
const connections = computed(() => elements.filter(e => isConnection(e)) as ItemConnection[]);


// Temporary variables
// ------------------------------------------------------------------------------------------------------------------------
const origin: Frame = { x: 0, y: 0, w: 0, h: 0, z: 0, r: 0, borderRadius: 0, opacity: 1 };

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
    startPoint: ConnectionHandle,
    endPoint:   ConnectionHandle,
}= {
    startItem:  null, 
    endItem:    null,
    startPoint: ConnectionHandle.CENTER,
    endPoint:   ConnectionHandle.CENTER,
}

function onMouseOver(item: Item, e: MouseEvent) {
    if(!creatingConnection.value === true) return;

    item.hover = true;
}

function onMouseLeave(item: Item,e: MouseEvent) {
    if(!creatingConnection.value === true) return;

    if('hover' in item) delete item.hover;
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

function selectItem(item: Item, e?: MouseEvent)  : void {
    console.log('selectItem', item, e);

    // Item already selected
    if (item === selectedItem.value) return;

    selectNone();
    nextTick(() => {
        selectedItem.value = item;
        if (e) nextTick(() => { moveable.value?.dragStart(e); });        
    });
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
    if(!isItem(selectedItem.value)) return;
    
    // Item just cliked, no move ?
    if(origin.x === selectedItem.value.x && origin.y === selectedItem.value.y) return;
    
    historyManager.value.execute(new MoveCommand(selectedItem.value, [origin.x, origin.y], [selectedItem.value.x, selectedItem.value.y]));
}


// ---------------------------------------------------------------------------------------------------------------------
// Resize item
// ---------------------------------------------------------------------------------------------------------------------
function onResizeStart(e: any) : void {
    if(!isItem(selectedItem.value)) return;
    
    origin.x = selectedItem.value.x;
    origin.y = selectedItem.value.y;
    origin.w = selectedItem.value.w;
    origin.h = selectedItem.value.h;
}


function onResize(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    // console.log('onresize', e);
    selectedItem.value.x = Math.floor(e.drag.beforeTranslate[0]);
    selectedItem.value.y = Math.floor(e.drag.beforeTranslate[1]);
    selectedItem.value.w = Math.floor(e.width);
    selectedItem.value.h = Math.floor(e.height);

    e.target.style.transform = e.drag.transform;  
    e.target.style.width     = `${Math.floor(e.width)}px`;
    e.target.style.height    = `${Math.floor(e.height)}px`;
}

function onResizeEnd(e: any) : void {
    if(!isItem(selectedItem.value)) return;
    
    historyManager.value.execute(new ResizeCommand(selectedItem.value, { ...origin }, { ...selectedItem.value }));
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
    if(e.ctrlKey) zoomFactor.value = e.deltaY < 0 ? zoomManager.value.zoomIn() : zoomManager.value.zoomOut();

    if(hGuides.value) { hGuides.value.scroll(e.scrollLeft); hGuides.value.scrollGuides(e.scrollTop);  }
    if(vGuides.value) { vGuides.value.scroll(e.scrollTop);  vGuides.value.scrollGuides(e.scrollLeft); }
}
 


function sendToBack() : void {
    if(selectedItem.value) historyManager.value.execute(new ChangeZOrderCommand(selectedItem.value, selectedItem.value.z, findMinZ(items.value as Item[]) - 1));    
}

function bringToFront() : void {
    if(selectedItem.value) historyManager.value.execute(new ChangeZOrderCommand(selectedItem.value, selectedItem.value.z, findMaxZ(items.value as Item[]) + 1));    
}

function deleteItem() {
    if(isItem(selectedItem.value)) {
        historyManager.value.execute(new DeleteCommand(elements, selectedItem.value));
        emit('delete-item', selectedItem.value);
        selectNone();
    }

    if(isConnection(selectedItem.value)) {
        historyManager.value.execute(new DeleteCommand(elements, selectedItem.value));
        emit('delete-connection', selectedItem.value);
        selectNone();
    }
}

function lockItem(item: Item) {
    historyManager.value.execute(item.locked === true ? new UnlockCommand(item) : new LockCommand(item));
}


function elementGuidelines() {   
    if(!viewport.value) return [];

    return Array.prototype.slice.call(viewport.value!.querySelectorAll(".item"), 0).filter(n => !n.classList.contains('target'))
}

function getItemById(id: string) : Item | undefined {
    return (items.value as Item[]).find(n => n.id == id);
}

function undo() {  
    if(!historyManager.value.canUndo()) return;
    
    historyManager.value?.undo(); 
    nextTick(() => moveable.value?.updateTarget());
}

function redo() {  
    if(!historyManager.value.canRedo()) return;

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
        emit('add-item', newItem);
    }
}


function connectionHandleClick(item: Item   , point: ConnectionHandle) {
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

    const newConnection = createConnection(
        ci.startItem.id, 
        ci.endItem.id, 
        {
            from: { handle: ci.startPoint },
            to:   { handle: ci.endPoint   }
        }
    );
    
    ci.startItem = null;
    ci.endItem   = null;

    historyManager.value.execute(new AddConnectionCommand(elements, newConnection));
    emit('add-connection', newConnection);
}


function onPropertyChange(p: ObjectProperty, newValue: any) {
    // console.log('onPropertyChange', p, 'New value:', newValue);
    nextTick(() => moveable.value?.updateRect());
}


function onZoomChanged(newZoomFactor: number, scrollViewerToCenter?: boolean) {
    console.log('onZoomChanged', newZoomFactor, scrollViewerToCenter);
    zoomFactor.value = newZoomFactor;
    
    if(scrollViewerToCenter === true) nextTick(() => viewer.value?.scrollCenter());
}

function setupKeyboardHandlers() {
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

    function onKey(keys: string | string[], handler: (e: KeyboardEvent) => void) {
        onKeyStroke(keys, (e) => {
            if(document.activeElement?.tagName == 'INPUT') return;
            e.preventDefault();
            handler(e);
        }, { eventName: 'keydown' })
    }

    function isVirtualCtrl(e: KeyboardEvent) {
        const isMac = navigator.userAgent.toLowerCase().includes('macintosh');
        return isMac ? e.metaKey : e.ctrlKey;
    }

    // Delete / backspace to delete selected item
    onKey(["Backspace", "Delete"], (e: KeyboardEvent) => { 
        console.log('Pressed delete', e);
        if(selectedItem.value) deleteItem(); 
    });

    // CMD+Z to undo, Shift+CMD+Z to redo
    onKey(["z"], (e: KeyboardEvent) => { 
        if(isVirtualCtrl(e)) {                       
            if(e.shiftKey) redo(); else undo();
        }         
    });

    // CMD+Z to undo, Shift+CMD+Z to redo
    onKey(["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"], (e: KeyboardEvent) => {         
        if(!selectedItem.value) return;

        console.log('Pressed arrow key', e);

        const item = selectedItem.value as Item;        

        let dx = 0, dy = 0;
        if(e.key == 'ArrowLeft')  dx = -1;
        if(e.key == 'ArrowRight') dx = 1;
        if(e.key == 'ArrowUp')    dy = -1;
        if(e.key == 'ArrowDown')  dy = 1;

        if(e.shiftKey) { dx *= 10; dy *= 10; }

        historyManager.value.execute(new MoveCommand(item as Item, [item.x, item.y], [item.x + dx, item.y + dy]));
        nextTick(() => moveable.value?.updateRect());
    });

    // Shortcuts to tools selection
    onKey(["s"], (e: KeyboardEvent) => selectCurrentTool(EditorTool.SELECT));           // S = Select tool
    onKey(["c"], (e: KeyboardEvent) => selectCurrentTool(EditorTool.CONNECTION));       // C = Connection tool
    onKey(["t"], (e: KeyboardEvent) => selectCurrentTool(EditorTool.TEXT));             // T = Text tool
    onKey(["r"], (e: KeyboardEvent) => selectCurrentTool(EditorTool.RECTANGLE));        // R = Rectanble tool
    onKey(["i"], (e: KeyboardEvent) => showInspector.value = !showInspector.value);     // I = Show


    onKey(["Escape"], (e: KeyboardEvent) => {
        if(creatingConnection.value === true) {
            console.log("ESC pressed: cancelling connection creation");
            connectionInfo.startItem = null;
            connectionInfo.endItem   = null;
            selectCurrentTool(EditorTool.SELECT);
            nextTick(() => selectCurrentTool(EditorTool.CONNECTION));
        }
    }); 
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

.object-inspector-container {
    position: absolute;
    top: 40px;
    right: 20px;
    width: 240px;
    height: auto;
    max-height: 90%;
    overflow-x: hidden;
    overflow-y: auto;
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

.toolbars-container {
    position: absolute;
    top: 40px;
    left: 40px;
    width: auto;
    height: auto;
    
    display: flex;
    align-items: center;
}

.toolbar-separator {
    width: 16px;
}
.toolbar-item-separator {
    width: 10px;
}

.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
 
    width: auto;
    height: auto;
    background-color: #fefefe;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 5px #ccc;
    gap: 0px;
    user-select: none;
}

.toolbar-item {
    display: flex;
    justify-content: center;
    align-items: center; 
    cursor: pointer;
    width: 32px;
    height: 32px;
    text-align: center;
    background-color: #fefefe;
    border: 0px;
}

.toolbar-item:hover {
    background-color: #efefef;
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
    top: 0px;
    right: -20px;
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

