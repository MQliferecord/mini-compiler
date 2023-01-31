import { NodeTypes, RootNode } from "./ast";
import { traverser } from "./traverser";

/**
 * @transformer
 * 调用traverse，进行代码规范化
 * 将命名格式统一成codegen能够读取的格式
 */
export function transformer(ast: RootNode) {
    const newAST = {
        type: NodeTypes.Program,
        body: []
    }

    ast.context = newAST.body

    traverser(ast, {
        CallExpression: {
            enter(node, parent) {
                if (node.type === NodeTypes.CallExpression) {
                    let expression:any = {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: node.name
                        },
                        arguments: []
                    }

                    node.context = expression.arguments

                    if(parent?.type !== NodeTypes.CallExpression){
                        expression = {
                            type:"ExpressionStatement",
                            expression
                        }
                    }

                    parent?.context?.push(expression)
                }
            }
        },
        NumberLiteral:{
            enter(node,parent){
                if(node.type === NodeTypes.NumberLiteral){
                    const numberNode:any = {
                        type:"NumberLiteral",
                        value:node.value
                    }
                    parent?.context?.push(numberNode)
                }
            }
        }
    })
    return newAST
}