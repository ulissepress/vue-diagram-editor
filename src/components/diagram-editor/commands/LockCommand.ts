import Command from './Command';
import { Item } from '../types';

export class LockCommand implements Command {

    constructor(private item: Item) {}

    do()  : void { this.item.locked = true;  }
    undo(): void { this.item.locked = false; }
}

export class UnlockCommand implements Command {

    constructor(private item: Item) {}

    do()  : void { this.item.locked = false; }
    undo(): void { this.item.locked = true;  }
}
