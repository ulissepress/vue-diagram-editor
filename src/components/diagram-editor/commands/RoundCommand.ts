import Command from './Command';
import { Item } from '../types';

export default class RoundCommand implements Command {

    constructor(private item: Item, private oldBorderRadius: number, private newBorderRadius: number) {}
    
    do() : void  { this.item.borderRadius = this.newBorderRadius; }
    undo(): void { this.item.borderRadius = this.oldBorderRadius; }
}
