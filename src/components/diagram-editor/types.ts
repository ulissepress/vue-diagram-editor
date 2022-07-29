
export interface Position {
    x: number;              // X Coordinate
    y: number;              // Y Coordinate
}

export interface Rect extends Position {
    w: number;              // Width
    h: number;              // Height
}

export interface Frame extends Rect {
    z: number;              // Z-Index
    r: number;              // Rotation angle
    borderRadius: number;   // Border radius
    opacity: number;        // Opacity (0=full transparent, 100=full opaque). Default = 100
    
    clipType: ClipType;     // Frame clip type
    clipStyle: string;      // Frame clip path
}



export interface DiagramElement {
    id:     string;             // The unique element ID
    title:  string;             // The element title / label
    z:      number;             // The element z-index
    
    backgroundColor:  string;   // The element background color (item background, connection stroke color)
    textColor:        string;   // The element text color (text inside the element, etc.)
    opacity:          number;   // Opacity (0=full transparent, 100=full opaque). Default = 100

    fontSize:        number;    // The element text font size
    shadow:          boolean;   // Show/hide element shadow  
    
    component:         string;  // The Vue component used to render this element
    componentOptions?: any;     // The Vue component options / config
}

export interface Item extends DiagramElement {
    x: number;      // X coordinate (in px)
    y: number;      // Y coordinate (in px)
    w: number;      // Width (in px)
    h: number;      // Height (in px)
    r: number;      // Rotation angle (in degrees)
    
    borderRadius: number;           // border radius (in px)
    clipType: ClipType;             // The item clip type (rect or ellipse)
    clipStyle: string;              // Item clipping path
    
    supportsRoundable: boolean;     // The item can be rounded (user can change border radius)
    supportsResizable: boolean;     // The item can be resized (user can change width / height)

    locked: boolean;                // The item is locked (cannot be moved / resized / rotated / ...)

    textHAlign: TextHAlign;
    textVAlign: TextVAlign;

    border: ItemBorder;
}

export enum TextHAlign {
    LEFT   = "flex-start",
    CENTER = "center",
    RIGHT  = "flex-end",
}

export enum TextVAlign {
    TOP    = "flex-start",
    CENTER = "center",
    BOTTOM = "flex-end",
}


export enum ClipType {
    NONE    = "none",
    RECT    = "rect",
    POLYGON = "polygon",
    ELLIPSE = "ellipse"
}
export interface ItemBorder {
    width: number;
    style: ConnectionStyle
    color: string;
}

export interface ConnectionPoint {
    item:   string;                   // The item ID which this connection point is referring to
    handle: ConnectionHandle;         // The handle this point is connected to
    marker: ConnectionMarker;         // The marker used by this connection point
}

export interface ItemConnection extends DiagramElement {
    from:     ConnectionPoint;       // The connection starting point
    to:       ConnectionPoint;       // The connection ending point
    
    type:     ConnectionType;        // The connection type (line, curve, ...)
    style:    ConnectionStyle;       // The connection style (solid, dashed, ...)

    thick:    number;                // The connection thickness (in px)
}

export enum ConnectionHandle {
    TOP    = "top",
    BOTTOM = "bottom",
    LEFT   = "left",
    RIGHT  = "right",
    CENTER = "center"
}

export enum ConnectionMarker {
    NONE   = "none",
    CIRCLE = "circle",
    SQUARE = "square",
    ARROW  = "arrow"    
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

export enum EditorTool {
    SELECT     = 'select',
    TEXT       = 'text',
    IMAGE      = 'image',
    LINE       = 'line',
    RECTANGLE  = 'rectangle',
    TRIANGLE   = 'triangle',
    ELLIPSE    = 'ellipse',
    STAR       = 'star',
    WIDGET     = 'widget',
    ICON       = 'icon',
    CONNECTION = 'connection'
}

export interface ToolDefinition {
    type:   EditorTool | "separator";
    title?: string;
    icon?:  string;
    
    itemType?: string
}

export const toolDefinitions: ToolDefinition[] = [
    { type: EditorTool.SELECT,     title: 'Select',     icon: 'ads_click' },    
    { type: 'separator' },    
    { type: EditorTool.CONNECTION, title: 'Connection', icon: 'share',           itemType: "Connection"},
    { type: 'separator' },    
    { type: EditorTool.TEXT,       title: 'Text',       icon: 'text_fields',     itemType: "Text"      },
    { type: EditorTool.IMAGE,      title: 'Image',      icon: 'image',           itemType: "Image"     },
    { type: 'separator' },    
    { type: EditorTool.LINE,       title: 'Line',       icon: 'horizontal_rule', itemType: "Line"      },
    { type: EditorTool.RECTANGLE,  title: 'Rectangle',  icon: 'rectangle',       itemType: "Rectangle" },
    { type: EditorTool.ELLIPSE,    title: 'Ellipse',    icon: 'circle',          itemType: "Ellipse"   },
    { type: EditorTool.TRIANGLE,   title: 'Triangle',   icon: 'change_history',  itemType: "Triangle"  },
    { type: EditorTool.STAR,       title: 'Star',       icon: 'grade',           itemType: "Star"      },
    { type: EditorTool.ICON,       title: 'Icon',       icon: 'portrait',        itemType: "Icon"      },
    { type: 'separator' },
    { type: EditorTool.WIDGET,     title: 'Widgets',    icon: 'view_in_ar' },
];

export function getToolDefinition(toolType: EditorTool) : ToolDefinition {
    const t = toolDefinitions.find(t => t.type === toolType);
    if(!t) throw new Error("Invalid tool type: " + toolType);
    return t;
} 


export function isItem(e: DiagramElement | undefined | null) : e is Item {
    return e !== null && e != undefined && "x" in e;
} 

export function isConnection(e: DiagramElement | undefined | null) : e is ItemConnection {
    return e !== null && e != undefined && "from" in e;
} 


export interface LineItem extends Item {
    thick: number;
    style: ConnectionStyle;
}


export interface ImageItem extends Item {
    url: string;
    fit: "contain" | "cover" | "fill" | "none";

    flip: "none" | "horizontal" | "vertical" | "both";

    filtersEnabled: boolean;
    filters?: {
        blur:       number;     // 0px-10px,    default = 0,    step 1
        grayscale:  number;     // 0% to 100%,  default = 0%,   step 1
        brightness: number;     // 0% to 200%,  default = 100%, step 1
        contrast:   number;     // 0% to 200%,  default = 100%, step 1
        hue:        number;     // 0 to 360,    default = 0,    step 1
        invert:     number;     // 0% to 100%,  default = 0%,   step 1
        saturate:   number;     // 0% to 200%,  default = 0%,   step 1
        sepia:      number;     // 0% to 100%,  default = 0%,   step 1
    }
}


export interface WidgetDefinition {
    type:      string;          // The widget type. Example: 'my_shape
    label:     string;          // The widget label. Example: 'My Shape'
    descr:     string;          // The widget description. Example: 'A shape with rounded borders'
    thumbnail: string;          // The widget thumbnail. Example: 'my_shape.png'
  
    component:         string;  // The Vue component used to render this widget
    componentOptions?: any;     // The default Vue component options used to instantiate this widget

    canBeResized?: boolean;     // Is the widget resizable? Default: true
}



