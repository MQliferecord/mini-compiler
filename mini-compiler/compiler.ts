import {tokenizer} from "./tokenizer"
import {parser} from "./parser"
import {transformer} from "./transformer"
import { codegen } from "./codegen"

export function compiler(code:string){
    const tokens = tokenizer(code)
    const ast = parser(tokens)
    const transformAST = transformer(ast)
    
    return codegen(transformAST)
}