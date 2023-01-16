
export type FormulaValue = { 
    $:       string;                // The formula expression  
    server?: boolean;               // If TRUE the expression will be evaluated server-side (instead of client side)
};

export type StringValue  = string  | FormulaValue;
export type NumberValue  = number  | FormulaValue;
export type BooleanValue = boolean | FormulaValue;
export type DateValue    = Date    | FormulaValue;


// Form schema definition
export interface FormSchema {
    name:  string;                  // Form name (if omitted will be generated automatically)
    title: StringValue;             // The form title (optional). Example: 'My Form'

    tabs:   FormTab[]               // The list of fields belonging to the form
}

export interface FormTab {
    name?:    string;               // Tab name (if omitted will be generated automatically) 
    title:    StringValue;          // Tab label. Example: 'My tab'
    
    sections: FormSection[]         // Form sections in this form tab
}

export interface FormSection {
    name?:  string;                 // Section name (if omitted will be generated automatically)
    title:  StringValue;            // Tab label. Example: 'My tab'

    fields: FormField[]             // Form sections in this form tab
}

export enum FieldType {
    TEXT     = "text",              // Simple text (1 line, textbox)
    LONGTEXT = "longtext",          // Long text (multilime, textarea)
    HTML     = "html",              // Long text (HTML editor)
    EMAIL    = "email",             // Simple text, email format
    URL      = "url",               // Simple text, URL format (http://, https://)
    HIDDEN   = "hidden",            // A string value saved in an hidden field
    PASSWORD = "password",          // A password value
    
    INTEGER  = "integer",           // An integer value. Example: 10
    DECIMAL  = "decimal",           // A float value. Example: 10.81
    CURRENCY = "currency",          // A float value. Example: 10.99

    BOOLEAN  = "boolean",           // A true/false value

    TIME     = "time",              // A time value. Example: 17:56:23
    DATE     = "date",              // A date value. Example: 2022-08-29
    DATETIME = "datetime",          // A datetime value. Example: 2022-08-29T17:56:23
    DURATION = "duration",          // A duration value. Example: days:hours:minutes:seconds

    LIST     = "list",              // A value selected from a list of allowed values
    USER     = "user",              // A user (typically his/her email)
    TAGS     = "tags",              // A list of 0 or more tags (free text)
 
    FILE     = "file",              // A file uploaded by the user
    IMAGE    = "image",             // An image uploaded by the user
    GALLERY  = "gallery",           // Multiple images uploaded by the user
}

export enum FieldWidth {
    SMALL  = "sm",                  // Field will take 25% of the space
    MEDIUM = "md",                  // Field will take 50% of the space
    LARGE  = "lg",                  // Field will take 75% of the space
    XLARGE = "xl",                  // Field will take 100% of the space
}


// A form field definition
export interface FormField {
    name:           string;          // Field name (supporting path traversal). Example: 'code', 'font.size', 'customer.address.city'
    type:           string;          // The field type. Default = TEXT
    label:          StringValue;     // Field label
    width:          FieldWidth;      // The field width

    helpText:       StringValue;     // An help text displayed below the field    

    visible:        BooleanValue;    // If TRUE the field will be visible (default = true) 
    disabled:       BooleanValue;    // If TRUE the field will be disabled (default = false) 

    prefixIcon:     StringValue;     // Prefix icon
    suffixIcon:     StringValue;     // Suffix icon

    multipleValues: BooleanValue;    // If TRUE the user can enter N values for this field. Default = false
}


export interface TextFormField extends FormField {
    defaultValue:      StringValue;
    textTransform:     "none" | "lowercase" | "uppercase" | "capitalize";
}

export interface NumberFormField extends FormField {
    defaultValue:  NumberValue;    
    decimals:      NumberValue;   // Default = 0
    min:           NumberValue;
    max:           NumberValue;
}


export interface DateFormField extends FormField {
    defaultValue:  DateValue;
    format:        StringValue;   // The date format. Default = 'dd MMM yyyy'
}