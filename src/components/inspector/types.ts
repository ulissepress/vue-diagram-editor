import Vue from 'vue';

export enum PropertyType {
    TEXT      = "text",
    NUMBER    = "number",
    BOOLEAN   = "boolean",
    SELECT    = "select",
    COLOR     = "color",
    RANGE     = "range",
    ICON_LIST = "iconlist"
}

export interface ObjectProperty {
    name:   string;         // Property name. Example: 'width'
    label?: string;         // Property label. Example: 'Width' (if not provided, name is used)

    type?:   PropertyType;   // Property type. Default: PropertyType.TEXT

    readonly?: boolean;         // Property is readonly. Default: false
    formatValue?: (object: any, property: ObjectProperty, value: any) => string; // Function to format the value. Default: value => value.toString()

    editor?:           Vue.Component;   // Custom editor component. Default: TextEditor    
    editorOptions?:    any              // Config options to pass to the editor component
    editorFullsize?:   boolean;         // If true the editor will take the full row (not 50%). Default: false
    editorRightAlign?: boolean;         // Alignement of the editor on the right. Default: false
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