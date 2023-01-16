import { Component } from "vue";
import { FieldType } from "./types";
import XTextEditor from './XTextEditor.vue';

const registry: Record<FieldType | string, [Component, any]> = {};

export function registerEditor(fieldType: FieldType | string, component: Component, componentOptions: any = {}): void {
    registry[fieldType] = [component, componentOptions];
}

export function getEditorForFieldType(fieldType: FieldType | string): [Component, any] {
    const c = registry[fieldType];
    if(!c) throw new Error('No editor registered for field type ' + fieldType)

    return c;
}


let initialized = false;
export function registerBuiltinEditors() {
    if(initialized) return;

    initialized = true;
    registerEditor(FieldType.TEXT, XTextEditor);
}
