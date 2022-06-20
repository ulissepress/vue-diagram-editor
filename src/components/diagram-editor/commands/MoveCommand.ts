import Command from './Command';
import { Item } from '../ItemUtils';

export default class MoveCommand implements Command {

    private newPos: [number, number] = [0, 0];

    constructor(private item: Item, private oldPos: [number, number]) {
        this.newPos = [item.x, item.y];
    }

    do() : void {
        this.item.x = this.newPos[0];
        this.item.y = this.newPos[1];        
    }

    undo(): void {
        this.item.x = this.oldPos[0];
        this.item.y = this.oldPos[1];        
    }
}
