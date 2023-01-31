import {test,expect} from "vitest"
import { TokenTypes} from "./ast"
import { tokenizer } from "./tokenizer"
test('tokenizer',()=>{
    //输入
    const code = `(add 2 (subtract 4 2))`
    const tokens = [
        {type:TokenTypes.paren,value:'('       },
        {type:TokenTypes.name,  value:'add'     },
        {type:TokenTypes.number,value:'2'       },
        {type:TokenTypes.paren,value:'('       },
        {type:TokenTypes.name,  value:'subtract'},
        {type:TokenTypes.number,value:'4'       },
        {type:TokenTypes.number,value:'2'       },
        {type:TokenTypes.paren,value:')'       },
        {type:TokenTypes.paren,value:')'       },
    ]
    expect(tokenizer(code)).toEqual(tokens)
})

test('left paren',()=>{
    const code = `(`
    const token = [{type:TokenTypes.paren,value:'('}]
    expect(tokenizer(code)).toEqual(token)
})
test('right paren',()=>{
    const code = `)`
    const token = [{type:TokenTypes.paren,value:')'}]
    expect(tokenizer(code)).toEqual(token)
})
test('add',()=>{
    const code = `add`
    const token = [{type:TokenTypes.name,value:"add"}]
    expect(tokenizer(code)).toEqual(token)
})
test('number',()=>{
    const code = `22`
    const token = [{type:TokenTypes.number,value:"22"}]
    expect(tokenizer(code)).toEqual(token)
})

test("(add 1 2)",()=>{
    //输入
    const code = `(add 1 2)`
    const tokens = [
        {type:TokenTypes.paren,value:'('       },
        {type:TokenTypes.name,  value:'add'     },
        {type:TokenTypes.number,value:'1'       },
        {type:TokenTypes.number,value:'2'       },
        {type:TokenTypes.paren,value:')'       },
    ]
    expect(tokenizer(code)).toEqual(tokens)
})