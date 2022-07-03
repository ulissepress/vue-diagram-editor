import { DiagramElement, Item } from '../types';

import Command from './Command';

export default class AddItemCommand implements Command {
    
    constructor(private elements: DiagramElement[], private elementToAdd: Item) {
        this.elementToAdd = { ... elementToAdd };
    }
    
    do() : void  {
        this.elements.push(this.elementToAdd);
}

    undo(): void { 
        this.deleteElement(this.elementToAdd);        
    } 


    deleteElement(el: DiagramElement) {
        let idx = this.elements.findIndex(v => v.id === el.id);
        if(idx !== -1) this.elements.splice(idx, 1)
    }
    
}