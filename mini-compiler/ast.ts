export enum TokenTypes {
    paren,
    name,
    number
}

export interface Token {
    type: TokenTypes;
    value: string
}

export enum NodeTypes {
    Program="Program",
    NumberLiteral="NumberLiteral",
    StringLiteral = "StringLiteral",
    CallExpression="CallExpression"
}

export interface Node {
    type: NodeTypes
}

export type ChildNode =  NumberLiteralNode | CallExpressionNode | StringLiteralNode

export interface RootNode extends Node {
    type:NodeTypes.Program
    body: ChildNode[]
    context?:ChildNode[]
}
    
export interface NumberLiteralNode extends Node {
    type:NodeTypes.NumberLiteral
    value: string
}

export interface StringLiteralNode extends Node {
    type:NodeTypes.StringLiteral
    value: string
}

export interface CallExpressionNode extends Node {
    name: string,
    params: ChildNode[]
    type:NodeTypes.CallExpression
    context?:ChildNode[]
}

export function createRootNode(): RootNode {
    return {
        type: NodeTypes.Program,
        body: []
    }
}

export function createNumberNode(value: string): NumberLiteralNode {
    return {
        type: NodeTypes.NumberLiteral,
        value
    }
}

export function createCallExpressionNode(name: string): CallExpressionNode {
    return {
        type: NodeTypes.CallExpression,
        name,
        params: []
    }
}