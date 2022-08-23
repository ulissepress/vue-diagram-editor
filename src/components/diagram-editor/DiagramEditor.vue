<template>
    <div class="editor-layout">
        <div class="editor-toolbars">
            <!-- Editor Toolbar -->
            <ToolsToolbar v-if='editable'  :customWidgets = "customWidgets === true" :selectedTool  = "currentTool"  @toolSelected  = "selectCurrentTool" />
            <div class='toolbar-separator'></div>
            <ZoomToolbar :zoomManager="zoomManager" @zoomChanged="onZoomChanged" />
            <div class='toolbar-separator'></div>
            <div v-if="editable" class="toolbar">
                <button class='toolbar-item' @click="undo" :disabled="!historyManager.canUndo()" title="Undo"><Icon icon="undo" size="20px"/></button>
                <button class='toolbar-item' @click="redo" :disabled="!historyManager.canRedo()" title="Redo"><Icon icon="redo" size="20px"/></button>
                
                <div class='toolbar-item-separator'></div>
                <button class='toolbar-item' @click="deleteItem" :disabled="!selectedItemActive" title="Delete"><Icon icon="delete" size="20px"/></button>
                
                <div class='toolbar-item-separator'></div>
                <button class='toolbar-item' @click="copyItem"   :disabled="targets.length === 0"  title="Copy"><Icon icon="content_copy"   size="18px"/></button>
                <button class='toolbar-item' @click="cutItem"    :disabled="targets.length === 0"  title="Cut"><Icon icon="content_cut"     size="18px"/></button>
                <button class='toolbar-item' @click="pasteItem"  :disabled="itemToPaste === null"  title="Paste"><Icon icon="content_paste" size="18px"/></button>
                
                <div class='toolbar-item-separator'></div>               
                <button class='toolbar-item' @click="sendToBack" :disabled="!selectedItemActive" title="Send to back">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" :style="{ transform: 'scale(1.1)', opacity: selectedItemActive ? 1 : 0.3, fill: '#fafafa' }">
                        <path d="M469.333333 128a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333h213.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v213.333333h85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v298.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-298.666666a42.666667 42.666667 0 0 1-42.666667-42.666667v-85.333333H298.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-213.333333H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h298.666666z m213.333334 213.333333h-170.666667v128a42.666667 42.666667 0 0 1-42.666667 42.666667H341.333333v170.666667h170.666667v-128a42.666667 42.666667 0 0 1 42.666667-42.666667h128V341.333333z"  /></svg>
                </button>
                <button class='toolbar-item' @click="bringToFront" :disabled="!selectedItemActive" title="Bring to front">
                    <svg xmlns="http://www.w3.org/2000/svg" :style="{transform: 'scale(1.1)', opacity: selectedItemActive ? 1 : 0.3, stroke: '#fafafa', fill: 'none'}" viewBox="0 0 24 24"><path d="M0 0H24V24H0z"/><path d="M11 3c.552 0 1 .448 1 1v2h5c.552 0 1 .448 1 1v5h2c.552 0 1 .448 1 1v7c0 .552-.448 1-1 1h-7c-.552 0-1-.448-1-1v-2H7c-.552 0-1-.448-1-1v-5H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h7zm5 5H8v8h8V8z"/></svg>
                </button>
            </div>   
            <div class='toolbar-item-separator'></div>               
            <div v-if="editable" class="toolbar">
                <button class='toolbar-item' @click="showRulers    = !showRulers"    title="Show / Hide rulers"               :style="{ backgroundColor: showRulers    ? '#4af': '', color: showRulers    ? 'white': '' }"><Icon icon="straighten" size="18px"/></button>
                <button class='toolbar-item' @click="showGuides    = !showGuides"    title="Show / Hide alignment guidelines" :style="{ backgroundColor: showGuides    ? '#4af': '', color: showGuides    ? 'white': '' }"><Icon icon="border_style" size="18px"/></button>
                <button class='toolbar-item' @click="showInspector = !showInspector" title="Show / Hide inspector"            :style="{ backgroundColor: showInspector ? '#4af': '', color: showInspector ? 'white': '' }"><Icon icon="brush" size="18px"/></button>
                <button class='toolbar-item' @click="showKeyboard  = !showKeyboard"  title="Show / Hide keyboards shortcuts"  :style="{ backgroundColor: showKeyboard  ? '#4af': '', color: showKeyboard  ? 'white': '' }"><Icon icon="keyboard_hide" size="18px"/></button>
            </div>
            <!-- <div class='toolbar-item-separator'></div>               
            <div style="color: white;">EDIT: {{ inlineEditing }}</div> -->
        </div> <!-- editor-toolbars -->  

        <div class="editor-canvas">
            <div class="editor-container">
    
                <!-- Rulers -->
                <Guides v-show='guidesVisible' class="ruler ruler-horizontal" :showGuides="showGuides" @changeGuides="hGuideValues = $event.guides" type="horizontal" ref="hGuides" :zoom="zoomFactor" :snapThreshold="5" :unit="zoomFactor >= 1 ? 50 : Math.floor(50 / zoomFactor)" :rulerStyle = "{ left: '30px', width: 'calc(100% - 30px)',  height: '30px' }" :style="{ 'width' : '100%', height: '30px' }" />
                <Guides v-show='guidesVisible' class="ruler ruler-vertical"   :showGuides="showGuides" @changeGuides="vGuideValues = $event.guides" type="vertical"   ref="vGuides" :zoom="zoomFactor" :snapThreshold="5" :unit="zoomFactor >= 1 ? 50 : Math.floor(50 / zoomFactor)" :rulerStyle = "{ top: '30px',  height: 'calc(100% - 30px)', width:  '30px' }" :style="{ 'height': '100%', width:  '30px', top: '-30px' }" />
                <div    v-show='guidesVisible' class="rulers-left-top-box"></div>

                <!-- Editor Canvas -->
                <VueInfiniteViewer 
                    ref             = "viewer" 
                    class           = "viewer"
                    :style          = "{ cursor: currentTool == EditorTool.SELECT ? 'auto' : 'crosshair' }"
                    
                    :useMouseDrag   = "shiftPressed"
                    :useWheelScroll = "true"
                    :zoom           = "zoomFactor"  
                    :zoomOffsetX    = "mouseCoords.x"
                    :zoomOffsetY    = "mouseCoords.y"

                    @wheel          = "onScroll" 
                    @scroll         = "onScroll"              
                    @mousemove      = "onMouseMove">
                    
                    <div ref="viewport" 
                        :class="{ 'viewport': true, 'viewport-area': viewportSize }" 
                        :style="{ width:  viewportSize ? viewportSize[0] + 'px' : '100%', 
                                  height: viewportSize ? viewportSize[1] + 'px' : '100%' }">
                        
                        <!-- Render Connections (default component='Connection') -->
                        <component v-for = "(c, i) in connections"
                            :is          = "c.component"
                            :key         = "c.id"
                            :from        = "getItemById(items, c.from.item)!"
                            :to          = "getItemById(items, c.to.item)!"
                            :connection  = "c"
                            :style       = "{ zIndex: c.z }"
                            :selected    = "editable && c.id === selectedConnection?.id"
                            @selected    = "selectConnection(c)" />
                                
                        <!-- Use to render a connection line during a new connection creation -->
                        <RawConnection v-if="editable && creatingConnection && connectionInfo.startItem" 
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
                            @dblclick.stop  = "!creatingConnection && editable && inlineEdit(item)"
                            
                            @mousedown       = "!creatingConnection && editable && selectItem(item, $event)" 
                            @mouseover.stop  = "creatingConnection && onMouseOver(item, $event)"
                            @mouseleave.self = "creatingConnection && onMouseLeave(item, $event)" > 

                                <component :is="item.component" :item="item" />

                                <!-- Item decorators (delete, locked, size info) -->
                                <div class="decorator decorator-delete"    v-if="isDecoratorActive(item)"       :style="{ zoom: 1 / zoomFactor }" @click.stop="deleteItem" title="delete">&times;</div>
                                <div class="decorator decorator-duplicate" v-if="isDecoratorActive(item)"       :style="{ zoom: 1 / zoomFactor }" @click.stop="copyItem(); pasteItem()" title="duplicate">&plus;</div>
                                <div class="decorator decorator-locked"    v-if="isDecoratorActive(item, true)" :style="{ zoom: 1 / zoomFactor }" title="locked">&#x1F512;</div>
                                <div class="decorator decorator-size"      v-if="isDecoratorActive(item)"       :style="{ zoom: 1 / zoomFactor }">X: {{ item.x }} &nbsp; Y: {{ item.y }} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h}} &nbsp;{{ item.r !== 0 ? ' R: ' + item.r + '°': '' }}</div>
 
                                <!-- Connection Handles - When the item is rotated, only the center handle is active -->
                                <div class="connection-handle connection-handle-left"   v-if="isConnectionHandleActive(item)"       :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.LEFT)"></div>
                                <div class="connection-handle connection-handle-right"  v-if="isConnectionHandleActive(item)"       :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.RIGHT)"></div>
                                <div class="connection-handle connection-handle-top"    v-if="isConnectionHandleActive(item)"       :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.TOP)"></div>
                                <div class="connection-handle connection-handle-bottom" v-if="isConnectionHandleActive(item)"       :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.BOTTOM)"></div>
                                <div class="connection-handle connection-handle-center" v-if="isConnectionHandleActive(item, true)" :style="{ zoom: 1 / zoomFactor }" @click="connectionHandleClick(item, ConnectionHandle.CENTER)"></div>
                        </div> <!-- item -->
                        
                    <!-- Manage drag / resize / rotate / rounding of selected item -->
                    <Moveable v-if="editable"
                        ref              = "moveable"
                        :target          = "targets"
                        :zoom            = "1 / zoomFactor"
                        :origin          = "false"  
                        :stopPropagation = "true"
                        
                        :throttleDrag    = "1"
                        :throttleResize  = "1"
                        :throttleRotate  = "shiftPressed ? 45 : 1"
                        :keepRatio       = "shiftPressed"

                        :renderDirections="selectedItem?.component === 'Line' ? ['ne', 'sw'] : true"

                        :snappable               = "showGuides"
                        :snapGap                 = "true"
                        :snapThreshold           = "5" 
                        :snapDirections          = "{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
                        :elementSnapDirections   = "{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
                        :isDisplayInnerSnapDigit = "true"
                        :horizontalGuidelines    = "horizontalGuidelines"
                        :verticalGuidelines      = "verticalGuidelines"
                        :elementGuidelines       = "showGuides ? elementGuidelines() : []"
                        
                        :clippable         = "targets.length === 1 && selectedItem?.clipType !== ClipType.NONE"
                        :defaultClipPath   = "targets.length === 1  ? selectedItem?.clipType : ClipType.NONE"
                        :clipArea          = "false"
                        :clipRelative      = "false"
                        :dragWithClip      = "true"
                        :clipSnapThreshold = "5"

                        :draggable = "selectedItemActive"
                        :rotatable = "selectedItemActive"
                        :resizable = "selectedItemActive"
                        :roundable = "selectedItemActive && (selectedItem as Item)?.supportsRoundable === true"

                        @dragStart   = "onDragStart"
                        @drag        = "onDrag"
                        @dragEnd     = "onDragEnd"

                        @dragGroupStart = "onDragGroupStart"
                        @dragGroup      = "onDragGroup"
                        @dragGroupEnd   = "onDragGroupEnd"

                        @resizeStart = "onResizeStart"
                        @resize      = "onResize"
                        @resizeEnd   = "onResizeEnd"

                        @resizeGroup = "onResizeGroup"
                        
                        
                        @rotateStart = "onRotateStart"
                        @rotate      = "onRotate"
                        @rotateEnd   = "onRotateEnd"
                        @rotateGroup = "onRotateGroup"

                        @roundStart  = "onRoundStart"
                        @round       = "onRound"
                        @roundEnd    = "onRoundEnd" 
                        
                        @clipStart   = "onClipStart"
                        @clip        = "onClip"
                        @clipEnd     = "onClipEnd" />                
                    </div> <!-- viewport -->
                </VueInfiniteViewer>
                
                <VueSelecto v-if="!shiftPressed && editable"
                    container             = ".viewer"
                    :selectableTargets    = '[".item"]'
                    :selectByClick        = "true"
                    :selectFromInside     = "true"
                    :continueSelect       = "false"
                    :toggleContinueSelect = "'shift'"
                    :hitRate              = "0"
                    :preventDefault       = "true"
                    @dragStart            = "onSelectionDragStart"
                    @select               = "onSelection" 
                    @selectEnd            = "onSelectionEnd" 
                    />
                
                <KeyboardHelp v-if="showKeyboard" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);  z-order: 1000;" />                
            </div> <!-- editor-container -->    
            
            <div class="inspector-container" v-if="showInspector && editable" >
                <ObjectInspector :schema = "getObjectToInspect()[1]"
                                 :object = "getObjectToInspect()[0]"
                                 :title  = "getInspectorTitle()"
                                 @property-changed = "onPropertyChange" /> 
            </div><!-- inspector-container -->
        </div><!-- editor-canvas -->
    </div><!-- editor-layout -->
