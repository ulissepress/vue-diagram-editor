<template>
    <div style="width: 100%; height: 90%; margin: 20px auto; ">
      
        <div style="display: flex; width: 100%; height: 100%; border: 1px dashed gray; padding: 0px;">
            <HeaderLayout :options="{ height: '150px', sticky: true }">
                <template #header>
                    But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was 
                    born and I will give you a complete account of the system, and expound the actual teachings of the 
                    great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids 
                    pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure 
                    rationally encounter consequences that are extremely painful. Nor again is there anyone who loves<br/>
                    <p>or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances 
                    occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us 
                    ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right 
                    to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids
                    a pain that produces no resultant pleasure?</p>
                </template>
                
                <template #header-collapsed>
                    Now i am collapsed.<br>
                    But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was 
                    born and I will give you a complete account of the system, and expound the actual teachings of the 
                    great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids 
                    pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure 
                    rationally encounter consequences that are extremely painful. Nor again is there anyone who loves
                </template>

                <!-- main content -->
                <div v-html="loremIpsum(6)"></div>
             </HeaderLayout>

        </div>

        <div style="display: none; width: 100%; height: 100%; border: 1px dashed gray; padding: 8px;">
            <!-- <pre>{{ treeData }}</pre>  -->
            <TreeEditor v-model="treeModel"  />
        </div>

        <div style="display: none; width: 100%; height: 100%;">
            <pre>{{ formModel }}</pre> 
            <XForm v-model="formModel" :schema="formSchema" style="background: #dedede; padding: 16px;"/>
        </div>
       
        <!-- <pre>{{ elements.map(e => { return e.id + ' / ' + e.x + ' / '+ e.y + ' / '+ e.w + ' / '+ e.h }  ) }}</pre> -->
        <!-- <DiagramEditor v-if="showDiagramEditor"
                       :elements             = "elements"
                       :readonly             = "false" 
                       :customWidgets        = "true"
                       :customWidgetsCatalog = "widgets" /> 
        -->
        <!-- 
        <SvgEditor v-model="points" :editable="editable">
            <template #ui="{ points, editable }">
                <path v-if="editable" stroke="#aaa" stroke-width="1" fill="none" :d="`M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} M ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y}`" />
                <path stroke="red"  stroke-width="2" fill="none" :d="`M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y} `" />
                <path stroke="blue" stroke-width="2" fill="none" :d="polygonPath" />
            </template>
        </SvgEditor>
        <button @click="editable = !editable">EDIT MODE {{ editable }}</button> 
        -->
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, ref } from 'vue';
import { createConnection, createItem, registerWidgetType } from './components/diagram-editor/helpers';
import { ConnectionStyle, ConnectionType, DiagramElement, WidgetDefinition } from './components/diagram-editor/types';

import YouTubeWidget, { YoutubeWidgetItem } from './components/custom-widgets/YouTubeWidget.vue';
import { PropertyType } from './components/inspector/types';


import { RCA_Model, RCA_Node } from './components/rca-editor/rca-models';
import TreeEditor from './components/rca-editor/TreeEditor.vue';
import { FieldWidth, FormField } from './components/xform/types';
import XForm from './components/xform/XForm.vue';
import XFormUtils from './components/xform/XFormUtils';


import HeaderLayout from "./components/layouts/HeaderLayout.vue";

const treeData2 = {
    id: 'rootNode',
    title: 'Root',
    children: [
        createNode('A', [createNode('A1', [createNode('A11'), createNode('A12')]), createNode('A2'), createNode('A3'), createNode('A4'), createNode('A5')]),
        createNode('B', [createNode('B1'), createNode('B2'), createNode('B3')]),
        createNode('C', [createNode('C1'), createNode('C2')]),
        createNode('D'),
    ]
};

const treeData = {
    id: 'rootNode',
    title: 'Root',
    children: [
        createNode('A', [createNode('A1', [createNode('A11', [createNode('A111')])]), createNode('A2')]),
        createNode('B', [createNode('B1', [createNode('B1.1'), createNode('B1.2'), createNode('B1.3')]), createNode('B2'), createNode('B3', [createNode('B3.1', [createNode('B3.1.1'),createNode('B3.1.2'),createNode('B3.1.3'),createNode('B3.1.4')]), createNode('B3.2'), createNode('B3.3')]), createNode('B4')]),
        createNode('C', [createNode('C1'),createNode('C2', [createNode('C2.1'), createNode('C2.2'),createNode('C2.3')  ]),createNode('C3')]),
    ]
};

const treeModel = ref<RCA_Model>({
    id: 0,
    root: treeData
});


function createNode(title: string, children: RCA_Node[]|undefined = undefined) : RCA_Node {
    let n: RCA_Node = {
        id: Math.random().toString(36).substring(2),
        title,
        children
    }

    return n;
}

const showDiagramEditor = ref(false);

const formModel = ref({
    customer: 'Mario Rossi',
    address: {
        city: 'Catania',
        street: 'Piazza Roma, 14',
        zip: 95100
    }
});

