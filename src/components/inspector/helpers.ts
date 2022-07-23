import BooleanEditor from './property-editors/BooleanEditor.vue';
import ColorEditor from './property-editors/ColorEditor.vue';
import IconListEditor from "././property-editors/IconListEditor.vue";
import NumberEditor from './property-editors/NumberEditor.vue';
import { PropertyType } from './types';
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