import { basicModel, connectionModel, imageModel, lineModel, shapeModel, shapeWithoutRadiusModel, textModel } from './item-properties';
import { ClipType, ConnectionHandle, ConnectionMarker, ConnectionStyle, ConnectionType, ImageItem, Item, ItemConnection, LineItem, Position, TextHAlign, TextVAlign } from "./types";

import { StyleValue } from "vue";

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;


/**
 * Return an unique ID (use current time + random number)
 */
 export function getUniqueId(prefix: string = 'id_') : string {
    const base = 36;
    return prefix + Date.now().toString(base) + '_' + randomInt(1, 100000).toString(base);
}

/**
 * Return a random number between min and max (included)
 */
export function randomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getItemStyle(item: Item) : StyleValue {
    let t = `translate(${item.x}px, ${item.y}px)`;
    if(item.r !== 0) t += ` rotate(${item.r}deg)`

    const style: StyleValue = {
        "width":            item.w + 'px',
        "height":           item.h + 'px',
        "zIndex":           item.z,
        "backgroundColor":  item.component ? "transparent" : item.backgroundColor,
        "transform":        t
    }

    if(item.clipType !== ClipType.NONE) item.clipType === ClipType.RECT ? style.clip = item.clipStyle : style.clipPath = item.clipStyle;
    return style;
}

export function getItemById(items: Item[], id: string) : Item | undefined {
    return items.find(n => n.id == id);
}

export function createItem(item?: DeepPartial<Item>) : Item {
    return {
        id: getUniqueId(),
        title: "Item",
        component: 'Rectangle',
        
        x: randomInt(200, 500),
        y: randomInt(100, 300),
        w: randomInt(100, 500),
        h: randomInt(50, 300),
        z: 0,
        r: 0,

        borderRadius: 0,
        opacity: 100,
        
        clipType: ClipType.NONE,
        clipStyle: '',
        
        supportsRoundable: true,
        supportsResizable: true,
        supportsClippable: false,

        backgroundColor: '#bbbbbb',
        textColor: '#000000',
        fontSize: 14,
         
        textHAlign: TextHAlign.CENTER,
        textVAlign: TextVAlign.CENTER,
        
        border: {
            width: 0,
            style: ConnectionStyle.SOLID,
            color: '#333333',
        },
        
        shadow: false,
        locked: false,

        inspectorModel: shapeModel,

        ...item
    } as Item
}

export function createConnection(fromID: string, toID: string, c?: DeepPartial<ItemConnection>) : ItemConnection {
    return {
        id: getUniqueId(),
    
        component: 'Connection',

        from: { 
            item:   fromID, 
            handle: c?.from?.handle || ConnectionHandle.CENTER,
            marker: c?.from?.marker || ConnectionMarker.NONE
        },
        
        to: { 
            item:   toID, 
            handle: c?.to?.handle || ConnectionHandle.CENTER,
            marker: c?.to?.marker || ConnectionMarker.NONE
        },
        
        type:  c?.type  || ConnectionType.LINE,
        style: c?.style || ConnectionStyle.SOLID,
        thick: c?.thick || 1,

        backgroundColor: c?.backgroundColor || "#333",

        inspectorModel: connectionModel,
        
    } as ItemConnection
}

export function deleteItemInArray(items: any[], item: any) {
    items.splice(items.indexOf(item), 1)
}

export function findMinZ(items: Item[]): number {
    let min = items[0].z;
    for(let v of items) if(v.z < min) min = v.z;
    return min;
}
    
export function findMaxZ(items: Item[]): number {
    let max = items[0].z;
    for(let v of items) if(v.z > max) max = v.z;
    return max;
}


// Shape medata definitions
const registry: Record<string, Item> = {};

export function registerItemType<T extends Item>(item: T, asName?: string) {
    registry[item.component || asName || ''] = item;
}

export function getItemBlueprint(type: string): Item {
    if(!registry[type]) throw new Error("No item type registered with name: " + type);
    return registry[type];
}

