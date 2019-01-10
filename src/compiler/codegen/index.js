// @flow
import { genModel } from '../directives/bind'
import { genHandlers } from './event'
let staticRenderFns     // 渲染静态子树
// 平台支持定义的指令，这里把v-model写死
const platformDirectives = { 'model' : genModel}

// 函数入口
export default function generate (
    ast: ASTElement | void
  ): {
    render: string,
    staticRenderFns: Array<string>
  } {
    // 保存之前的staticRenderFns
    const prevStaticRenderFns: Array<string> = staticRenderFns
    const currentStaticRenderFns: Array<string> = staticRenderFns = []
    const code = ast ? genElement(ast) : '_c("div")'
    return {
      render: `with(this){return ${code}}`,
      staticRenderFns: currentStaticRenderFns
    }
}
// 处理元素节点
function genElement (el: ASTElement): string {
    // 处理静态子树
    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el)
      // 处理v-for指令
    } else if (el.for && !el.forProcessed) {
      return genFor(el)
    } else {
        let code
        const data = el.plain ? undefined : genData(el)
        // 处理子节点
        const children =  genChildren(el, true)
        // 拼接代码
        code = `_c('${el.tag}'${
            data ? `,${data}` : '' 
        }${
            children ? `,${children}` : '' 
        })`  
        return code 
    }
}
// 处理子节点
function genChildren (el: ASTElement, checkSkip?: boolean): string | void {
    const children = el.children
    if (children.length) {
      const el: any = children[0]
      // 快速处理单个子节点的v-for
      if (children.length === 1
            && el.for) {
        return genElement(el)
      }
      // 遍历children,生成节点
      return `[${children.map(genNode).join(',')}]`
    }
  }
// 生成节点
function genNode (node: ASTNode): string {
    if (node.type === 1) {
      return genElement(node)
    } else {
      return genText(node)
    }
}
// 生成文本节点
function genText (text: ASTText | ASTExpression): string {
    return `_v(${text.type === 2
      ? text.expression 
      : JSON.stringify(text.text)
    })`
  }
// 静态子树处理生成代码，push到staticRenderFns中
function genStatic (el: ASTElement): string {
    el.staticProcessed = true
    staticRenderFns.push(`with(this){return ${genElement(el)}}`)
    return `_m(${staticRenderFns.length - 1})`
}
// 生成数据
function genData (el: ASTElement): string {
    let data = '{'
    // 生成指令
    const dirs = genDirectives(el)
    if (dirs) data += dirs + ','
  
    // key
    if (el.key) {
      data += `key:${el.key},`
    }
    // attributes
    if (el.attrsList) {
      data += `attrs:{${genProps(el.attrsList)}},`
    }
    // 添加事件
    if (el.events) {
      data += `${genHandlers(el.events, false)},`
    }
    // if (el.nativeEvents) {
    //   data += `${genHandlers(el.nativeEvents, true)},`
    // }
    data = data.replace(/,$/, '') + '}'
    return data
}

// 处理attribute数据
function genProps (props: Array<{ name: string, value: string }>): string {
    let res = ''
    for (let i = 0; i < props.length; i++) {
      const prop = props[i]
      res += `"${prop.name}":${prop.value},`
    }
    return res.slice(0, -1)
  }
// 生成指令（v-model）代码
function genDirectives (el: ASTElement): string | void {
    const dirs = el.directives
    if (!dirs) return
    let res = 'directives:['
    let hasRuntime = false
    let i, l, dir, needRuntime
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i]
      needRuntime = true
      // 平台支持的指令
      const gen  = platformDirectives[dir.name] 
      if (gen) {
        needRuntime = !!gen(el, dir )
      }
      if (needRuntime) {
        hasRuntime = true
        res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
          dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
        }${
          dir.arg ? `,arg:"${dir.arg}"` : ''
        }},`
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + ']'
    }
}
// 生成v-for代码
function genFor (el: any): string {
    const exp = el.for
    const alias = el.alias
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''
    el.forProcessed = true
    return `_l((${exp}),` +
      `function(${alias}${iterator1}${iterator2}){` +
        `return ${genElement(el)}` +
      '})'
}