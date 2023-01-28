
export interface DesignTokenBase {
    name: string;                   // Example: 'myColor'
    description?: string;
}

export enum TokenType {
    Dimension = 'dimension',            // Example: '50px'
    Color     = 'color',                // Example: '#00aa56fa'
    Font      = 'font',                 // Example: "Arial"
    Group     = 'group'
}

export interface DesignToken extends DesignTokenBase {
    value: number | string | boolean | CompositeDesignToken;
    // Examples: 10, 55, 'hello', 'ab00ff0', '{ aliasToAnotherToken }'
    type: TokenType
}



export type CompositeDesignToken = DesignToken[];

export interface Group extends DesignTokenBase {
    contents: (DesignToken | Group)[]
}

export interface DesignTokenFile {
    name: string;
    description?: string;
    root: Group;
}

const f : DesignTokenFile = {
    name: 'myFile',
    description: 'My optional descr',
    root: {
        name: 'rootnode',
        contents: [
            { name: 'Black',         type: TokenType.Color, value: '#000000' },
            { name: 'Primary Color', type: TokenType.Color, value: '{Black}' },
            { name: 'Brand',         type: TokenType.Group, contents: [
                { name: 'Dark Backgorund', type: TokenType.Color, value: '{/rootnode/Black}' },   // Reference to a token in another group
                { name: 'Spacer',          type: TokenType.Dimension, value: '16px' },   
                { name: 'IconSize-MD',     type: TokenType.Dimension, value: '24px' },   
                { name: 'IconSize-XL',     type: TokenType.Dimension, value: '48px' },   
            ]}

        ]
    }
}


// Multi-User Synch DB

interface Document {
    id: string;
    pages: Page[];
}

interface Page {
    id: string;
    root: Node;
}

interface Node {
    id:         string;
    props:      Props;
    children?:  Node[] 
}

interface Props {
    [key: string]: string | number | boolean
}

// https://madebyevan.com/figma/how-figmas-multiplayer-technology-works/
