import { Item, Rect } from '../types';

import Command from './Command';

type Size = [number, number];

export default class ResizeCommand implements Command {

    constructor(private item: Item, private oldRect: Rect, private newRect: Rect) {}

    do() : void {
        this.item.x = this.newRect.x;
        this.item.y = this.newRect.y;
        this.item.w = this.newRect.w;
        this.item.h = this.newRect.h;         
    }

    undo(): void {
        this.item.x = this.oldRect.x;
        this.item.y = this.oldRect.y;
        this.item.w = this.oldRect.w;
        this.item.h = this.oldRect.h;         
    }
}
