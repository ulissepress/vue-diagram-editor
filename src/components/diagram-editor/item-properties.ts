import { ClipType, ConnectionStyle, ConnectionType, TextHAlign, TextVAlign } from './types';
import { InspectorTab, PropertyType } from '../inspector/types';
import { ObjectInspectorModel, ObjectProperty } from './../inspector/types';

export const separator$ : ObjectProperty = { name: "" };

export const id$    : ObjectProperty = { name: "id",     label: "ID",   type: PropertyType.TEXT,  editorFullsize: true, readonly: true, formatValue: (p, obj) => obj[p.name] + ' (' + obj.component + ')' };
export const title$ : ObjectProperty = { name: "title",  label: "Text", type: PropertyType.TEXT,  editorFullsize: true };

export const fontSize$ : ObjectProperty = { name: "fontSize",     label: "Font Size",  type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 4, max: 120, step: 1 } };

export const textHAlign$ : ObjectProperty = { 
    name: "textHAlign",  label: "H Align",  type: PropertyType.ICON_LIST, editorOptions: { 
    items: [ { name: TextHAlign.LEFT,   icon: "format_align_left"   }, 
             { name: TextHAlign.CENTER, icon: "format_align_center" },
             { name: TextHAlign.RIGHT,  icon: "format_align_right"  } ] 
}};

export const textVAlign$ : ObjectProperty = { 
    name: "textVAlign",  label: "V Align",  type: PropertyType.ICON_LIST, editorRightAlign: true, editorOptions: {
    items: [ { name: TextVAlign.TOP,    icon: "vertical_align_top"     }, 
             { name: TextVAlign.CENTER, icon: "vertical_align_center"  },
             { name: TextVAlign.BOTTOM, icon: "vertical_align_bottom"  } ] 
}};

export const backColor$ : ObjectProperty = { name: "backgroundColor",  label: "Back Color", type: PropertyType.COLOR };
export const textColor$ : ObjectProperty = { name: "textColor",        label: "Text Color", type: PropertyType.COLOR, editorRightAlign: true };
export const locked$    : ObjectProperty = { name: "locked",           label: "Locked",     type: PropertyType.BOOLEAN };


export const x$ : ObjectProperty = { name: "x", label: "X",      type: PropertyType.NUMBER };
export const y$ : ObjectProperty = { name: "y", label: "Y",      type: PropertyType.NUMBER };
export const w$ : ObjectProperty = { name: "w", label: "Width",  type: PropertyType.NUMBER };
export const h$ : ObjectProperty = { name: "h", label: "Height", type: PropertyType.NUMBER };

export const rotate$  : ObjectProperty = { name: "r",             label: "Rotation",  type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: -360, max: 360, step: 1 }};
export const radius$  : ObjectProperty = { name: "borderRadius",  label: "Radius",    type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 0,    max: 100, step: 1 }};
export const opacity$ : ObjectProperty = { name: "opacity",       label: "Opacity %", type: PropertyType.RANGE, editorFullsize: true, editorOptions: { min: 0,    max: 100, step: 1 }};

export const borderSection$ = {   // Border
    name: "border",
    title: "Border",
    properties: [
        { name: "border.width",  label: "Width", type: PropertyType.RANGE,     editorFullsize: true, editorOptions: { min: 0, max: 50, step: 1 } },
        { name: "border.color",  label: "Color", type: PropertyType.COLOR,     editorFullsize: true },
        { name: "border.style",  label: "Style", type: PropertyType.ICON_LIST, editorFullsize: true, editorOptions: { 
            items: [ { name: ConnectionStyle.SOLID,  text: "Solid"  }, 
                     { name: ConnectionStyle.DASHED, text: "Dashed" },
                     { name: ConnectionStyle.DOTTED, text: "Dotted" } ] 
        }},
    ] 
}


