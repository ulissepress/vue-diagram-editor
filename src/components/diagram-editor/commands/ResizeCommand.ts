import Command from './Command';
import { Item } from '../types';

type Size = [number, number];

export default class ResizeCommand implements Command {

    constructor(private item: Item, private oldSize: Size, private newSize: Size) {}

    do() : void {
        this.item.w = this.newSize[0];
        this.item.h = this.newSize[1];        
    }

    undo(): void {
        this.item.w = this.oldSize[0];
        this.item.h = this.oldSize[1];        
    }
}
