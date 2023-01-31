const recast = require("recast")

const code = `function add(a,b){
    return a+b
}`
/**
 * recast解析代码
 * @type :FunctionDeclaration
 * @id :{name:'add',type:'Indentifier'}
 * @params :[Indentifier{name:'a'},Indentifier{name:'b'}]
 * @body :BlockStatement{}
 */
const ast = recast.parse(code)
const add = ast.program.body[0]

console.log(add)
console.log(add.params[0])
console.log(add.body.body[0].argument.left)


/**导入
 * @variableDeclaration 变量声明对象-const
 * @variableDeclarator 创建对象-add
 * @functionExpression 组件-id/params/body
 * **/
const {variableDeclaration,variableDeclarator,functionExpression} = recast.types.builders
ast.program.body[0] = variableDeclaration("const",[
    variableDeclarator(add.id,functionExpression(
        null,
        add.params,
        add.body
    ))
])
//recast.parse的逆向过程 
//recast.print(recast.parse(source)).code === source
const output = recast.print(ast).code
console.log(output)