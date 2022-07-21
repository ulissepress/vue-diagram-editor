
export interface IZoomManager {
    zoomReset()     : number;
    zoomIn()        : number;
    zoomOut()       : number;            
    getZoomFactor() : number;
}


export class DefaultZoomManager implements IZoomManager {

    private zooms = [5, 10, 25, 50, 75, 100, 125, 150, 200, 300, 400, 500];   // must contain the value 100
    private defaultZoomIndex = this.zooms.findIndex(v => v === 100);     
    private zoomIndex = this.defaultZoomIndex;

    zoomReset() : number { this.zoomIndex = this.defaultZoomIndex;                       return this.getZoomFactor(); }
    zoomIn()    : number { if(this.zoomIndex < this.zooms.length - 1) this.zoomIndex++;  return this.getZoomFactor(); }
    zoomOut()   : number { if(this.zoomIndex > 0) this.zoomIndex--; ;                    return this.getZoomFactor(); }
            
    getZoomFactor() : number { return this.zooms[this.zoomIndex] / 100; }
}

