

// <UX_DataView :model="DataViewModel" :options="DataViewOptions">
//      <template #column-header-xxx>
//      </template>
//
//      <template #column-cell-xxx>
//      </template>
//
//      <template #column-footer-xxx>
//      </template>
//
//      ...
//
//
//      <template #card>
//      </template>
// </UX_DataView>

export interface DataViewModel {
    columns: DataViewColumn[]               // The columns definitions
    rows: any[];                            // The rows containing the data
}

export interface DataViewOptions {
    showHeaders: boolean;                   // First row is the table headers 
    customizeColumns: boolean;              // Users can show/hide columns 
    sort: boolean;                          // Users can sort columns (the ones that are sortable)
    search: boolean;                        // Users can filter data
}



export interface DataViewColumn {
    name: string;                                     // Column name. Example: 'city'
    label: string;                                    // The column label. Default = field name 
    field: string;                                    // The field path to use to read the column value. Examples: 'code', 'address.city'

    dataType: "auto" | "string" | "number" | "boolean" | "date";

    view: "text"     |          // Value is rendered as normal text
          "tag"      |          // Value is rendered as tag UI
          "checkbox" |          // Value is rendered as checkbox (value is 'converted' to a boolean value)
          "progress";           // Value is rendered as progress bar. Value must be a number in 0-100 range

    align: "auto " | "left" | "center" | "right";     // How to align cell content horizontally. Default = 'auto'

    width: string;                                    // The column width. Examples: 'auto', '150px'
    visible: boolean;                                 // If this column is visible. Default = true

    calculatedField?: CalculatedFieldFunction;        // If defined, the value rendered in the cell is calculated calling this function

    format: string | FormatFunction;                  // How to format the value. Examples: '#,##0.00' or 'dd-mmm-yyyy'

    sortable: boolean;                                // The column is sortable
    sortFunction?: SortFunction;                      // the function used in the sort to compare values

    filterable: boolean;                              // The data can be filtered by the values of this column
}

export type CalculatedFieldFunction = (row: any, rowIndex: number, model: DataViewModel) => any;
export type FormatFunction          = (value: any) => string;
export type SortFunction            = (value1: any, value2: any, row: any) => number;