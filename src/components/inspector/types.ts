import TextEditor from './TextEditor.vue';
import Vue from 'vue';

export enum PropertyType {
    TEXT    = "text",
    NUMBER  = "number",
    BOOLEAN = "boolean",
    LIST    = "list",
}

export interface ObjectProperty {
    name:   string;         // Property name. Example: 'width'
    label?: string;         // Property label. Example: 'Width' (if not provided, name is used)

    type?:   PropertyType;   // Property type. Default: PropertyType.TEXT

    readonly?: boolean;      // Property is readonly. Default: false
    editor?:   Vue.Component;  // Custom editor component. Default: TextEditor    
}

export function getComponentEditor(propertyType: PropertyType) : Vue.Component {
    return TextEditor;
}

export interface InspectorSection {
    name:   string;                 // Section name. Example: 'general'
    title: string;                  // Section title. Example: 'General'
    properties: ObjectProperty[];   // Properties in this section.
}

export interface InspectorTab {
    title: string;                  // Tab title. Example: 'Style'
    sections: InspectorSection[];   // Sections in this tab
}

export interface ObjectInspectorModel {
    tabs: InspectorTab[];           // Tabs in the object inspector
}