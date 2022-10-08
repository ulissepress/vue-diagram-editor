import { BooleanValue, FieldType, FieldWidth, FormField, FormSchema, FormSection, FormTab } from './types';

import { getUniqueId } from '../diagram-editor/helpers';

let tabCounter = 1;

// Singleton
export default new class XFormUtils {

    createForm(form?: Partial<FormSchema>) : FormSchema {
        return {
            name:  form?.name  || getUniqueId('form_'),
            title: form?.title || '',
            tabs:  form?.tabs  || []
        }
    }

    createTab(tab?: Partial<FormTab>) : FormTab {
        return {
            name:     tab?.name     || getUniqueId('formtab_'), 
            title:    tab?.title    || "Tab " + (tabCounter++),
            sections: tab?.sections || []  
        }
    }

    createSection(section?: Partial<FormSection>) : FormSection  {
        return {
            name:     section?.name   || getUniqueId('formsection_'), 
            title:    section?.title  || "Section " + (tabCounter++),
            fields:   section?.fields || []  
        }
    }

    createField(name: string, field?: Partial<FormField>) : FormField  {

        const toBool = (v: BooleanValue | undefined | null, defaultValue: boolean) : BooleanValue => {
            if(v === undefined || v === null) return defaultValue;
            return v;
        }
        
        return {
            name,            
            type:           field?.type             || FieldType.TEXT,
            label:          field?.label            || name,
            width:          field?.width            || FieldWidth.XLARGE,
            helpText:       field?.helpText         || '',
            prefixIcon:     field?.prefixIcon       || '',
            suffixIcon:     field?.suffixIcon       || '',
            visible:        toBool(field?.visible,  true),
            disabled:       toBool(field?.disabled, false),
            multipleValues: toBool(field?.multipleValues, false),
        }
    }
}