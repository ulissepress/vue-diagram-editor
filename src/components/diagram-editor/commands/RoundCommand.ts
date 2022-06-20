import ICommand from './ICommand';
import { Item } from '../ItemUtils';

export default class RoundCommand implements ICommand {

    private newRound: number = 0;

    constructor(private item: Item, private oldRound: number) {
        this.newRound = item.borderRadius;
    }

    do() : void {
        this.item.borderRadius = this.newRound;
    }

    undo(): void {
        this.item.borderRadius = this.oldRound;
    }
}