</template>

<script setup lang="ts">
import { onKeyStroke, useKeyModifier } from '@vueuse/core';
import { computed, getCurrentInstance, nextTick, onMounted, onUpdated, ref } from "vue";
import Guides from "vue3-guides";
import { VueInfiniteViewer } from "vue3-infinite-viewer";
import Moveable from 'vue3-moveable';
import { VueSelecto } from "vue3-selecto";
import ObjectInspector from '../inspector/ObjectInspector.vue';
import { ObjectInspectorModel, ObjectProperty } from '../inspector/types';
import RawConnection from './blocks/RawConnection.vue';
import { registerBasicBlocks } from './blocks/utils';
import AddConnectionCommand from './commands/AddConnectionCommand';
import AddItemCommand from './commands/AddItemCommand';
import ChangePropertyCommand from './commands/ChangePropertyCommand';
import ChangeZOrderCommand from './commands/ChangeZOrderCommand';
import ClipCommand from './commands/ClipCommand';
import Command from './commands/Command';
import DeleteCommand from './commands/DeleteCommand';
import GroupCommand from './commands/GroupCommand';
import HistoryManager from './commands/HistoryManager';
import MoveCommand from './commands/MoveCommand';
import ResizeCommand from './commands/ResizeCommand';
import RotateCommand from './commands/RotateCommand';
import RoundCommand from './commands/RoundCommand';
import Icon from './components/Icon.vue';
import KeyboardHelp from './components/KeyboardHelp.vue';
import ToolsToolbar from './components/ToolsToolbar.vue';
import ZoomToolbar from './components/ZoomToolbar.vue';
import { createConnection, findMaxZ, findMinZ, getHandlePosition, getItemBlueprint, getItemById, getItemStyle, getUniqueId, registerDefaultItemTypes } from './helpers';
import { ClipType, ConnectionHandle, ConnectionType, DiagramElement, EditorTool, Frame, getToolDefinition, isConnection, isItem, Item as _Item, ItemConnection, Position } from './types';
import { DefaultZoomManager, IZoomManager } from './ZoomManager';
export type Item = _Item & { hover?: boolean }

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface DiagramEditorProps {
    elements:               DiagramElement[],
    editable?:              boolean,
    viewportSize?:          [number, number];
    customWidgets?:         boolean,
    customWidgetsCatalog?:  any[];     // TODO:  to be defined as widget metadata
}

