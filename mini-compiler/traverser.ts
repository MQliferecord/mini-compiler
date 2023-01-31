import { NodeTypes, RootNode, ChildNode, CallExpressionNode } from "./ast";

type ParentNode = RootNode|CallExpressionNode|undefined
type MethodFn = (node:RootNode|ChildNode,parent:ParentNode)=>void

interface VisitorOptions{
    enter:MethodFn
    exit?:MethodFn
}
export interface Visitor{
    Program?:VisitorOptions
    CallExpression?:VisitorOptions
    NumberLiteral?:VisitorOptions
    StringLiteral?:VisitorOptions
}

/**
 * @traverser
 * 对构造的树模型进行遍历、节点检查和命名格式统一
 * 检查parser拆解出来的AST树的子节点和对应的父节点是否正确
 */

export function traverser(rootNode:RootNode,visitor:Visitor){
    //1.深度优先搜索

    function traverseArray(array:ChildNode[],parent:ParentNode){
        array.forEach((node) => {
            traverseNode(node,parent)
        });
    }
    function traverseNode(node:RootNode|ChildNode,parent?:ParentNode){
        const methods = visitor[node.type]
        //enter
        if(methods){
            methods.enter(node,parent)
        }
        switch(node.type) {
            case NodeTypes.NumberLiteral:
                break;
            case NodeTypes.CallExpression:
                traverseArray(node.params,node)
                break;
            case NodeTypes.Program:
                traverseArray(node.body,node)
                break;
        }
        //exit
        if(methods&&methods.exit){
            methods.exit(node,parent)
        }
    }
    traverseNode(rootNode)
    //2.调用visitor
}