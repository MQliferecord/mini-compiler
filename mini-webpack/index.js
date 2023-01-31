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
 * 3.获取依赖关系，traverse遍历节点，找到节点中存的source.value
 * 4.将遍历得到的source中的值使用的ejs导入转换成为cjs代码
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
 * 建立关系图
 * 之所以使用图模型，主要是循环引用
 * 输出各个文件的value和import
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
 * @graph 
 * 创建模板格式key:value
 * 根据理想的代码格式
 * 希望template中的数据转换成filePath和code
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

