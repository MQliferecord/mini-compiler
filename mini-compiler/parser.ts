import {Token, TokenTypes,createRootNode,createNumberNode,createCallExpressionNode} from "./ast"

/**
 * @parser 
 * 得到token数组后
 * 将代码按照AST树的格式存储为相关的对象
 * 因为 树存储 的特性
 * 能更清晰地将代码模块化拆解
 */
export function parser(tokens: Token[]) {
    let current = 0
    const rootNode = createRootNode()
    function walk() {
        let token = tokens[current]

        if (token.type === TokenTypes.number) {
            current++
            return createNumberNode(token.value)
        }

        if (token.type === TokenTypes.paren && token.value === "(") {
            token = tokens[++current]
            const node = createCallExpressionNode(token.value)
            token = tokens[++current]
            while (!(token.type === TokenTypes.paren && token.value === ")")) {
                node.params.push(walk())
                token = tokens[current]
            }
            current++
            return node
        }

        throw new Error(`不认识的token:${token}`)
    }
    while(current<tokens.length){
        rootNode.body.push(walk())
    }
    return rootNode
}