import {test,expect} from "vitest"
import { TokenTypes,NodeTypes} from "./ast"
import {parser} from "./parser"
test('tokenizer',()=>{
    //输入
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
    const ast = {
        type:NodeTypes.Program,
        body:[
            {
                type:NodeTypes.CallExpression,
                name:"add",
                params:[
                    {
                        type:NodeTypes.NumberLiteral,
                        value:"2"
                    },
                    {
                        type:NodeTypes.CallExpression,
                        name:"subtract",
                        params:[
                            {
                                type:NodeTypes.NumberLiteral,
                                value:"4"
                            },
                            {
                                type:NodeTypes.NumberLiteral,
                                value:"2"
                            },
                        ]
                    }
                ]
            }
        ]
    }
    expect(parser(tokens)).toEqual(ast)
})

test.skip('number',()=>{
    const tokens = [
        {
            type:TokenTypes.number,
            value:"2"
        }
    ]
    const ast = {
        type:NodeTypes.Program,
        body:[
            {
                type:NodeTypes.NumberLiteral,
                value:"2"
            }
        ]
    }
    expect(parser(tokens)).toEqual(ast)
})

test.skip('two callExpression',()=>{
    const tokens = [
        {type:TokenTypes.paren,value:'('       },
        {type:TokenTypes.name,  value:'add'     },
        {type:TokenTypes.number,value:'2'       },
        {type:TokenTypes.number,value:'4'       },
        {type:TokenTypes.paren,value:')'       },
        {type:TokenTypes.paren,value:'('       },
        {type:TokenTypes.name,  value:'add'     },
        {type:TokenTypes.number,value:'3'       },
        {type:TokenTypes.number,value:'5'       },
        {type:TokenTypes.paren,value:')'       },
    ]
    const ast = {
        type:NodeTypes.Program,
        body:[
            {
                type:NodeTypes.CallExpression,
                name:"add",
                params:[
                    {
                        type:NodeTypes.NumberLiteral,
                        value:"2"
                    },
                    {
                        type:NodeTypes.NumberLiteral,
                        value:"4"
                    }
                ]
            },
            {
                type:NodeTypes.CallExpression,
                name:"add",
                params:[
                    {
                        type:NodeTypes.NumberLiteral,
                        value:"3"
                    },
                    {
                        type:NodeTypes.NumberLiteral,
                        value:"5"
                    }
                ]
            },
        ]
    }
    expect(parser(tokens)).toEqual(ast)
})