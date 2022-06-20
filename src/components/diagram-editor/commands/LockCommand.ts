import ICommand from './ICommand';
import { Item } from '../ItemUtils';

export class LockCommand implements ICommand {

    constructor(private item: Item) {}

    do()  : void { this.item.locked = true;  }
    undo(): void { this.item.locked = false; }
}

export class UnlockCommand implements ICommand {

    constructor(private item: Item) {}

    do()  : void { this.item.locked = false; }
    undo(): void { this.item.locked = true;  }
}
