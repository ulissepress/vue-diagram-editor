import { InspectorTab, PropertyType } from '../inspector/types';
import { ObjectInspectorModel, ObjectProperty } from './../inspector/types';

const id$    : ObjectProperty = { name: "id",     label: "ID",   type: PropertyType.TEXT,  editorFullsize: true, readonly: true, formatValue: (p, obj) => obj[p.name] + ' (' + obj.component + ')' };
const title$ : ObjectProperty = { name: "title",  label: "Text", type: PropertyType.TEXT,  editorFullsize: true };

const fontSize$ : ObjectProperty = { name: "fontSize", label: "Font Size",  type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 4, max: 120, step: 1 } };

const backColor$ : ObjectProperty = { name: "backgroundColor",  label: "Back Color", type: PropertyType.COLOR };
const textColor$ : ObjectProperty = { name: "textColor",        label: "Text Color", type: PropertyType.COLOR };


const x$ : ObjectProperty = { name: "x", label: "X",      type: PropertyType.NUMBER };
const y$ : ObjectProperty = { name: "y", label: "Y",      type: PropertyType.NUMBER };
const w$ : ObjectProperty = { name: "w", label: "Width",  type: PropertyType.NUMBER };
const h$ : ObjectProperty = { name: "h", label: "Height", type: PropertyType.NUMBER };

const rotate$  : ObjectProperty = { name: "r",             label: "Rotation",  type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: -360, max: 360, step: 1 }};
const radius$  : ObjectProperty = { name: "borderRadius",  label: "Radius",    type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 0,    max: 100, step: 1 }};
const opacity$ : ObjectProperty = { name: "opacity",       label: "Opacity %", type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 0,    max: 100, step: 1 }};

const styleTab : InspectorTab =  {
    title: "Style",
    sections: [        
        {   // Style
            name: "style",
            title: "Text and style",
            properties: [ id$, title$, fontSize$, backColor$, textColor$, opacity$ ]
        },         
        {   // Position & size
            name: "pos_size",
            title: "Position and size",
            properties: [x$, y$, w$, h$, rotate$, radius$] 
        }, 
        
    ] // sections
}; // tab

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

const model: ObjectInspectorModel = {
    tabs: [ styleTab, otherTab ]
}

export default model;