import { App, CSSProperties } from "vue";
import { DiagramElement, Item } from "../types";

import Connection from "./Connection.vue";
import Ellipse from "./Ellipse.vue";
import Icon from "./Icon.vue";
import Image from "./Image.vue";
import Line from "./Line.vue";
import Rectangle from "./Rectangle.vue";
import Star from "./Star.vue";
import Text from "./Text.vue";
import Triangle from "./Triangle.vue";
import Widget from "./Widget.vue";

export function cssBorder(item: Item) : string {
    return item.border.width + 'px ' + item.border.style + ' ' + item.border.color
}

export function cssShadow(item: Item) : string {
    return item.shadow.enabled ? `${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px ${item.shadow.color}` : 'none'
}

export function cssDropShadow(item: Item) : string {
    return item.shadow.enabled ? `drop-shadow(${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px ${item.shadow.color})` : '' 
}

export function cssTextStyle(item: DiagramElement) : CSSProperties {
    let h: CSSProperties = {
        fontFamily:     item.textStyle.fontFamily,
        fontSize:       item.fontSize + "px",
        fontWeight:     item.textStyle.bold   ? 'bold'   : 'normal',
        fontStyle:      item.textStyle.italic ? 'italic' : 'normal',
        letterSpacing:  item.textStyle.letterSpacing + 'px',
        lineHeight:     item.textStyle.lineHeight,
        textDecoration: item.textStyle.decoration, 
        textTransform:  item.textStyle.transform, 
    };
    
    return h;
}

let basicBlocksRegistered = false
export function registerBasicBlocks(app: App) {
    if(basicBlocksRegistered) return;
    
    basicBlocksRegistered = true;
    app.component('Text',      Text);
    app.component('Line',      Line);
    app.component('Rectangle', Rectangle);
    app.component('Ellipse',   Ellipse);
    app.component('Triangle',  Triangle);
    app.component('Star',      Star);
    app.component('Image',     Image);
    app.component('Icon',      Icon);
    
    app.component('Connection',  Connection);
    app.component('Widget',      Widget);
    
} 