import Command from './Command';
import { Item } from '../types';

export default class RotateCommand implements Command {

    private newAngle: number = 0;

    constructor(private item: Item, private oldAngle: number, private newAngle: number) {}

    do()  : void { this.item.r = this.newAngle; }
    undo(): void { this.item.r = this.oldAngle; }
}
