
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

export interface ItemConnection {
    id: string,
    from: string,
    to: string
}

let counter = 0;

class _ItemUtils {
    createItem(title : string, component?: string, componentOptions?: any) : Item {
        if(!component) component = "Shape";

        return {
            id: "ID" + (++counter),
            title,
            
            x: Math.floor(Math.random() * 400),
            y: Math.floor(Math.random() * 200),
            w: 100 + Math.floor(Math.random() * 400),
            h: 50  + Math.floor(Math.random() * 200),
            z: 0,
            r: 0,

            borderRadius: 0,
            supportsRoundable: ['Shape', 'Image'].includes(component),

            supportsResizable: !['CustomShape'].includes(component),

            background: `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`,

            component,
            componentOptions
        }
    }

    deleteItem(items: Item[], item: Item) {
        items.splice(items.indexOf(item), 1)
    }

    findMinZ(items: Item[]): number {
        let min = items[0].z;
        for(let v of items) if(v.z < min) min = v.z;
        return min;
    }
    
    findMaxZ(items: Item[]): number {
        let max = items[0].z;
        for(let v of items) if(v.z > max) max = v.z;
        return max;
    }
}


export const ItemUtils = new _ItemUtils();
