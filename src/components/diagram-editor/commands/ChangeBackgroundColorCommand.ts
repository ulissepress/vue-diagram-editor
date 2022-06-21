import Command from './Command';
import { DiagramElement } from './../types';

export default class ChangeBackgroundColorCommand implements Command {

    constructor(private item: DiagramElement, private oldColor: string, private newColor: string) {}

    do()  : void { this.item.backgroundColor = this.newColor; }
    undo(): void { this.item.backgroundColor = this.oldColor; }
}
