
// Different envinomemts (DEV, TEST, QA, PROD, ...) will have their own dedicated db/schema
// Each organization/app will have it's own dedicated set of tables

export interface AppSchema {
    name:      string;           // Example: 'my_app'
    label:     string;           // Example: 'My App'
    entities:  EntitySchema[];
    relations: EntityRelation[];
}


export interface EntitySchema {
    name: string;           // Example: 'customer'
    label: string;          // Example: 'Customer'
    dbRef: string;          // Example: '<env>:<org>_<app>_<name>_<unique_id>'
    versioning: boolean;    // If TRUE each entity item will be versioned
    fields: EntityField[]   // List of dynamic fields for this entity
}

export type FieldScalarValue = string | number | boolean | Date;
export type FieldValue = FieldScalarValue | FieldScalarValue[];

export enum FieldType {
    TEXT     = "text", 
    LONGTEXT = "text", 
    INTEGER  = "integer", 
    FLOAT    = "float", 
    BOOLEAN  = "boolean", 
    DATE     = "date", 
    DATETIME = "datetime", 
    ENUM     = "enum"
}

export interface EntityField {
    name:  string;           // Example: "customerCode"
    label: string;          // Example: "Customer Code"
    type:  FieldType;
    defaultValue: FieldValue;

    multipleValues: boolean;    // If TRUE the value of the field will be an array of values

    searchable: boolean;    // If TRUE an index will be created in the DB
    sortable: boolean;      // If TRUE an index will be created in the DB

    readPolicy:   EntityPolicy;  // Who can see the field value ?
    updatePolicy: EntityPolicy;  // Who can change/edit the field value ?
}

export type EntityPolicy =
    | "all"                 // Everyone can to the operation
    | "owner"               // Only the owner (the one that created the item) can do the operation
    | "group:{GroupID}"     // Only users belonging to group 'xxx' can do the operation 


// Each entity will have its own dedicated DB table. Example: "customers"
export interface Entity {
    id: number;             // PK, autoincrement
    
    createdAt: Date;        // The date when the item is created
    createdBy: string;      // The user that created this item
    
    updatedAt: Date;        // The date when the item is updated / deleted
    updatedBy: string;      // The user that updated this item
    
    title:  string;         // A title representing the item
    status: string;         // Enumeration. Status can be changed via EntityStatusTransition
    active: boolean;        // Active=false ==> Soft deleted

    readPolicy:   EntityPolicy;   // Who can read the data
    updatePolicy: EntityPolicy;   // Who can read the data
    deletePolicy: EntityPolicy;   // Who can read the data

    fields: {[key: string]: FieldValue};   // The other dynamic fields { "key": value}, stored as JSON data
}

// If an entity requires versioning, a dedicated table will be created (ex: customers_history)
interface EntityHistory extends Entity {
    entityID: number;       // The entity ID

    event:      "create" | "update" | "delete";
    eventDate:  Date;
    eventOwner: string;     // The user that triggered this event
}


interface EntityRelation {    
    A_Entity: string;           // Example: 'customer'
    A_EntityField: string;      // Example: 'id'

    B_Entity: string;           // Example: 'invoice'
    B_EntityField: string;      // Example: 'customer_id'

    type: "1:1" | "1:N" | "N:N" // Example: '1:N'
}

// When a N:N relation is defined, automatically a DB table <A_Entity>_x_<B_Entity> is generated
// with the following fields: id (pk, autoincrement), <A_EntityField>, <B_EntityField>

// If an entity (i.e. a table) is deleted the linked table is dropped and also all the related relations 
// will be deleted (including any A_x_B N:N relation table)

// Example: 
//  - Entity { 'customer', relation: { type: '1:N', sourceField: 'id', targetEntity: 'invoice', targetField: 'customerID'}}
//  - Entity { 'invoice',  relation: { type: '1:1', sourceField: 'customerID', targetEntity: 'customer', targetField: 'id'}}
// 
// Query: all invoices of a customer (1:N)
//   SELECT * FROM Invoice INNER JOIN Customer ON Customer.id = Invoice.customer_id  
// 
// Query: the customer associated to an invoice (1:1)
//   SELECT * FROM Customer INNER JOIN Invioce ON Customer.id = Invoice.customer_id LIMIT 1
// 
// Query: authors x books (N:N)
//   a) All books for a specific author
//      SELECT * FROM Books INNER JOIN Books_x_Author ON Books.author_id = Books_x_Author.author_id   
//   b) All authors for a specific book
//      SELECT * FROM Authors INNER JOIN Books_x_Author ON Books.id = Books_x_Author.book_id   


export interface EntityManager {
    getEntitySchema (entityName: string) : EntitySchema;
    getEntityById   (entityName: string, id: number) : Entity;
    getEntityByQuery(entityName: string, query: EntityQuery) : Entity[]
}

export interface EntityQuery {
    // ...
    paged: boolean;     // Example: true
    pageSize: number;   // Example: 20 (20 rows x page)
    page: number;       // Example: 2 (page #2)

    filter: QueryCondition; // AND/OR/NOT SqlCondition => a=b, a>b, a<b, a IS NULL, a IS NOT NULL, a LIKE b, ...
}

export interface BasicCondition {
    field: string;
    op: "=" | "!=" | "<" | "<=" | ">"| ">="| "IS NULL"| "IS NOT NULL" | "LIKE" | "BETWEEN" | "IN" 
    value: FieldValue;
}

export interface LogicCondition {
    cond1: BasicCondition | LogicCondition;
    cond2: BasicCondition | LogicCondition;
    logic: "AND" | "OR" 
}

export interface NotCondition {
    cond: LogicCondition | NotCondition
}

export type QueryCondition = BasicCondition | LogicCondition | NotCondition;


let q1: QueryCondition = { field: "color", op: "=", value: "red" }
let q2: QueryCondition = { field: "age", op: ">", value: 38 }
let q3: QueryCondition = { cond1: q1, logic: "AND", cond2: q2 }