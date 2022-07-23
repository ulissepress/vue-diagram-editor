import { ClipType, Item } from '../types';

import Command from './Command';

export default class ClipCommand implements Command {

    constructor(private item: Item, private oldClipType: ClipType, private oldClipStyle: string, private newClipType: ClipType, private newClipStyle: string) {}
    
    do() : void  { 
        this.item.clipType  = this.newClipType;
        this.item.clipStyle = this.newClipStyle; 
    }
    
    undo(): void { 
        this.item.clipType  = this.oldClipType;
        this.item.clipStyle = this.oldClipStyle; 
    }
}