export interface DiagramEditorEvents {
    (e: 'add-item',    item: Item): void
    (e: 'delete-item', item: Item): void
    
    (e: 'add-connection',    connection: ItemConnection): void
    (e: 'delete-connection', connection: ItemConnection): void
}

// Define props
const { elements, editable, viewportSize } = withDefaults(defineProps<DiagramEditorProps>(), {
    editable: true,
    customWidgets: false
});


// Define events
const emit = defineEmits<DiagramEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

onMounted(() => {
    registerBasicBlocks(getCurrentInstance()!.appContext.app);
    registerDefaultItemTypes();

    // Initialize rulers and infinite viewer
    hGuides.value.resize();    
    vGuides.value.resize();
        
    viewer.value.scrollCenter();

    // Set the handlers to manage keyboard shortcuts
    setupKeyboardHandlers();
});

onUpdated(() => {
    //console.log('DiagramEditor updated')
})


// The component state
// ------------------------------------------------------------------------------------------------------------------------
const zoomManager   = ref<IZoomManager>(new DefaultZoomManager());
const zoomFactor    = ref(1);

const viewer        = ref();
const viewport      = ref<HTMLDivElement>();
const moveable      = ref();

const hGuides       = ref();
const vGuides       = ref();
const showRulers    = ref(true);
const guidesVisible = computed(() => showRulers.value && editable);
const hGuideValues  = ref<number[]>([]);       // Horizontal guides added by the user
const vGuideValues  = ref<number[]>([]);       // Vertical guides added by the user
const showGuides    = ref(true);               // Show or hide all the guides
const showInspector = ref(true);               // Show or hide all the guides
const showKeyboard  = ref(false);              // Show or hide all the guides

