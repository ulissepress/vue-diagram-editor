import Command from "./Command";

export default class HistoryManager {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    public canUndo() : boolean { return this.undoStack.length > 0 }
    public canRedo() : boolean { return this.redoStack.length > 0 }

    public execute(c: Command) {        
        c.do();
        this.undoStack.push(c);        
        this.redoStack = [];
        
        console.log('HistoryManager.execute', c.constructor.name, c);
    }

    public undo() {
        const c = this.undoStack.pop();
        if (!c) return;

        console.log('HistoryManager.undo', c.constructor.name, c);
        c.undo();
        this.redoStack.push(c);
    }

    public redo() {
        const c = this.redoStack.pop();
        if (!c) return;
        
        console.log('HistoryManager.redo', c.constructor.name, c);        
        c.do();
        this.undoStack.push(c);
    }    
}