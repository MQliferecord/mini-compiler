import fs from "fs"
import path from "path"
import parser from "@babel/parser"
import traverse from "@babel/traverse"
import ejs from "ejs"
import {transformFormAst} from "babel-core"

let id = 0;

/**
 * @createAsset
 * 1.获取文件内容
 * 2.获取抽象语法树
 * 3.获取依赖关系，traverse遍历节点，找到相关文件的import
 * 4.将得到的import数据放到deps数组中
 * 5.将得到的文件的内容source从ejs转换成为cjs
 * 6.最后抛出
 * （1）filePath 自身文件的地址
 * （2）code 自身的cjs模式下的代码
 * （3）deps 自身引用的文件
 * （4）mapping 给后面防止索引的空对象
 * （5）id 当前执行文件在图中的序列号
 */

function createAsset(filePath){
    const source = fs.readFileSync(filePath,{
        encoding:"utf-8"
    })
    const ast = parser.parse(source,{
        sourceType:"module"
    })

    const deps = []
    traverse.default(ast,{
        ImportDeclaration({node}){
            deps.push(node.source.value)
        }
    })

    const {code} = transformFormAst(ast,null,{
        presets:["env"]
    })

    return{
        filePath,
        code,
        deps,
        mapping:{},
        id:id++
    }
}

/**
 * @createGraph
 * 从createAsset得到入口文件创建的对象
 * 然后对其和他的引用文件进行广度遍历
 * 这里采用队列的数据结构，也可以使用递归直到asset的deps==null
 * 将得到的数据存在队列数组中
 * 
 * 同时将deps中的引用路径和引用文件的id号以key(引用路径)-value(id号)
 * 主要是后续在模板文件中希望通过source内的引用value找到mapping中的id号，然后找到模板中id对应的文件
 * 
 * 成功建立关系图
 * 之所以使用图模型，主要是各个文件之间可能存在循环引用
 * 输出是多个asset组成的数组，每个asset的mapping插入了索引
 * */
function createGraph(){
    const mainAsset = createAsset("./example/main.js");

    //广度优先搜索
    const queue = [mainAsset]

    for(const asset of queue){
        asset.deps.forEach(relativePath=>{
            const assetChild = createAsset(path.resolve("./example",relativePath))
            asset.mapping[relativePath] = assetChild.id
            queue.push(assetChild)
        })
    }
    return queue
}

const graph = createGraph()

/**
 * @build
 * 引入实现写好的模板
 * 对graph中的key-value数据进行遍历
 * 将指定数据导出到data对象中
 * 在template调用data中的数据
 * 得到的代码写入dist/bundle.js也就是打包后的文件
 */
function build(graph){
    const template = fs.readFileSync("./bundle.ejs",{encoding:"utf-8"});
    const data = graph.map((asset)=>{
        const {id,code,mapping} = asset;
        return {
            id,
            code,
            mapping
        }
    })
    const code = ejs.render(template,{data});
    fs.writeFileSync("./dist/bundle.js",code)
}

build(graph)

