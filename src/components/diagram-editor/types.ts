export interface DiagramElement {
    id:     string;             // The unique element ID
    title:  string;             // The element title / label
    z:      number;             // The element z-index
    
    backgroundColor:  string;   // The element background color (item background, connection stroke color)
    
    component: string;          // The Vue component used to render this element
    componentOptions?: any;     // The Vue component options / config
}

export interface Item extends DiagramElement {
    x: number;      // X coordinate (in px)
    y: number;      // Y coordinate (in px)
    w: number;      // Width (in px)
    h: number;      // Height (in px)
    r: number;      // Rotation angle (in degrees)

    borderRadius: number;           // border radius (in px)
    
    supportsRoundable: boolean;     // The item can be rounded (user can change border radius)
    supportsResizable: boolean;     // The item can be resized

    textColor:        string;       // The item background color

    locked: boolean;                // The item is locked (cannot be moved / resized / rotated / ...)
}

export interface ItemConnection extends DiagramElement {
    from:      string;
    to:        string;
    
    fromPoint: ConnectionPoint;
    toPoint:   ConnectionPoint;

    type:      ConnectionType;
    style:     ConnectionStyle;

    thick:     number;
    color:     string;
}

export enum ConnectionPoint {
    TOP    = "top",
    BOTTOM = "bottom",
    LEFT   = "left",
    RIGHT  = "right",
    //CENTER = "center"
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
    SELECT = 'select',
    TEXT   = 'text',
    SHAPE  = 'shape',
    IMAGE  = 'image',
    WIDGET = 'widget',
    
    CONNECTION = 'connection'
}


export function isItem(e: DiagramElement | undefined | null) : e is Item {
    return e !== null && e != undefined && "x" in e;
} 

export function isConnection(e: DiagramElement | undefined | null) : e is ItemConnection {
    return e !== null && e != undefined && "from" in e;
} 


export interface WidgetDefinition {
    name:  string;              // The widget name. Example: 'my_shape
    label:  string;             // The widget label. Example: 'My Shape'
    icon:  string;              // The widget icon. Example: 'my_shape.png'
    component: string;          // The Vue component used to render this widget
    componentOptions?: any;     // The default Vue component options used to instantiate this widget

}
