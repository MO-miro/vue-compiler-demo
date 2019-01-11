// @flow
import parseHtml from './parseHtml'
import parseText from './parseText'
import {
    getAndRemoveAttr,
    addDirective,
} from '../helpers'

const forReg = /(.*?)\s+(?:in|of)\s+(.*)/
const forIteratorReg = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/
const directionReg = /^v-|^@|^:/
const modifierRE = /\.[^.]+/g
const argRE = /:(.*)$/
export default function parse(template :string) : ASTElement | void {
    // tag栈
    const stack = []
    // AST树根节点
    let root,
        curParent
    parseHtml(template, {
        start(tag) {
            const { tagName, attrsList, unary } = tag
            const element : ASTElement = {
                type: 1,
                tag: tagName,
                attrsList,
                attrsMap: makeAttrsMap(attrsList), // 帮助速查属性
                parent: curParent || 'root',
                children: [],
            }
            /**
             * 处理特殊的属性,包括 key, ref, v-xx指令,slot等
             * 这里暂时只做v-for和v-model的处理
             * v-model的处理实际是从platforms中传入的options获取，这里放在compiler中。目前只支持input标签
             */
            // 处理v-for指令
            processFor(element)
            // 处理其他指令
            processAttrs(element)

            element.plain = !element.key && !attrsList.length
            // 处理树结构
            if (!root) {
                root = element
            }
            if (curParent) {
                curParent.children.push(element)
            }
            // 如果不是自闭合标签，入栈,修改父节点
            if (unary) {
                curParent = element
                stack.push(element)
            }
        },
        end() {
            // 修改curParrent指向
            if (stack.pop()) {
                curParent = stack[stack.length - 1]
            }
        },
        handleContent(content) {
            if (!curParent) {
                return
            }
            let exp
            if (content && (exp = parseText(content))) {
                const expNode : ASTExpression = {
                    type: 2,
                    expression: exp,
                    text: content,
                }
                curParent.children.push(expNode)
            } else {
                const textNode : ASTText = {
                    type: 3,
                    text: content,
                }
                curParent.children.push(textNode)
            }
        },
        warn(msg) {
            console.log(msg)
        },
    })
    return root
}

function makeAttrsMap(attrs: Array<Object>): Object {
    const map = {}
    for (let i = 0, l = attrs.length; i < l; i++) {
      if (map[attrs[i].name]) {
        console.log('duplicate attribute: ' + attrs[i].name)
      }
      map[attrs[i].name] = attrs[i].value
    }
    return map
}

// 处理v-for
function processFor(el) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const inMatch = exp.match(forReg)
    if (!inMatch) {
        console.log(`Invalid v-for expression: ${exp}`)
      return
    }
    el.for = inMatch[2].trim()
    const alias = inMatch[1].trim()
    const iteratorMatch = alias.match(forIteratorReg)
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim()
      el.iterator1 = iteratorMatch[2].trim()
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim()
      }
    } else {
      el.alias = alias
    }
  }
}

// 处理attrs
function processAttrs(el) {
  
    const list = el.attrsList
    let i, l, name, rawName, value  
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name
      value = list[i].value
      if (directionReg.test(name)) {
        // mark element as dynamic
        el.hasBindings = true
        // normal directives
        name = name.replace(directionReg, '')
        // parse arg
        const argMatch = name.match(argRE)
        const arg = argMatch && argMatch[1]
        if (arg) {
        name = name.slice(0, -(arg.length + 1))
        }
        addDirective(el, name, rawName, value, arg)  
      } else {
        // literal attribute 暂时不管
      }
    }
}