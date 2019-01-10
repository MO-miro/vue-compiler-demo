// @flow 
import parseHtml from './parseHtml'
import parseText from './parseText'
import {
    getAndRemoveAttr
} from '../helpers'

const forReg = /(.*?)\s+(?:in|of)\s+(.*)/
const forIteratorReg = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/
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
                attrsMap: makeAttrsMap(attrsList),//{ [key: string]: string | null };
                parent: curParent || 'root',
                children: [],
            }
            // 处理v-xx指令
            processFor(element)
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

function makeAttrsMap (attrs: Array<Object>): Object {
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
function processFor (el) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const inMatch = exp.match(forReg)
    if (!inMatch) {
        console.log(
            `Invalid v-for expression: ${exp}`
        )
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