let alreadyRegistered = false;
export function registerDefaultItemTypes() {
    if(alreadyRegistered) return;   // Already registered?
    
    alreadyRegistered = true;
    
    const defaults = {
        id:    "", 
        title: "",
        
        x: 100, 
        y: 100, 
        w: 200, 
        h: 50, 
        z: 0, 
        r: 0, 
        borderRadius: 0,
        opacity: 100,

        clipType: ClipType.NONE,
        clipStyle: '',

        supportsRoundable: false,
        supportsResizable: true,
        

        backgroundColor: "#00ff00",
        textColor: "#111111",
        fontSize: 14,
        
        locked: false,
        
        textHAlign: TextHAlign.CENTER,
        textVAlign: TextVAlign.CENTER,

        border: {
            width: 0,
            style: ConnectionStyle.SOLID,
            color: '#333333',
        },

        shadow: false,
        
        inspectorModel: basicModel  
    };


    // ----------------------------------------------------------------------
    let type = "Text"
    registerItemType({
        ...defaults,
        title: "Hello World",
        backgroundColor: "transparent",
        textColor: "#333333",

        component: type,

        inspectorModel: textModel,
    });

    // ----------------------------------------------------------------------
    type = "Line"
    registerItemType<LineItem>({
        ...defaults,

        component: type,

        backgroundColor: "#111111",
        
        style: ConnectionStyle.SOLID,
        thick: 2,
        
        inspectorModel: lineModel,
    });


    // ----------------------------------------------------------------------
    type = "Rectangle"
    registerItemType({
        ...defaults,
        
        component: type,
        supportsRoundable: true,
        inspectorModel: shapeModel,
    })

    // ----------------------------------------------------------------------
    type = "Ellipse"
    registerItemType({
        ...defaults,
        component: type,

        w: 90,
        h: 70,
        backgroundColor: '#324759',
        textColor: "#FFFFFF",
        inspectorModel: shapeWithoutRadiusModel,
    })

    // ----------------------------------------------------------------------
    type = "Triangle"
    registerItemType({
        ...defaults,
        component: type,

        w: 90,
        h: 70,
        backgroundColor: '#ff0000',
        inspectorModel: shapeWithoutRadiusModel,
    })

    // ----------------------------------------------------------------------
    type = "Star"
    registerItemType({
        ...defaults,
        component: type,

        w: 70,
        h: 70,
        backgroundColor: '#ff0000',
        textColor: "#333333",
        inspectorModel: shapeWithoutRadiusModel,
    })


    // ----------------------------------------------------------------------
    type = "Image"
    registerItemType<ImageItem>({
        ...defaults,
        w: 220,
        h: 150,
        component: type,
        supportsRoundable: true,
        
        url: 'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80',        // 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
        fit: "cover",

        flip: "none",        

        filtersEnabled: false,
        filters: {
            brightness: 100,
            contrast:   100,
            saturate:   100,
            grayscale:  0,
            hue:        0,
            invert:     0,
            sepia:      0,
            blur:       0,
        },
        inspectorModel: imageModel
    })    
} // func


export function getHandlePosition(item: Item, cp: ConnectionHandle): Position {
    // If item is rotated always use the center handle
    if(item.r !== 0) return { x: item.x + item.w / 2, y: item.y + item.h / 2 };

    if(cp === ConnectionHandle.LEFT)        return { x: item.x,              y: item.y + item.h / 2 };
    else if(cp === ConnectionHandle.RIGHT)  return { x: item.x + item.w,     y: item.y + item.h / 2 };
    else if(cp === ConnectionHandle.TOP)    return { x: item.x + item.w / 2, y: item.y              };
    else if(cp === ConnectionHandle.BOTTOM) return { x: item.x + item.w / 2, y: item.y + item.h     };
    else /*  ConnectionHandle.CENTER */     return { x: item.x + item.w / 2, y: item.y + item.h / 2 };    
}
