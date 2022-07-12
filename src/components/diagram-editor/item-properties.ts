import { InspectorTab, PropertyType } from '../inspector/types';

import { ObjectInspectorModel } from './../inspector/types';

const styleTab : InspectorTab =  {
    title: "Style",
    sections: [

        // Style section
        // --------------------------------------------------
        {
            name: "style",
            title: "Text and style",
            properties: [
                { name: "id",               label: "ID",         type: PropertyType.TEXT, editorFullsize: true, readonly: true, formatValue: (p, obj) => obj[p.name] + ' (' + obj.component + ')' },
                { name: "title",            label: "Text",       type: PropertyType.TEXT, editorFullsize: true },
                { name: "fontSize",         label: "Font Size",  type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 4, max: 120, step: 1 } },
                { name: "backgroundColor",  label: "Back Color", type: PropertyType.COLOR  },
                { name: "textColor",        label: "Text Color", type: PropertyType.COLOR  },
                
            ] // props
        }, // section

        // Position & size section
        // --------------------------------------------------
        {
            name: "pos_size",
            title: "Position and size",
            properties: [
                { name: "x", label: "X",      type: PropertyType.NUMBER },
                { name: "y", label: "Y",      type: PropertyType.NUMBER },
                { name: "w", label: "Width",  type: PropertyType.NUMBER },
                { name: "h", label: "Height", type: PropertyType.NUMBER }
            ] // props
        }, // section

        // Rotation & Radius section
        // --------------------------------------------------
        {
            name: "rotation_radius",
            title: "Rotation & Radius",
            properties: [
                { name: "r",             label: "Rotation", type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: -360, max: 360, step: 1 } },
                { name: "borderRadius",  label: "Radius",   type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 0, max: 100, step: 1 } }
            ]
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