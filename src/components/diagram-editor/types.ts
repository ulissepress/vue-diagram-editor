// export type DiagramElement = Item | ItemConnection;
export interface DiagramElement {
    id:     string;
    title:  string;
    z:      number;
}

export interface Item extends DiagramElement {
    x: number;      // X coordinate (in px)
    y: number;      // Y coordinate (in px)
    w: number;      // width (in px)
    h: number;      // height (in px)
    r: number;      // rotation angle (in degrees)

    borderRadius: number;           // border radius (in px)
    
    supportsRoundable: boolean;     // The item can be rounded (user can change border radius)
    supportsResizable: boolean;     // The item can be resized

    background: string;             // The item background color

    component: string;              // The Vue component used to render tihs item
    componentOptions?: any;         // The Vue component options / config

    locked: boolean;                // The item is locked (cannot be moved / resized / rotated / ...)
}

export interface ItemConnection extends DiagramElement {
    from:   string;
    to:     string;
    type:   ConnectionType;
    style:  ConnectionStyle;
    thick:  number;
    color:  string;
}


export enum ConnectionType {
    LINE  = "line",
    CURVE = "curve"
}


export enum ConnectionStyle {
    SOLID  = "solid",
    DASHED = "dashed",
    DOTTED = "dotted"
}



export enum EditorTools {
    SELECTION = 'selection',
    TEXT      = 'text',
    SHAPE     = 'shape',
    IMAGE     = 'image',
    WIDGET    = 'widget',
    
    CONNECTION = 'connection'
}


export function isItem(e: DiagramElement) : e is Item {
    return "x" in e;
} 

export function isConnection(e: DiagramElement) : e is ItemConnection {
    return "from" in e;
} 