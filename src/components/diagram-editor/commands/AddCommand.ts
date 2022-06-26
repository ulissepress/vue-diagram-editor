import Command from './Command';
import { DiagramElement } from '../types';
import { Item } from './../types';

export default class AddCommand implements Command {
    
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