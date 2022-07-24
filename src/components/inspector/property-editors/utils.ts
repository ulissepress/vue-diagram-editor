
export function getObjectValue(obj: any, path: string): any {
    if(obj === null || obj === undefined) return undefined;

    let parts = path.split('.');
    let value = obj;
    try {
        for(let part of parts) value = value[part];
        return value;        
    } catch (error) {
        console.log('getObjectValue(): error reading path: ' + path + '. Returning undefined');
        return undefined;
    }
}

export function setObjectValue(obj: any, path: string, value: any): void {
    if(obj === null || obj === undefined) return;

    let parts = path.split('.');
    let last = parts.pop() as string;
    let parent = obj;
    for(let part of parts) {
        if(!parent[part]) parent[part] = {};        // Create the subpath if it doesn't exist
        parent = parent[part];
    }
    parent[last] = value;
}