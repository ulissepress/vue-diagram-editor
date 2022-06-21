import Command from './Command';
import { Item } from '../types';

type Pos = [number, number];

export default class MoveCommand implements Command {

    constructor(private item: Item, private oldPos: Pos, private newPos: Pos) {}

    do() : void {
        this.item.x = this.newPos[0];
        this.item.y = this.newPos[1];        
    }

    undo(): void {
        this.item.x = this.oldPos[0];
        this.item.y = this.oldPos[1];        
    }
}
