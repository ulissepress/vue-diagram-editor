import ICommand from './ICommand';
import { Item } from '../ItemUtils';

export default class ResizeCommand implements ICommand {

    private newSize: [number, number] = [0, 0];

    constructor(private item: Item, private oldSize: [number, number]) {
        this.newSize = [item.w, item.h];
    }

    do() : void {
        this.item.w = this.newSize[0];
        this.item.h = this.newSize[1];        
    }

    undo(): void {
        this.item.w = this.oldSize[0];
        this.item.h = this.oldSize[1];        
    }
}
