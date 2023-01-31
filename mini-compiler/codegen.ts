/**
 * @codegen
 * 读取树模型
 * 按照指定的代码规范重新进行拼接
 */

export function codegen(node){
    switch (node.type) {
        case "Program":
            return node.body.map(codegen).join("")
        case "ExpressionStatement":
            return codegen(node.expression)+";"
        case "NumberLiteral":
            return node.value
        case "CallExpression":
            return (node.callee.name + "(" + node.arguments.map(codegen).join(", ") +")")
    }
}