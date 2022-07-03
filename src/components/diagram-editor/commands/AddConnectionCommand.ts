import { DiagramElement, ItemConnection } from '../types';

import Command from './Command';

export default class AddConnectionCommand implements Command {
    
    constructor(private elements: DiagramElement[], private newConnection: ItemConnection) {
    }
    
    do() : void  { this.elements.push(this.newConnection); }
    undo(): void { this.deleteElement(this.newConnection); }

    deleteElement(el: DiagramElement) {
        let idx = this.elements.findIndex(v => v.id === el.id);
        if(idx !== -1) this.elements.splice(idx, 1)
    }
    
}