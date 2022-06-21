export type DiagramElement = Item | ItemConnection;
export interface Item {
    id:    string;
    title: string;
    
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    r: number;

    borderRadius: number;
    
    supportsRoundable: boolean;
    supportsResizable: boolean;

    background: string;

    component?:        string;
    componentOptions?: any;

    locked?: boolean;
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

export interface ItemConnection {
    id: string;
    from: string;
    to: string;
    type: ConnectionType;
    style: ConnectionStyle;
    thick: number;
    color: string;
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