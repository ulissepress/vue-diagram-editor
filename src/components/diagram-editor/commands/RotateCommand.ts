import Command from './Command';
import { Item } from '../ItemUtils';

export default class RotateCommand implements Command {

    private newAngle: number = 0;

    constructor(private item: Item, private oldAngle: number) {
        this.newAngle = item.r;
    }

    do() : void {
        this.item.r = this.newAngle;
    }

    undo(): void {
        this.item.r = this.oldAngle;
    }
}