const sectionAfields: FormField[] = [
    XFormUtils.createField("customer", {
        label:    "Customer Name", 
        helpText: "Put here the customer code", 
        width:    FieldWidth.LARGE 
    }),
    XFormUtils.createField("address.city", {
        label:    { $: "'Address of ' + context.model.customer"}, 
        helpText: "The customer address", 
        width:    FieldWidth.SMALL 
    }),
    XFormUtils.createField("field_a3", {
        label:    "Field A3", 
        helpText: { $: "context.model.customer + ' timestamp=' + new Date()*1" } , 
        width:    FieldWidth.MEDIUM, 
        visible:  { $: "context.model.address.city !== 'XXX'" }
    }),

    XFormUtils.createField("field_a4", {
        label:    "Field A4", 
        helpText: { $: "'Customer name is ' + context.model?.customer?.length + ' chars'" } , 
        width:    FieldWidth.MEDIUM,
    }),
];

const sectionBfields: FormField[] = [
    XFormUtils.createField("field_b1", { width: FieldWidth.XLARGE }),
    XFormUtils.createField("field_b2", { width: FieldWidth.MEDIUM }),
    XFormUtils.createField("field_b3", { width: FieldWidth.SMALL  }),
    XFormUtils.createField("field_b4", { width: FieldWidth.SMALL  }),
    XFormUtils.createField("field_b5", { width: FieldWidth.XLARGE }),
]

const sectionCfields: FormField[] = [
    XFormUtils.createField("field_c1a", { width: FieldWidth.SMALL }),
    XFormUtils.createField("field_c1b", { width: FieldWidth.LARGE }),
    XFormUtils.createField("field_c2"),
    XFormUtils.createField("field_c3", { width: FieldWidth.MEDIUM }),
    XFormUtils.createField("field_c4", { width: FieldWidth.MEDIUM }),
    XFormUtils.createField("field_c5", { width: FieldWidth.SMALL }),
    XFormUtils.createField("field_c6", { width: FieldWidth.SMALL }),
    XFormUtils.createField("field_c7", { width: FieldWidth.SMALL }),
    XFormUtils.createField("field_c8", { width: FieldWidth.SMALL }),
]

const tab1 = XFormUtils.createTab({ 
    title: 'Customer Data',
    sections: [
        XFormUtils.createSection({ title: "Section A", fields: sectionAfields }),
        XFormUtils.createSection({ title: "Section B", fields: sectionBfields }),
        XFormUtils.createSection({ title: "Section C", fields: sectionCfields }),
    ]
});

const tab2 = XFormUtils.createTab({ title: { $: " context.model.customer + ' Details'"}});

const formSchema = XFormUtils.createForm({
    name:  "my_form",
    //title: "Edit Customer",
    tabs:  [tab1, tab2, XFormUtils.createTab(), XFormUtils.createTab() ]
}); 


// const points = reactive([
//     { id: 'a', x: 100, y: 50  },
//     { id: 'b', x: 150, y: 100 },
//     { id: 'c', x: 250, y: 20  },
//     { id: 'd', x: 300, y: 100 }
// ]);


const vueApp = getCurrentInstance()!.appContext.app;

// Register YouTubeWidget and related props
vueApp.component('YouTubeWidget', YouTubeWidget)
registerWidgetType<YoutubeWidgetItem>('YouTubeWidget', 
    { 
        video_id: 'FT3ODSg1GFE',
        w: 560,
        h: 315,
    } as YoutubeWidgetItem, 
    [ { name: "video_id",   label: "Video ID",   type: PropertyType.TEXT,  editorFullsize: true } ]
);

const widgets: WidgetDefinition[] = [
    { title: 'YouTube Video',        icon: "smart_display",    component: "YouTubeWidget", canBeResized: true },
    { title: 'Google Map',           icon: "location_on",      component: "" },
    { title: 'Event Classification', icon: "description",      component: "" },    
    { title: 'Event Action',         icon: "description",      component: "" },    
    { title: 'Event Attachment',     icon: "description",      component: "" },    
    { title: '8D Action',            icon: "description",      component: "" },    
    { title: '8D Root Cause',        icon: "description",      component: "" },    
];

let elements: DiagramElement[] = reactive([
    createItem({ id: 'a1', title: 'Angelo', x: 100, y: 150, w: 100, h: 80, backgroundColor: '#ff0000', textColor: '#ffffff' }),
    createItem({ id: 'a2', title: 'Mario',  x: 600, y: 130, w: 90,  h: 90, backgroundColor: '#00ff00', textColor: '#2c2c2c' }),
    createItem({ id: 'a3', title: 'Luca',   x: 300, y: 400, w: 200, h: 70, backgroundColor: '#0000ff', textColor: '#f7ff2d' }),
    
    createConnection('a1', 'a2'),
    createConnection('a1', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DOTTED }),
    createConnection('a2', 'a3', { type: ConnectionType.CURVE, style: ConnectionStyle.DASHED, backgroundColor: "#ff0000", thick: 5 }),
]);

// const polygonPath = computed( () => {
//     let path = '';
//     for(let i = 0; i < points.length; i++) {
//         if(i === 0) path = `M ${points[0].x} ${points[0].y} `;
//         else path += `L ${points[i].x} ${points[i].y} `;
//     }

//     return path;
// })


function loremIpsum(n: number = 1) : string {
    let h = '';
    for(let i = 0; i<n; i++) h += `
        <div><strong><big>${i+1}</big></strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
           dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
           ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
           fugiat nulla pariatur.<br>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
           mollit anim id est laborum.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
           ex ea commodo consequat.</div><br/>`;
    return h;
}

</script>

