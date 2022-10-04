import Command from './Command';
import { DiagramElement } from '../types';
import { setObjectValue } from '../../inspector/property-editors/utils';

export default class ChangePropertyCommand implements Command {

    constructor(private element: DiagramElement, private propertyName: string, private oldValue: any, private newValue: any) {}

    do()   : void { setObjectValue(this.element, this.propertyName, this.newValue); }
    undo() : void { setObjectValue(this.element, this.propertyName, this.oldValue); }
}
