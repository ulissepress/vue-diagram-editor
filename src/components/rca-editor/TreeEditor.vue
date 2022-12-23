<template>
    <div class="editor-container" @click="selectNode(null)">
        <div v-if="treeNodes" v-for="node in treeNodes" :key="node.id"
        
            draggable          = "true"
            @dragover.prevent  = ""   
            @dragenter.prevent = "(e: DragEvent) => hoveredNode = node"
            @dragleave.prevent = "(e: DragEvent) => hoveredNode = null"
            
            @dragstart         = "(e: DragEvent) => { 
                log('### drag-start from node', node.data!.title); 
                draggedNode = node;  
            }"
            
            @dragend.prevent   = "(e: DragEvent) => { 
                if(hoveredNode === undefined || hoveredNode === null) 
                    log('### drag cancelled') 
                else log('### drag-end to node', hoveredNode?.data!.title)

                draggedNode = null;
                hoveredNode = null;
            }"


            @mouseenter = "hoveredNode = node"
            @mouseleave = "hoveredNode = null"
            @click.stop = "selectNode(node)"
            :class = "{ 
                'node':          true, 
                'node-selected': isSelectedNode(node),
                'node-hover':    isHoveredNode(node) && !isSelectedNode(node) && !dragging,
                'node-dragged-hover':  isHoveredNode(node) && dragging,
            }"
            :style = "{
                left:   (node.x + options.containerPaddingLeft) + 'px',
                top:    (node.y + options.containerPaddingTop)  + 'px',
                width:  options.nodeW + 'px',
                height: options.nodeH + 'px',
            }">
            {{ node.data?.title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { hierarchy } from 'd3-hierarchy';
import { computed, ref } from 'vue';
import { RCA_Model, RCA_Node } from './rca-models';
export interface TreeEditorProps {
    modelValue: RCA_Model,
}

export interface TreeEditorEvents {
    (e: 'update:modelValue', modelValue: RCA_Model ): void    
}


// Define Props
const { modelValue } = defineProps<TreeEditorProps>();

    // Define Events
const emit = defineEmits<TreeEditorEvents>();

// These data can be parametrized as component props
// -----------------------------------------------------
const options = {
    containerPaddingLeft : 10,
    containerPaddingTop  : 10,
    
    nodeW       : 80,
    nodeH       : 20,
    nodeWMargin : 30,
    nodeHMargin : 20,
}
// -----------------------------------------------------


const selectedNode = ref<RCA_Node | null>(null);
const hoveredNode  = ref<RCA_Node | null>(null);
const draggedNode  = ref<RCA_Node | null>(null);
const dragging     = computed(() => draggedNode.value !== null)

function log(...args:any) { console.log(...args);}

function selectNode(node: RCA_Node | null): void {
    log('Selected node', node);
    selectedNode.value = node;
}

function isSelectedNode(node: RCA_Node) : boolean {
    return selectedNode.value?.data?.id === node.data?.id;
}

function isHoveredNode(node: RCA_Node) : boolean {
    return hoveredNode.value?.data?.id === node.data?.id;
}



const treeNodes = computed<RCA_Node[]>(() => {
    console.log('recalculating nodes...')

    const root : any = hierarchy(modelValue.root)

    root.x    = 0;
    root.y    = 0;
    root.maxY = 0;
    layoutNodes(root);
    return root.descendants();
})

function layoutNodes(node: RCA_Node): number {
    if(!node.children) return node.maxY;

    // Get the current maxY from the parent node
    let currentMaxY = node.maxY;

    // Calculate coords for all direct children
    node.children.forEach( (n, index) => {
        n.x = n.depth * (options.nodeW + options.nodeWMargin);  

        // For the first child Y is the same of parent node, 
        // for the others is calculated using maxY of previous sibling
        n.y = (index === 0) ? node.maxY : node.children![index-1].maxY + (options.nodeH + options.nodeHMargin);

        // Initially set the maxY of the node to the current y...
        // ...but if the node has children, the maxY is recalculated recursively
        n.maxY = n.y;
        if(n.children) n.maxY = layoutNodes(n);

        // Update the maxY of overall children
        currentMaxY = Math.max(currentMaxY, n.maxY)
    })

    // Push the maxY of the children to the parent node
    node.maxY = currentMaxY;
    return currentMaxY;
}

</script>


<style scoped>
.editor-container {
    box-sizing: border-box;
    overflow: scroll;
    position: relative; 
    width: 100%; 
    height: 100%;
    border: 1px dashed blue; 
}
.node {
    position: absolute;
    background-color: white;
    border: 1px solid #aaa;
    border-radius: 4px;
    color: black;

    text-align: center;
    font-size: 14px;
    
    cursor: pointer;
    padding: 4px 8px;
}

.node-selected {
    outline: 2px solid #4af;
    background-color: rgb(237, 247, 255);

}

.node-hover {
    outline: 2px solid #4af;
}

.node-dragged-hover {
    outline: 2px dashed red;
}
</style>
