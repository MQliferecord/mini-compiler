#!/usr/bin/env node
const recast = require('recast')
const {
    identifier:id,
    expressionStatement,
    memberExpression,
    assignmentExpression,
    arrowFunctionExpression,
    blockStatement
}=recast.types.builders

const fs = require('fs')
const path = require('path')

//截取参数
const options = process.argv.slice(2)
//提供提示
if(options.length === 0||options.includes('-h')||options.includes('--help')){
    console.log(`采用commonjs规则,将.js文件内所有函数修改为导出形式。

    选项： -r  或 --rewrite 可直接覆盖原有文件`)
    process.exit(0)
}
//只要输入的参数中包括 -r||-rewrite 则rewriteMode为true
let rewriteMode = options.includes('-r')||options.includes('--rewrite')

//获取文件名
const clearFileArg = options.filter((item)=>{
    return !['-r','--rewrite','-h','--help'].includes(item)
})

let filename = clearFileArg[0]
const writeASTFile = function(ast,filename,rewriteMode){
    const newCode = recast.print(ast).code
    //非覆盖模式下
    if(!rewriteMode){
        filename = filename.split('.').slice(0,-1).concat(['export','js']).join('.')
    }
    //将新代码写入文件
    fs.writeFileSync(path.join(process.cwd(),filename),newCode)
}


recast.run(function(ast,printSource){
    /** 
    //创建块级作用域 {}
    console.log('\n\nstep1:')
    printSource(blockStatement([]))

    //创建箭头函数 ()=>{}
    console.log('\n\nstep2:')
    printSource(arrowFunctionExpression([],blockStatement([])))

    //add赋值为箭头函数 add=()=>{}
    console.log('\n\nstep3:')
    printSource(assignmentExpression('=',id('add'),arrowFunctionExpression([],blockStatement([]))))

    //exports.add赋值为箭头函数 exports.add = ()=>{}
    console.log('\n\nstep4:')
    printSource(expressionStatement(assignmentExpression('=',memberExpression(id('exports'),id('add')),arrowFunctionExpression([],blockStatement([])))))
    */
   let funcIds = []
   //遍历单个函数调用并进行替换
   recast.types.visit(ast,{
    visitFunctionDeclaration(path){
        const node = path.node
        const funcName = node.id
        const params = node.params
        const body = node.body
        funcIds.push(funcName.name)
        const rep = expressionStatement(assignmentExpression('=',memberExpression(id('exports'),funcName),arrowFunctionExpression(params,body)))
        path.replace(rep)
        return false
    }
   })
   //遍历demo.js内的所有函数调用并进行替换
   recast.types.visit(ast,{
    visitCallExpression(path){
        const node = path.node
        if(funcIds.includes(node.callee.name)){
            node.callee = memberExpression(id('exports'),node.callee)
        }
        return false
    }
   })
   writeASTFile(ast,filename,rewriteMode)
})

/**
 * 使用exportific xx.js运行文件
 */



