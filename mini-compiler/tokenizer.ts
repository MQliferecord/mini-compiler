import {Token,TokenTypes} from "./ast"

/**
 * @tokenizer 
 * 将程序输入的代码拆解为一个数组
 * 数组存放多个对象
 * 每个对象代表一个基础js数据
 * 对象的type，存储js数据的基础类型，value存储值
 */

export function tokenizer(code: string) {
    const tokens: Token[] = []
    let current = 0
    while (current < code.length) {
        let char = code[current]

        const WHITESPACE = /\s/
        if(WHITESPACE.test(char)){
            current++
            continue
        }

        if (char == "(") {
            tokens.push({
                type: TokenTypes.paren,
                value: char
            })
            current++
            continue
        }

        if (char == ")") {
            tokens.push({
                type: TokenTypes.paren,
                value: char
            })
            current++
            continue
        }

        const LETTERS = /[a-z]/i
        if (LETTERS.test(char)) {
            let value = ""
            while (LETTERS.test(char) && current < code.length) {
                value += char
                char = code[++current]
            }
            tokens.push({
                type: TokenTypes.name,
                value
            })
        }

        const NUMBERS = /[0-9]/
        if (NUMBERS.test(char)) {
            let value = ""
            while (NUMBERS.test(char) && current < code.length) {
                value += char
                char = code[++current]
            }
            tokens.push({
                type: TokenTypes.number,
                value
            })
        }
    }
    return tokens
}