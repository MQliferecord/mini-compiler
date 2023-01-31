/**
 * 命令行输入 node read demo.js
 * @run 通过命令行读取JS文件，并转化为ast以供处理
 * @printSource 能够将ast的内容转化为源码
 * @visit AST节点遍历
 */

const recast = require('recast')
// TNT判断ast的数据类型
const TNT = recast.types.namedTypes

recast.run(function(ast,printSource){
    //printSource(ast)
    recast.visit(ast,{
        /**
         * @visiFunctionDelaration 遍历函数声明
         * @visitExpressionStatement 遍历赋值表达式
         * */
        
        visitExpressionStatement:function({node}){
            //通过node获得AST对象
            //必须具有以下两种写法结尾

            /**
             * 1.输出AST对象
            console.log(node)
            return false
            */

            /**
             * 2.输出源码
             * const node = path.node
             * printSource(node)
             * this.traverse(path)
             */
            /** 判断是否是ExpressionStatement
            if(TNT.ExpressionStatement.check(node)){
                console.log('这是一个ExpressionStatement')
            }
            this.traverse(path)
            */
        }
    })
})
