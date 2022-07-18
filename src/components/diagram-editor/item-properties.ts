import { ConnectionStyle, ConnectionType } from './types';
import { InspectorTab, PropertyType } from '../inspector/types';
import { ObjectInspectorModel, ObjectProperty } from './../inspector/types';

export const id$    : ObjectProperty = { name: "id",     label: "ID",   type: PropertyType.TEXT,  editorFullsize: true, readonly: true, formatValue: (p, obj) => obj[p.name] + ' (' + obj.component + ')' };
export const title$ : ObjectProperty = { name: "title",  label: "Text", type: PropertyType.TEXT,  editorFullsize: true };

export const fontSize$ : ObjectProperty = { name: "fontSize", label: "Font Size",  type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 4, max: 120, step: 1 } };

export const backColor$ : ObjectProperty = { name: "backgroundColor",  label: "Back Color", type: PropertyType.COLOR };
export const textColor$ : ObjectProperty = { name: "textColor",        label: "Text Color", type: PropertyType.COLOR };
export const locked$    : ObjectProperty = { name: "locked",           label: "Locked",     type: PropertyType.BOOLEAN };


export const x$ : ObjectProperty = { name: "x", label: "X",      type: PropertyType.NUMBER };
export const y$ : ObjectProperty = { name: "y", label: "Y",      type: PropertyType.NUMBER };
export const w$ : ObjectProperty = { name: "w", label: "Width",  type: PropertyType.NUMBER };
export const h$ : ObjectProperty = { name: "h", label: "Height", type: PropertyType.NUMBER };

export const rotate$  : ObjectProperty = { name: "r",             label: "Rotation",  type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: -360, max: 360, step: 1 }};
export const radius$  : ObjectProperty = { name: "borderRadius",  label: "Radius",    type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 0,    max: 100, step: 1 }};
export const opacity$ : ObjectProperty = { name: "opacity",       label: "Opacity %", type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 0,    max: 100, step: 1 }};

const otherTab : InspectorTab =
{
    title: "Other",
    sections: [
        {
            name: "comp_info",
            title: "Component Info",
            properties: [
                { name: "component", label: "Component", type: PropertyType.TEXT, editorFullsize: true, readonly: true }
            ] // props
        } // section
    ] // sections
}; // tab


export const basicModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Style",
                    properties: [id$, backColor$, opacity$, locked$]
                },         
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, rotate$] 
                }, 
                
            ] // sections
        },
        otherTab
    ]
}



export const shapeModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Text and style",
                    properties: [ id$, title$, fontSize$, backColor$, textColor$, opacity$, locked$]
                },         
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, rotate$, radius$] 
                }, 
                
            ] // sections
        },
        otherTab
    ]
}

export const shapeWithTextModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Text and style",
                    properties: [ id$, title$, fontSize$, backColor$, textColor$, opacity$, locked$ ]
                },         
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, rotate$, radius$] 
                }, 
                
            ] // sections
        },
        otherTab
    ]
}



export const connectionModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Style",
                    properties: [ 
                        { name: "type",  label: "Type",  type: PropertyType.SELECT, editorFullsize: true, editorOptions: { items: [ ConnectionType.LINE, ConnectionType.CURVE] }},
                        { name: "style", label: "Style", type: PropertyType.SELECT, editorFullsize: true, editorOptions: { items: [ ConnectionStyle.SOLID, ConnectionStyle.DASHED, ConnectionStyle.DOTTED] }},
                        { name: "thick", label: "Thick", type: PropertyType.RANGE,  editorFullsize: true, editorOptions: { min: 1, max: 10, step: 1 }},
                        
                        { name: "backgroundColor",  label: "Color", type: PropertyType.COLOR }
                    ]
                },         
            ] // sections
        } // tab
    ] // tabs
}