const selectedItem       = computed(() => targets.value.length === 1 ? getItemFromElement(targets.value[0]) : null );
const selectedItemActive = computed(() => targets.value.length > 0 && targets.value.every(el => getItemFromElement(el)?.locked === false) );

const shiftPressed   = useKeyModifier('Shift')
const historyManager = ref(new HistoryManager());
const currentTool    = ref(EditorTool.SELECT);

const creatingConnection = computed<boolean>(() => currentTool.value === EditorTool.CONNECTION && editable);

const items       = computed(() => elements.filter(e => isItem(e)) as Item[]);
const connections = computed(() => elements.filter(e => isConnection(e)) as ItemConnection[]);

const itemToPaste   = ref<Item[] | null> (null);
const inlineEditing = ref(false);


const horizontalGuidelines = computed(() => showGuides.value ? (viewportSize ? [0, viewportSize[1]/2, viewportSize[1], ...hGuideValues.value] : hGuideValues.value) : []);
const verticalGuidelines   = computed(() => showGuides.value ? (viewportSize ? [0, viewportSize[0]/2, viewportSize[0], ...vGuideValues.value] : vGuideValues.value) : []);
const elementGuidelines    = () => viewport.value ? Array.prototype.slice.call(viewport.value!.querySelectorAll(".item"), 0).filter(n => !n.classList.contains('target')) : [];

const selectedConnection = ref<ItemConnection | null>(null);
const targets            = ref<HTMLDivElement[]>([]);
const objectToInspect    = ref<any | null>(null);

const hoverItem = ref<Item | null>(null);


// Temporary variables
// ------------------------------------------------------------------------------------------------------------------------
const origin: Frame = { x: 0, y: 0, w: 0, h: 0, z: 0, r: 0, borderRadius: 0, opacity: 1, clipType: ClipType.NONE, clipStyle: '' };


// Track mouse position within the viewport coordinates
const mouseCoords = ref<Position>({ x: 0, y: 0 });

function onMouseMove(e: any) { 
     if(!viewport.value) return;   
    //console.log('onMouseMove', e.srcElement, e.offsetX, e.offsetY, e);

    // Mouse position (it the viewport coordinates)
    const rect = viewport.value.getBoundingClientRect();
    mouseCoords.value.x = Math.floor((e.clientX - rect.left) / zoomFactor.value);
    mouseCoords.value.y = Math.floor((e.clientY - rect.top)  / zoomFactor.value);
}


