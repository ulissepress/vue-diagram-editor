import { App, Component } from "vue";

import { FieldType } from "./types";

const registry: Record<FieldType | string, Component> = {};

export function registerEditor(fieldType: FieldType | string, component: Component): void {
    registry[fieldType] = component;
}

export function getEditorForFieldType(fieldType: FieldType | string): Component {
    const c = registry[fieldType];
    if(!c) throw new Error('No editor registered for field type ' + fieldType)

    return c;
}


let initialized = false;
export function registerBuiltinEditors(vueApp: App) {
    if(initialized) return;

    initialized = true;
    vueApp.component('xxx', {});
    vueApp.component('yyy', {});
}
