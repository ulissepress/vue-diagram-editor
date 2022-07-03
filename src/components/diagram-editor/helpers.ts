import { ConnectionPoint, ConnectionStyle, ConnectionType, Item, ItemConnection, Position } from "./types";

export function getUniqueId(prefix: string = 'id_') : string {
    const base = 36;
    return prefix + Date.now().toString(base) + '_' + randomInt(1, 10000).toString(base);
}


export function createItem(item?: Partial<Item>) : Item {
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
        supportsRoundable: true,
        supportsResizable: true,

        backgroundColor: `hsl(${randomInt(0, 500) }, 90%, 50%)`,
        
        locked: false,

        ...item
    } as Item
}

export function createConnection(from: string, to: string, options?: Partial<ItemConnection>) : ItemConnection {
    return {
        component: 'Connection',

        id: getUniqueId(),
        from,
        to,
        type:  ConnectionType.LINE,
        style: ConnectionStyle.SOLID,
        thick: 1,
        color: "#333",
        
        ...options
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

export function registerItemType(item: Item, asName?: string) {
    registry[item.component || asName || ''] = item;
}

export function getItemBlueprint(type: string): Item {
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

        supportsRoundable: false,
        supportsResizable: true,

        backgroundColor: "green",
        textColor: "black",
        
        locked: false
    };


    // ----------------------------------------------------------------------
    let type = "Text"
    registerItemType({
        ...defaults,
        title: "Hello World",

        component: type,
    });

    // ----------------------------------------------------------------------
    type = "Line"
    registerItemType({
        ...defaults,

        component: type,
        componentOptions: {
            style: ConnectionStyle.SOLID,
            thick: 2,
        }
    });


    // ----------------------------------------------------------------------
    type = "Rectangle"
    registerItemType({
        ...defaults,
        
        component: type,
        supportsRoundable: true,
    })

    // ----------------------------------------------------------------------
    type = "Ellipse"
    registerItemType({
        ...defaults,
        component: type,

        w: 90,
        h: 70,
        backgroundColor: 'lightblue',
    })

    // ----------------------------------------------------------------------
    type = "Triangle"
    registerItemType({
        ...defaults,
        component: type,

        w: 90,
        h: 70,
        backgroundColor: 'red',
    })

    // ----------------------------------------------------------------------
    type = "Star"
    registerItemType({
        ...defaults,
        component: type,

        w: 70,
        h: 70,
        backgroundColor: 'pink',

    })


    // ----------------------------------------------------------------------
    type = "Image"
    registerItemType({
        ...defaults,
        w: 300,
        h: 200,
        component: type,
        componentOptions: {
            src: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
        },
        supportsRoundable: true,
    })    
} // func

/**
 * Return a random number between min and max
 */
export function randomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getHandlePosition(item: Item, cp: ConnectionPoint): Position {
    // If item is rotated always use the center handle
    if(item.r !== 0) return { x: item.x + item.w / 2, y: item.y + item.h / 2 };

    if(cp === ConnectionPoint.LEFT)        return { x: item.x,              y: item.y + item.h / 2 };
    else if(cp === ConnectionPoint.RIGHT)  return { x: item.x + item.w,     y: item.y + item.h / 2 };
    else if(cp === ConnectionPoint.TOP)    return { x: item.x + item.w / 2, y: item.y              };
    else if(cp === ConnectionPoint.BOTTOM) return { x: item.x + item.w / 2, y: item.y + item.h     };
    else /*  ConnectionPoint.CENTER */     return { x: item.x + item.w / 2, y: item.y + item.h / 2 };    
}