let connectionInfo : { 
    startItem:  Item | null, 
    endItem:    Item | null,
    startPoint: ConnectionHandle,
    endPoint:   ConnectionHandle,
} = {
    startItem:  null, 
    endItem:    null,
    startPoint: ConnectionHandle.CENTER,
    endPoint:   ConnectionHandle.CENTER,
}

function onMouseOver(item: Item, e: MouseEvent) {
    if(!creatingConnection.value === true) return;
    hoverItem.value = item;
}

function onMouseLeave(item: Item, e: MouseEvent) {
    if(!creatingConnection.value === true) return;
    hoverItem.value = null;
}


function isDecoratorActive(item: Item, mustBeLocked: boolean = false) : boolean {
    return editable && !creatingConnection.value && item.id === selectedItem.value?.id && item.locked === mustBeLocked;
}

/**
 * Return TRUE when the diagram is editable, the user is creating a connection and the mouse is over the passed item
 */
function isConnectionHandleActive(item: Item, ignoreRotate?: boolean) : boolean {
    const active = editable && creatingConnection && item.id === hoverItem.value?.id

    return ignoreRotate ? active : active && (item.r === 0);
}


function selectConnection(connection: ItemConnection) {   
    selectNone();
    selectedConnection.value = connection;
    setObjectToInspect(connection);
}

function selectItem(item: Item | Item[] | HTMLDivElement[], e?: MouseEvent)  : void {
    
    selectedConnection.value = null;

    // Passing an array of items or DOM elements
    if(Array.isArray(item)) {
        if(item.length === 0) {
            selectNone(); 
            return;
        }
                
        updateInlineEditableText();

        // Is an array of DOM elements ?
        if(item[0] instanceof HTMLDivElement)
        {
            targets.value = item as HTMLDivElement[];
            setObjectToInspect(targets.value.length === 1 ? getItemFromElement(targets.value[0]) : null);
            return; 
        }

        // Is an array of Item
        targets.value = item.map(i => getElementFromItem(i as Item)) as HTMLDivElement[];
        setObjectToInspect(targets.value.length === 1 ? item[0] : null);
        return;        
    }

    // Passing a single Item to select
    const el = getElementFromItem(item as Item);
    if(!el) return;

    // Already selected?
    if(targets.value.includes(el)) return;

    console.log('selectItem', item, e);
        
    updateInlineEditableText();

    
    if(shiftPressed.value === true) {
        // Shift pressed? Add to selection another item
        targets.value.push(el);
        setObjectToInspect(null);        
    } else {
        // Shift NOT pressed: replace existing selection with a new item
        targets.value = [el];
        setObjectToInspect(item);        
    }

    console.log('selectItem(): changing targets', targets.value.length, targets.value);
   
    nextTick(() => { if(e) nextTick(() => moveable.value?.dragStart(e)); });
}

function selectNone() : void {
    updateInlineEditableText();

    targets.value = [];
    selectedConnection.value = null;

    setObjectToInspect(null);    
    console.log('### selectNone', targets.value);    
}

function updateInlineEditableText() {   
    inlineEditing.value = false;

    const target = getElementFromItem(selectedItem.value as Item);
    if(!target) return;

    const elementToEdit = target.querySelector('.diagram-item-inline-edit') as HTMLElement;
    if(!elementToEdit) return;

    console.log('updateInlineEditableText - updating text of current item');

    elementToEdit.removeAttribute('contenteditable');            
    if(selectedItem.value)  selectedItem.value.title = elementToEdit.innerHTML; 
}


