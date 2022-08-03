import { ObjectInspectorModel, ObjectProperty, PropertyType } from './types';

import BooleanEditor from './property-editors/BooleanEditor.vue';
import ColorEditor from './property-editors/ColorEditor.vue';
import IconListEditor from "././property-editors/IconListEditor.vue";
import NumberEditor from './property-editors/NumberEditor.vue';
import RangeEditor from './property-editors/RangeEditor.vue';
import SelectEditor from './property-editors/SelectEditor.vue';
import TextEditor from './property-editors/TextEditor.vue';
import Vue from 'vue';

const editorsRegistry : Record<PropertyType | string, Vue.Component> = {};


export function registerEditor(propertyType: PropertyType | string, editor: Vue.Component) {
    editorsRegistry[propertyType] = editor;
}

export function getEditorForProperty(propertyType: PropertyType | string) : Vue.Component {
    const editor = editorsRegistry[propertyType];
    if(!editor) {
        console.log(`No editor registered for property type: ${propertyType} - Returning default TextEditor`);
        return TextEditor;
    }

    return editor;
}



let alreadyRegistered = false;
export function registerPredefinedEditors()
{
    // Check if already registered
    if(alreadyRegistered) return;
    
    alreadyRegistered = true;

    // Register predefined editors
    registerEditor(PropertyType.TEXT,      TextEditor);
    registerEditor(PropertyType.NUMBER,    NumberEditor);
    registerEditor(PropertyType.RANGE,     RangeEditor);
    registerEditor(PropertyType.BOOLEAN,   BooleanEditor);
    registerEditor(PropertyType.COLOR,     ColorEditor);
    registerEditor(PropertyType.SELECT,    SelectEditor);
    registerEditor(PropertyType.ICON_LIST, IconListEditor);
    
}


export function getGenericInpectorModel(obj: any, title?: string, sectionTitle?: string) : ObjectInspectorModel {

    const properties: ObjectProperty[] = [];

    for(const key in obj) {
        let p : ObjectProperty = {
            name: key, label: key, type: PropertyType.TEXT,  editorFullsize: true
        }

        let v = obj[key];

        if(typeof(v) === 'number')  p.type = PropertyType.NUMBER;
        if(typeof(v) === 'boolean') p.type = PropertyType.BOOLEAN;

        if(typeof(v) === 'string' && v.match(/#[0-9a-fA-F]{6,8}/))  p.type = PropertyType.COLOR;


        properties.push(p);            
    }

    const model: ObjectInspectorModel = {
        singleColumn: true,
        tabs: [ 
            {
                title: title || "Information",
                sections: [        
                    {   
                        name: "info",
                        title: sectionTitle || "Information",
                        properties,
                    },     
                ] // sections
            },
        ]
    }
    
    return model;
}


export function getSimpleInpectorModel(obj: any, properties: ObjectProperty[], title?: string, sectionTitle?: string) : ObjectInspectorModel {

    const model: ObjectInspectorModel = {
        singleColumn: true,
        tabs: [ 
            {
                title: title || "Information",
                sections: [        
                    {   
                        name: "info",
                        title: sectionTitle || "Information",
                        properties,
                    },     
                ] // sections
            },
        ]
    }
    
    return model;
}