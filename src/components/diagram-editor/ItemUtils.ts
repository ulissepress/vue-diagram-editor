import { ConnectionStyle, ConnectionType, Item, ItemConnection } from "./types";

let counter = 0;

export default new class ItemUtils {
    createItem(item?: Partial<Item>) : Item {
        return {
            id: "ID" + (++counter),
            title: "Item " + counter,
            
            x: Math.floor(Math.random() * 400),
            y: Math.floor(Math.random() * 200),
            w: 100 + Math.floor(Math.random() * 400),
            h: 50  + Math.floor(Math.random() * 200),
            z: 0,
            r: 0,

            borderRadius: 0,
            supportsRoundable: true,
            supportsResizable: true,

            background: `hsl(${Math.floor(Math.random() * 500) }, 90%, 50%)`,
            component: 'Shape',

            ...item
        } as Item
    }

    createConnection(from: string, to: string, options?: Partial<ItemConnection>) : ItemConnection {
        return {
            id: "ID" + (++counter),
            from,
            to,
            type:  ConnectionType.LINE,
            style: ConnectionStyle.SOLID,
            thick: 2,
            color: "#333",
            
            ...options
        } as ItemConnection
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
