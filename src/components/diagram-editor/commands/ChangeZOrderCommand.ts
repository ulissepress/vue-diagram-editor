import Command from './Command';
import { DiagramElement } from './../types';

export default class ChangeZOrderCommand implements Command {

    constructor(private element: DiagramElement, private oldZ: number, private newZ: number) {}
    
    do() : void  { this.element.z = this.newZ; }
    undo(): void { this.element.z = this.oldZ; }
}
