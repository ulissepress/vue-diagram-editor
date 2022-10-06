import { BooleanValue, FormulaValue, NumberValue, StringValue } from './types';

export function isFormulaValue(v: any): v is FormulaValue {
    return typeof(v) !== 'object' && ('$' in v);
}

export function isServerFormula(v: any): boolean {
    return isFormulaValue(v) && v.server === true;
}

export function isClientFormula(v: any): boolean {
    return isFormulaValue(v) && v.server !== true;
}

export function isScalarValue(v: any): v is string|number|boolean {
    return !isFormulaValue(v);
}


export function isString(v: any): v is string {
    return typeof(v) === 'string';
}

export function isNumber(v: any): v is number {
    return typeof(v) === 'number';
}

export function isBoolean(v: any): v is boolean {
    return typeof(v) === 'boolean';
}

export function isDate(v: any): v is Date {
    return v instanceof Date;
}

export function isEmpty(v: any) : boolean {
    return    v === undefined 
           || v === null 
           || (isString(v)       && v === '') 
           || (Array.isArray(v)  && v.length === 0);
} 


export function resolveStringValue(v: StringValue): string {
    if(isFormulaValue(v)) {
        let r: any = evaluateFormula(v.$);
        return isString(r) ? r : ('' + r);
    }
    else {
        return v;
    }
}

export function resolveNumberValue(v: NumberValue): number {
    if(isFormulaValue(v)) {
        let r: any = evaluateFormula(v.$);
        if(isNumber(r)) return r;
        
        try { return parseFloat(r); } catch(err: any) { return 0; }
    }
    else {
        return v;
    }
}

export function resolveBooleanValue(v: BooleanValue): boolean {
    if(isFormulaValue(v)) {
        let r: any = evaluateFormula(v.$);
        return isBoolean(r) ? r : ('' + r) === 'true';
    }
    else {
        return v;
    }
}


export function evaluateFormula(expr: string, ctx: any = {}): any {
    return (new Function('context', 'return ' + expr))(ctx);
}