const otherTab : InspectorTab =
{
    title: "Other",
    sections: [
        {
            name: "comp_info",
            title: "Component Info",
            properties: [
                id$,
                { name: "component", label: "Component", type: PropertyType.TEXT, editorFullsize: true, readonly: true },
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
                    properties: [backColor$, opacity$, locked$]
                },     
                borderSection$,  
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, separator$, rotate$] 
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
                    properties: [title$, fontSize$, textHAlign$, textVAlign$, separator$, backColor$, textColor$, opacity$, locked$]
                },         
                borderSection$,  
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, separator$, rotate$, radius$] 
                }, 
                
            ] // sections
        },
        otherTab
    ]
}

export const shapeWithoutRadiusModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Text and style",
                    properties: [title$, fontSize$, textHAlign$, textVAlign$, separator$, backColor$, textColor$, opacity$, locked$]
                },         
                borderSection$,  
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, separator$, rotate$] 
                }, 
                
            ] // sections
        },
        otherTab
    ]
}


export const imageModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Source and style",
                    properties: [ 
                        { name: "url", label: "URL", type: PropertyType.TEXT,   editorFullsize: true }, 
                        { name: "fit", label: "Fit", type: PropertyType.SELECT, editorFullsize: true, editorOptions: { items: [ "contain", "cover", "fill", "none"] }},

                        opacity$, locked$, 
                        { 
                            name: "clipType",  label: "Clipping",  type: PropertyType.ICON_LIST, editorRightAlign: true, editorOptions: {
                            items: [ { name: ClipType.NONE,    icon: "image"     }, 
                                     { name: ClipType.RECT,    icon: "rectangle" },
                                     { name: ClipType.ELLIPSE, icon: "circle"    } ] 
                        }}                    
                    ]
                },         
                borderSection$,  
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, separator$, rotate$, radius$] 
                }, 
                
            ] // sections
        },
        otherTab
    ]
}

export const textModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Text and style",
                    properties: [title$, fontSize$, textHAlign$, textVAlign$, separator$, backColor$, textColor$, opacity$, locked$ ]
                },         
                borderSection$,  
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, separator$, rotate$, radius$] 
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
                        { name: "type",  label: "Type",  type: PropertyType.ICON_LIST, editorOptions: { 
                            items: [ { name: ConnectionType.LINE,  icon: "horizontal_rule" }, 
                                     { name: ConnectionType.CURVE, icon: "conversion_path" } ] 
                        }},
                        { name: "backgroundColor",  label: "Color", type: PropertyType.COLOR },
                        { name: "style",  label: "Style",  type: PropertyType.ICON_LIST, editorFullsize: true, editorOptions: { 
                            items: [ { name: ConnectionStyle.SOLID,  text: "Solid"  }, 
                                     { name: ConnectionStyle.DASHED, text: "Dashed" },
                                     { name: ConnectionStyle.DOTTED, text: "Dotted" } ] 
                        }},
                        separator$,
                        { name: "thick", label: "Thick", type: PropertyType.RANGE,  editorFullsize: true, editorOptions: { min: 1, max: 10, step: 1 }},                        
                    ]
                },         
            ] // sections
        } // tab
    ] // tabs
}


export const lineModel: ObjectInspectorModel = {
    tabs: [ 
        {
            title: "Style",
            sections: [        
                {   // Style
                    name: "style",
                    title: "Style",
                    properties: [ 
                        { name: "thick", label: "Thick", type: PropertyType.RANGE,  editorFullsize: true, editorOptions: { min: 1, max: 10, step: 1 }},                        
                        { name: "style",  label: "Style", type: PropertyType.ICON_LIST, editorFullsize: true, editorOptions: { 
                            items: [ { name: ConnectionStyle.SOLID,  text: "Solid"  }, 
                                     { name: ConnectionStyle.DASHED, text: "Dashed" },
                                     { name: ConnectionStyle.DOTTED, text: "Dotted" } ] 
                        }},
                        { name: "backgroundColor",  label: "Color", type: PropertyType.COLOR }
                    ]
                },
                {   // Position & size
                    name: "pos_size",
                    title: "Position and size",
                    properties: [x$, y$, w$, h$, rotate$] 
                }, 

            ] // sections
        } // tab
    ] // tabs
}
