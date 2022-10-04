import Command from './Command';

/** Composite pattern: a command containing a list of sub-commands */
export default class GroupCommand implements Command {
    
    constructor(private commands: Command[]) {}
    
    do() : void  { this.commands.forEach(c => c.do())   }
    undo(): void { this.commands.forEach(c => c.undo()) }

    
}