// ---------------------------------------------------------------------------------------------------------------------
// Drag item
// ---------------------------------------------------------------------------------------------------------------------
function onDragStart(e: any) : void {
    if(!isItem(selectedItem.value)) return;
    
    const target = getElementFromItem(selectedItem.value);
    if(target && target.contentEditable === "true") {
        e.stopDrag();
        return;
    }

    console.log('onDragStart', e);

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

function onDragGroupStart(e: any) : void {

    console.log('onDragGroupStart', e);
    // Save current position of selected items
}

function onDragGroup(ev: any) : void {
    for(const e of ev.events) {
        const item = getItemFromElement(e.target);
        if(!item) continue;
        
        item.x = Math.floor(e.beforeTranslate[0]);
        item.y = Math.floor(e.beforeTranslate[1]);
        e.target.style.transform = e.transform;  
    }
}

function onDragGroupEnd(e: any) : void {
       console.log('onDragGroupEnd', e);

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
    if(isItem(selectedItem.value)) historyManager.value.execute(new ResizeCommand(selectedItem.value, { ...origin }, { ...selectedItem.value }));
}


function onResizeGroup(ev: any) : void {
    for(const e of ev.events) {
        const item = getItemFromElement(e.target);
        if(!item) continue;
        
        // console.log('onresize', e);
        item.x = Math.floor(e.drag.beforeTranslate[0]);
        item.y = Math.floor(e.drag.beforeTranslate[1]);
        item.w = Math.floor(e.width);
        item.h = Math.floor(e.height);

        e.target.style.transform = e.drag.transform;  
        e.target.style.width     = `${Math.floor(e.width)}px`;
        e.target.style.height    = `${Math.floor(e.height)}px`;
    }
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


function onRotateGroup(ev: any) : void {
    for(const e of ev.events) {
        const item = getItemFromElement(e.target);
        if(!item) continue;
        
        item.r = e.beforeRotate % 360;
        e.target.style.transform = e.drag.transform;
    }
}


// ---------------------------------------------------------------------------------------------------------------------
// Round item
// ---------------------------------------------------------------------------------------------------------------------
function onRoundStart(e: any) : void {
    if(isItem(selectedItem.value)) origin.borderRadius = selectedItem.value.borderRadius;
}

function onRound(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    selectedItem.value.borderRadius = parseInt(e.borderRadius) || 0;
    e.target.style.borderRadius = e.borderRadius;
}

function onRoundEnd(e: any) : void {
    if(isItem(selectedItem.value)) historyManager.value.execute(new RoundCommand(selectedItem.value, origin.borderRadius, selectedItem.value.borderRadius));        
}


// ---------------------------------------------------------------------------------------------------------------------
// Clip item
// ---------------------------------------------------------------------------------------------------------------------
function onClipStart(e: any) : void {
    if(!isItem(selectedItem.value)) return;
    console.log('onClipStart', e);
    
    origin.clipType  = e.clipType;
    origin.clipStyle = e.clipStyle;
    if(origin.clipStyle === ClipType.RECT || origin.clipStyle === ClipType.POLYGON || origin.clipStyle === ClipType.ELLIPSE) origin.clipStyle = '';
}

function onClip(e: any) : void {
    if(!isItem(selectedItem.value)) return;

    if (e.clipType === ClipType.RECT) e.target.style.clip = e.clipStyle; else e.target.style.clipPath = e.clipStyle;
    
    selectedItem.value.clipType  = e.clipType;    
    selectedItem.value.clipStyle = e.clipStyle;    
}

function onClipEnd(e: any) : void {
    console.log('onClipEnd', e);

    if(isItem(selectedItem.value)) historyManager.value.execute(new ClipCommand(selectedItem.value, origin.clipType, origin.clipStyle, selectedItem.value.clipType, selectedItem.value.clipStyle));
}


// ---------------------------------------------------------------------------------------------------------------------
// Synch viewer / guieds scrolling
// ---------------------------------------------------------------------------------------------------------------------
function onScroll(e: any) : void {
    if(e.ctrlKey) zoomFactor.value = e.deltaY < 0 ? zoomManager.value.zoomIn() : zoomManager.value.zoomOut();

    if(hGuides.value) { hGuides.value.scroll(e.scrollLeft); hGuides.value.scrollGuides(e.scrollTop);  }
    if(vGuides.value) { vGuides.value.scroll(e.scrollTop);  vGuides.value.scrollGuides(e.scrollLeft); }
}
 

/** Send the selected items to the bottom of the z-index */
function sendToBack() : void {
    if(targets.value.length === 0) return;

    const newZ = findMinZ(items.value as Item[]) - 1;

    const commands: Command[] = [];
    for(const e of targets.value) {
        const item = getItemFromElement(e);
        if(item) commands.push(new ChangeZOrderCommand(item, item.z, newZ))
    }
    historyManager.value.execute(new GroupCommand(commands));
}


/** Send the selected items to the top of the z-index */
function bringToFront() : void {
    if(targets.value.length === 0) return;

    const newZ = findMaxZ(items.value as Item[]) + 1;

    const commands: Command[] = [];
    for(const e of targets.value) {
        const item = getItemFromElement(e);
        if(item) commands.push(new ChangeZOrderCommand(item, item.z, newZ))
    }
    historyManager.value.execute(new GroupCommand(commands));
}

/** Delete current selected item / connection */
function deleteItem() {
    
    if(isConnection(selectedConnection.value)) {
        historyManager.value.execute(new DeleteCommand(elements, selectedConnection.value));
        selectNone();
        return;
    }


    // Are there any items selected (1 or more)
    if(targets.value.length > 0) {
        const commands: Command[] = [];
        for(const e of targets.value) {
            const itemToDelete = getItemFromElement(e);
            if(itemToDelete) commands.push(new DeleteCommand(elements, itemToDelete))
        }
        historyManager.value.execute(new GroupCommand(commands));
        selectNone();
    }
} // func

/** Undo last action done (is possible) */
function undo() {  
    if(!historyManager.value.canUndo()) return;
    
    historyManager.value?.undo(); 
    selectNone();
}

/** Redo last undoed action (is possible) */
function redo() {  
    if(!historyManager.value.canRedo()) return;

    historyManager.value?.redo(); 
}

/** Select the current tool to use (selection, connection, text, image, ...) */
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

/** Handle a click on the connection handles */
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

    const newConnection = deepClone(createConnection(
        ci.startItem.id, 
        ci.endItem.id, 
        { from: { handle: ci.startPoint }, to: { handle: ci.endPoint } }
    ));
    
    ci.startItem = null;
    ci.endItem   = null;

    historyManager.value.execute(new AddConnectionCommand(elements, newConnection));
    emit('add-connection', newConnection);
}


function onPropertyChange(p: ObjectProperty, oldValue: any, newValue: any) {
    if(oldValue === newValue) return;
    
    console.log('onPropertyChange', p, 'Old value:', oldValue, 'New value:', newValue);

    
    if(selectedItem.value) historyManager.value.execute(new ChangePropertyCommand(selectedItem.value, p.name, oldValue, newValue));

    nextTick(() => moveable.value?.updateRect());
}

/** Handle zoom changes from the zoom toolbar */
function onZoomChanged(newZoomFactor: number, scrollViewerToCenter?: boolean) {
    console.log('onZoomChanged', newZoomFactor, scrollViewerToCenter);
    zoomFactor.value = newZoomFactor;
    
    if(scrollViewerToCenter === true) nextTick(() => viewer.value?.scrollCenter());
}

/** Setup all the keyboard shortcuts */
function setupKeyboardHandlers() {
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

    function onKey(keys: string | string[], handler: (e: KeyboardEvent) => void) {
        onKeyStroke(keys, (e) => {
            if(document.activeElement) {
                // console.log('active element', document.activeElement, e);
                if(['INPUT', 'SELECT'].includes(document.activeElement.tagName) || inlineEditing.value === true) return;
            }
            
            e.preventDefault();
            e.stopPropagation();
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
        if(targets.value.length > 0 || selectedConnection.value !== null) deleteItem(); 
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
    onKey(["t"], (e: KeyboardEvent) => selectCurrentTool(EditorTool.TEXT));             // T = Text tool
    onKey(["i"], (e: KeyboardEvent) => showInspector.value = !showInspector.value);     // I = Show/hide inspector
    onKey(["k"], (e: KeyboardEvent) => showKeyboard.value = !showKeyboard.value);       // K = Show/Hide keyboard help

    // R = Rectanble tool, CMD+R = Reload
    onKey(["r"], (e: KeyboardEvent) => isVirtualCtrl(e) ? window.location.reload() : selectCurrentTool(EditorTool.RECTANGLE));        

    // C = Connection tool, CMD+C = Copy
    onKey(["c"], (e: KeyboardEvent) => isVirtualCtrl(e) ? copyItem() : selectCurrentTool(EditorTool.CONNECTION));

     // CMD+X = Cut, CMD+V = Cut
    onKey(["x"], (e: KeyboardEvent) => { if(isVirtualCtrl(e)) cutItem();   });
    onKey(["v"], (e: KeyboardEvent) => { if(isVirtualCtrl(e)) pasteItem(); });


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

// Clipboard management
// ---------------------------------------------------------------------------------------------------------------------
function deepClone(obj: any) : any {
    return JSON.parse(JSON.stringify(obj));
}

function copyItem() {
    if(targets.value.length === 0) return;
     
    console.log('Copying items', targets.value);

    itemToPaste.value = targets.value.map(el => getItemFromElement(el)) as Item[];

    // TODO:  notify the user visually that the item has been copied
}

function cutItem() {
    if(!isItem(selectedItem.value)) return;
    
    console.log('Cutting item', selectedItem.value);
    itemToPaste.value = targets.value.map(el => getItemFromElement(el)) as Item[];
    deleteItem();
}

function pasteItem() {
    if(!itemToPaste.value) return;
    console.log('Paste item', selectedItem.value);

    const newItems = deepClone(itemToPaste.value) as Item[];

    const commands : Command[] = [];
    for(const newItem of newItems) {
        newItem.id = getUniqueId(); 
        newItem.x += 20;
        newItem.y += 20;
        commands.push(new AddItemCommand(elements, newItem));
    }
    const g = new GroupCommand(commands);
    historyManager.value.execute(g);
        
    itemToPaste.value = newItems;
    selectNone();
    nextTick(() => selectItem(newItems));        
}
// ---------------------------------------------------------------------------------------------------------------------

function getElementFromItem(item: Item) : HTMLDivElement | undefined{
    if(!item) return undefined;
    const el = viewport.value?.querySelector(`[data-item-id='${item.id}']`);
    if(el === undefined || el === null) return undefined;

    return el as HTMLDivElement;
}


function getItemFromElement(el: HTMLElement) : Item | undefined {
    if(!el) return undefined;
    const itemId = el.getAttribute('data-item-id');
    if(!itemId) return undefined;
    return getItemById(items.value, itemId)

}

function inlineEdit(item: Item) {
    const target = getElementFromItem(item);
    if(!target) return;

    // Find the child element with the 'diagram-item-inline-edit' CSS class (if any)
    const elementToEdit = target.querySelector('.diagram-item-inline-edit') as HTMLElement;
    if(elementToEdit) {
        elementToEdit.contentEditable = 'true';
        elementToEdit.focus(); 
        inlineEditing.value = true;       
    }
}

function getInspectorTitle() : string {    
    if(!objectToInspect.value) return "Inspector";

    const item = objectToInspect.value as Item;
    return `${item.component} (${item.id})`;
}

function getObjectToInspect() : [any, ObjectInspectorModel | null] {
    if(!objectToInspect.value) return [null, null];

    return [objectToInspect.value,  getItemBlueprint(objectToInspect.value.component)[1]]
}


function setObjectToInspect(item: Item | ItemConnection | undefined | null) : void {
    objectToInspect.value = null;
    nextTick(() => objectToInspect.value = item );        
}

function onSelectionDragStart(e: any) {
    console.log('onSelectionDragStart', e.selected);
}

function onSelection(e: any) {
    console.log('onSelection', e.selected);
    if(currentTool.value == EditorTool.SELECT) selectItem(e.selected);    
}

function onSelectionEnd(e: any) {
    console.log('onSelectionEnd', e);

    if(currentTool.value == EditorTool.SELECT) {
        selectItem(e.selected); 
        return;
    }

    // Clicking in the canvas resets the current connection creation
    if(currentTool.value === EditorTool.CONNECTION) return;

    
    // If the current tool is not the SELECTOR => Create new item based on current tool selection (shape, ...)
    // Clicking the canvas with other tools => create a new item of related type
    const toolDef = getToolDefinition(currentTool.value);   
        
    const newItem = deepClone({
        ...getItemBlueprint(toolDef.itemType!)[0],
        id: getUniqueId(),
        x:  Math.floor(mouseCoords.value.x - e.rect.width  / zoomFactor.value),
        y:  Math.floor(mouseCoords.value.y - e.rect.height / zoomFactor.value), 
    })

    if(e.rect.width > 10 && e.rect.height > 10) {
        newItem.w = Math.floor(e.rect.width  / zoomFactor.value);
        newItem.h = Math.floor(e.rect.height / zoomFactor.value);
    }
    
    console.log('creating new item', toolDef, toolDef.itemType, newItem)
    historyManager.value.execute(new AddItemCommand(elements, newItem));

    // After adding the new item, change to tool to selection and select the new created item
    currentTool.value = EditorTool.SELECT;
    nextTick(() => selectItem(newItem))
    
    emit('add-item', newItem);
}
</script>


<style>
.diagram-item-inline-edit {
    outline: none;
}

.diagram-item-inline-edit:focus,
.diagram-item-inline-edit:focus-visible { 
    outline: 1px solid #4af;
}
</style>

<style scoped>
.editor-layout {
    position: relative;
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;    
    background-color: white;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.editor-toolbars {
    background-color: #2c2c2c;
    width: 100%;
    height: 30px;
    max-height: 30px;
    min-height: 30px;
    display: flex;
}

.editor-canvas {
    display: flex;
    flex-direction: row;
    
    flex-grow: 1;
    width: 100%;
    height: 100%;
    background-color: white;
}

.inspector-container {
    min-width: 300px;
    width: 300px;
    background-color: #2c2c2c;
}

.editor-container {
    position: relative;
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;    
    background-color: white;
    flex-grow: 1;

}

.object-inspector-container {
    position: absolute;
    top: 80px;
    right: 20px;
    width: 300px;
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

.viewport-area {
    background-color: lightyellow;
    border: 2px dashed #ccc;
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
    background-color: #2c2c2c;
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
    width: 4px;
}

.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
 
    width: auto;
    height: auto;
    background-color: #2c2c2c;
    border: 0px solid #ccc;
    gap: 0px;
    user-select: none;
}

.toolbar-item {
    display: flex;
    justify-content: center;
    align-items: center; 
    cursor: pointer;
    width: 24px;
    padding: 4px;
    height: auto;
    text-align: center;
    background-color: #2c2c2c;
    color: #fafafa; 
    border: 0px;
}

.toolbar-item:disabled {
    color: #888; 
}

.toolbar-item:hover {
    background-color: #efefef;
    color: #4af;
}

.item {
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    left: 0px;
    text-align: center;
    font-weight: normal;
    font-size: 20px;
    font-family: Arial, Helvetica, sans-serif;
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
    line-height: 1.1;
}

.item .decorator-delete {
    top: 0px;
    right: -32px;
    width: 22px;
    height: 22px;
    font-size: 20px;
    cursor: pointer;
}

.item .decorator-duplicate {
    top: 30px;
    right: -32px;
    width: 22px;
    height: 22px;
    font-size: 20px;
    cursor: pointer;
}


.item .decorator-locked {
    top: 0px;
    right: -24px;
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
    background: #dde1e4;
    border: 0px;
    color: #555;
    line-height: 1;
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


.object-inspector-moveable {
    border: 0px;
    outline: 0px;
}
</style>

