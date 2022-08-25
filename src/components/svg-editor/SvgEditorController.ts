import { Point } from './types';

export default class SvgEditorController {
    constructor(private points: Point[]) {
        console.log('>>>>>> SvgEditorController', points);
        
    }  

    updatePoint(id: string, x: number, y: number) {
        const p = this.points.find(p => p.id === id);
        if(p) {
            p.x = x;
            p.y = y;
        }
    }
}

export function controllerBindings(controller: SvgEditorController) {
    return {
        "update-point": controller.updatePoint
    }
} 